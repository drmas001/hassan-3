-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up proper permissions
ALTER DATABASE postgres SET search_path TO public;
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('Doctor', 'Nurse', 'Admin')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mrn VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER CHECK (age >= 0 AND age <= 150),
  gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
  diagnosis TEXT NOT NULL,
  bed_number VARCHAR(20) NOT NULL,
  admission_date TIMESTAMPTZ DEFAULT NOW(),
  history TEXT NOT NULL,
  examination TEXT NOT NULL,
  notes TEXT,
  attending_physician_id UUID REFERENCES users(id),
  status VARCHAR(20) CHECK (status IN ('Stable', 'Critical', 'Discharged')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vitals table
CREATE TABLE IF NOT EXISTS public.vitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  heart_rate INTEGER CHECK (heart_rate >= 0 AND heart_rate <= 300),
  blood_pressure VARCHAR(20),
  temperature DECIMAL(4,1) CHECK (temperature >= 30 AND temperature <= 45),
  oxygen_saturation INTEGER CHECK (oxygen_saturation >= 0 AND oxygen_saturation <= 100),
  respiratory_rate INTEGER CHECK (respiratory_rate >= 0 AND respiratory_rate <= 100),
  recorded_by UUID REFERENCES users(id),
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create medications table
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  route VARCHAR(50) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  status VARCHAR(20) CHECK (status IN ('Active', 'Discontinued', 'Completed')) NOT NULL,
  prescribed_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lab_results table
CREATE TABLE IF NOT EXISTS public.lab_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  result TEXT NOT NULL,
  unit VARCHAR(50),
  reference_range VARCHAR(100),
  status VARCHAR(20) CHECK (status IN ('Normal', 'Abnormal', 'Critical')) NOT NULL,
  ordered_by UUID REFERENCES users(id),
  resulted_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create discharges table
CREATE TABLE IF NOT EXISTS public.discharges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  discharge_date TIMESTAMPTZ NOT NULL,
  discharge_diagnosis TEXT NOT NULL,
  discharge_summary TEXT NOT NULL,
  discharge_medications TEXT,
  follow_up_instructions TEXT,
  discharge_condition VARCHAR(20) CHECK (discharge_condition IN ('Improved', 'Stable', 'Deteriorated', 'Deceased')) NOT NULL,
  discharged_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) CHECK (type IN ('status', 'lab', 'medication', 'discharge')) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('info', 'warning', 'critical')) NOT NULL,
  user_id UUID REFERENCES users(id),
  patient_id UUID REFERENCES patients(id),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_vitals_patient_id ON vitals(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_patient_id ON lab_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_discharges_patient_id ON discharges(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE discharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin'
  ));

CREATE POLICY "All authenticated users can view patients"
  ON patients FOR SELECT
  USING (auth.role() IN ('authenticated'));

CREATE POLICY "Medical staff can manage patients"
  ON patients FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('Doctor', 'Nurse', 'Admin')
  ));

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
    BEFORE UPDATE ON medications
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();