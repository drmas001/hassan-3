import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import toast from 'react-hot-toast';

type LabResult = Database['public']['Tables']['lab_results']['Row'];

export function useLabResults(patientId: string) {
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabResults();

    const channel = supabase
      .channel('lab_results_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_results',
          filter: `patient_id=eq.${patientId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setResults((current) => [payload.new as LabResult, ...current]);
            if ((payload.new as LabResult).status === 'Critical') {
              toast.error('Critical lab result received!');
            } else {
              toast.success('New lab result received');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  async function fetchLabResults() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lab_results')
        .select('*')
        .eq('patient_id', patientId)
        .order('resulted_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching lab results:', error);
      toast.error('Failed to load lab results');
    } finally {
      setLoading(false);
    }
  }

  return {
    results,
    loading,
  };
}