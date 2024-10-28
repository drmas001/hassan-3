import { supabase } from './supabase';

export async function seedDatabase() {
  try {
    // Check if admin user already exists
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('*')
      .eq('employee_code', 'ADMIN001')
      .single();

    if (!existingAdmin) {
      // Create admin user
      const { data: adminUser, error: adminError } = await supabase
        .from('users')
        .insert([
          {
            employee_code: 'ADMIN001',
            name: 'System Administrator',
            role: 'Admin',
          },
        ])
        .select()
        .single();

      if (adminError) {
        console.error('Error creating admin user:', adminError);
        return;
      }

      // Create test patients only if admin was created successfully
      const { error: patientsError } = await supabase.from('patients').insert([
        {
          mrn: 'MRN001',
          name: 'John Doe',
          age: 45,
          gender: 'Male',
          diagnosis: 'Acute Respiratory Distress',
          bed_number: 'ICU-101',
          history: 'Patient presented with severe shortness of breath',
          examination: 'Decreased breath sounds bilaterally',
          status: 'Critical',
          attending_physician_id: adminUser.id,
        },
        {
          mrn: 'MRN002',
          name: 'Jane Smith',
          age: 62,
          gender: 'Female',
          diagnosis: 'Post-operative Monitoring',
          bed_number: 'ICU-102',
          history: 'Status post CABG',
          examination: 'Stable hemodynamics',
          status: 'Stable',
          attending_physician_id: adminUser.id,
        },
      ]);

      if (patientsError) {
        console.error('Error creating test patients:', patientsError);
      }

      console.log('Database seeded successfully');
    } else {
      console.log('Database already seeded');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}