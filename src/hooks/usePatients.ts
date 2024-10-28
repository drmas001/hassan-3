import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Patient } from '../types/patient';
import toast from 'react-hot-toast';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('admission_date', { ascending: false });

        if (error) throw error;

        setPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('patients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPatients((current) => [payload.new as Patient, ...current]);
          toast.success('New patient admitted');
        } else if (payload.eventType === 'UPDATE') {
          setPatients((current) =>
            current.map((patient) =>
              patient.id === payload.new.id ? (payload.new as Patient) : patient
            )
          );
          toast.success('Patient information updated');
        } else if (payload.eventType === 'DELETE') {
          setPatients((current) =>
            current.filter((patient) => patient.id !== payload.old.id)
          );
          toast.success('Patient discharged');
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { patients, loading };
}