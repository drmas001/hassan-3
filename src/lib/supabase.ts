import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Initialize database tables if they don't exist
async function initializeDatabase() {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table');
    if (usersError && !usersError.message.includes('already exists')) {
      console.error('Error creating users table:', usersError);
    }

    // Create patients table
    const { error: patientsError } = await supabase.rpc('create_patients_table');
    if (patientsError && !patientsError.message.includes('already exists')) {
      console.error('Error creating patients table:', patientsError);
    }

    // Create vitals table
    const { error: vitalsError } = await supabase.rpc('create_vitals_table');
    if (vitalsError && !vitalsError.message.includes('already exists')) {
      console.error('Error creating vitals table:', vitalsError);
    }

    // Create medications table
    const { error: medicationsError } = await supabase.rpc('create_medications_table');
    if (medicationsError && !medicationsError.message.includes('already exists')) {
      console.error('Error creating medications table:', medicationsError);
    }

    // Create lab_results table
    const { error: labResultsError } = await supabase.rpc('create_lab_results_table');
    if (labResultsError && !labResultsError.message.includes('already exists')) {
      console.error('Error creating lab_results table:', labResultsError);
    }

    // Create discharges table
    const { error: dischargesError } = await supabase.rpc('create_discharges_table');
    if (dischargesError && !dischargesError.message.includes('already exists')) {
      console.error('Error creating discharges table:', dischargesError);
    }

    // Create notifications table
    const { error: notificationsError } = await supabase.rpc('create_notifications_table');
    if (notificationsError && !notificationsError.message.includes('already exists')) {
      console.error('Error creating notifications table:', notificationsError);
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run initialization
initializeDatabase();

export default supabase;