import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface ReportMetrics {
  totalPatients: number;
  criticalCases: number;
  medicationsGiven: number;
  labTests: number;
  averageStayDuration: number;
  bedOccupancyRate: number;
  readmissionRate: number;
  mortalityRate: number;
}

interface ReportActivities {
  patientStatusDistribution: Array<{ name: string; value: number }>;
  dailyActivities: Array<{ name: string; value: number }>;
  topProcedures: Array<{ name: string; count: number }>;
  commonDiagnoses: Array<{ name: string; count: number }>;
}

export function useReports(dateRange: DateRange) {
  const [metrics, setMetrics] = useState<ReportMetrics>({
    totalPatients: 0,
    criticalCases: 0,
    medicationsGiven: 0,
    labTests: 0,
    averageStayDuration: 0,
    bedOccupancyRate: 0,
    readmissionRate: 0,
    mortalityRate: 0,
  });

  const [activities, setActivities] = useState<ReportActivities>({
    patientStatusDistribution: [],
    dailyActivities: [],
    topProcedures: [],
    commonDiagnoses: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchReportData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch patients count and status distribution
        const { data: patients, error: patientsError } = await supabase
          .from('patients')
          .select('status')
          .gte('admission_date', dateRange.startDate.toISOString())
          .lte('admission_date', dateRange.endDate.toISOString());

        if (patientsError) throw patientsError;

        // Fetch medications count
        const { count: medicationsCount, error: medsError } = await supabase
          .from('medications')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dateRange.startDate.toISOString())
          .lte('created_at', dateRange.endDate.toISOString());

        if (medsError) throw medsError;

        // Fetch lab tests count
        const { count: labsCount, error: labsError } = await supabase
          .from('lab_results')
          .select('*', { count: 'exact', head: true })
          .gte('resulted_at', dateRange.startDate.toISOString())
          .lte('resulted_at', dateRange.endDate.toISOString());

        if (labsError) throw labsError;

        // Calculate metrics
        const statusDistribution = patients?.reduce((acc, curr) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setMetrics({
          totalPatients: patients?.length || 0,
          criticalCases: statusDistribution?.Critical || 0,
          medicationsGiven: medicationsCount || 0,
          labTests: labsCount || 0,
          averageStayDuration: 5.2, // Mock data - implement actual calculation
          bedOccupancyRate: 0.85, // Mock data - implement actual calculation
          readmissionRate: 0.12, // Mock data - implement actual calculation
          mortalityRate: 0.04, // Mock data - implement actual calculation
        });

        setActivities({
          patientStatusDistribution: Object.entries(statusDistribution || {}).map(
            ([name, value]) => ({ name, value })
          ),
          dailyActivities: [
            { name: 'Admissions', value: 12 },
            { name: 'Discharges', value: 8 },
            { name: 'Procedures', value: 15 },
            { name: 'Lab Tests', value: 45 },
          ],
          topProcedures: [
            { name: 'Mechanical Ventilation', count: 24 },
            { name: 'Central Line Placement', count: 18 },
            { name: 'Bronchoscopy', count: 12 },
            { name: 'Chest Tube Placement', count: 8 },
            { name: 'Intubation', count: 6 },
          ],
          commonDiagnoses: [
            { name: 'Respiratory Failure', count: 32 },
            { name: 'Sepsis', count: 28 },
            { name: 'Pneumonia', count: 22 },
            { name: 'Heart Failure', count: 18 },
            { name: 'Stroke', count: 14 },
          ],
        });
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError(err as Error);
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    }

    fetchReportData();
  }, [dateRange]);

  return { metrics, activities, loading, error };
}