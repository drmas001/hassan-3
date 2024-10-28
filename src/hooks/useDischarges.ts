import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import toast from 'react-hot-toast';

type Discharge = Database['public']['Tables']['discharges']['Row'];

export function useDischarges(patientId?: string) {
  const [discharges, setDischarges] = useState<Discharge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDischarges();

    const channel = supabase
      .channel('discharges_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discharges',
          ...(patientId ? { filter: `patient_id=eq.${patientId}` } : {}),
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDischarges((current) => [payload.new as Discharge, ...current]);
            toast.success('New discharge record added');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  async function fetchDischarges() {
    try {
      setLoading(true);
      const query = supabase
        .from('discharges')
        .select('*')
        .order('discharge_date', { ascending: false });

      if (patientId) {
        query.eq('patient_id', patientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDischarges(data || []);
    } catch (error) {
      console.error('Error fetching discharges:', error);
      toast.error('Failed to load discharge records');
    } finally {
      setLoading(false);
    }
  }

  return {
    discharges,
    loading,
  };
}