import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import toast from 'react-hot-toast';

type Vitals = Database['public']['Tables']['vitals']['Row'];

export function useVitals(patientId: string) {
  const [vitals, setVitals] = useState<Vitals[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVitals();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('vitals_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vitals',
          filter: `patient_id=eq.${patientId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVitals((current) => [...current, payload.new as Vitals]);
            toast.success('New vitals recorded');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  async function fetchVitals() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false });

      if (error) {
        throw error;
      }

      setVitals(data);
    } catch (error) {
      toast.error('Error fetching vitals');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return { vitals, loading };
}