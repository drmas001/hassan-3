import React, { useState } from 'react';
import { useVitals } from '../hooks/useVitals';
import { useMedications } from '../hooks/useMedications';
import { useLabResults } from '../hooks/useLabResults';
import { VitalsChart } from './VitalsChart';
import { MedicationList } from './MedicationList';
import { LabResults } from './LabResults';
import { DischargeButton } from './DischargeButton';
import { DischargeForm } from './DischargeForm';
import { LoadingSpinner } from './LoadingSpinner';
import {
  Heart,
  Thermometer,
  Wind,
  Clock,
  User,
  FileText,
  Activity,
  Pill,
  TestTube,
  Hash,
  Bed,
  Stethoscope,
  ClipboardList,
} from 'lucide-react';
import type { Database } from '../types/supabase';

type Patient = Database['public']['Tables']['patients']['Row'];

interface PatientDetailsProps {
  patient: Patient;
}

type Tab = 'overview' | 'vitals' | 'medications' | 'labs' | 'discharge';

export function PatientDetails({ patient }: PatientDetailsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showDischargeForm, setShowDischargeForm] = useState(false);
  const { vitals, loading: vitalsLoading } = useVitals(patient.id);
  const { medications, loading: medsLoading, updateMedicationStatus } = useMedications(patient.id);
  const { results: labResults, loading: labsLoading } = useLabResults(patient.id);
  const latestVitals = vitals[0];

  const handleDischarge = () => {
    setShowDischargeForm(true);
    setActiveTab('discharge');
  };

  const handleDischargeComplete = () => {
    setShowDischargeForm(false);
    setActiveTab('overview');
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="h-12 w-12 text-blue-500" />
            <div className="ml-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                <span className="text-gray-500">
                  <Hash className="h-4 w-4 inline" /> {patient.mrn}
                </span>
              </div>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>{patient.age} years</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span>
                  <Bed className="h-4 w-4 inline mr-1" />
                  Bed {patient.bed_number}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              patient.status === 'Critical' 
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {patient.status}
            </span>
            {patient.status !== 'Discharged' && (
              <DischargeButton 
                onDischarge={handleDischarge}
                disabled={showDischargeForm}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <FileText className="h-5 w-5 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`${
              activeTab === 'vitals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Activity className="h-5 w-5 mr-2" />
            Vitals
          </button>
          <button
            onClick={() => setActiveTab('medications')}
            className={`${
              activeTab === 'medications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Pill className="h-5 w-5 mr-2" />
            Medications
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`${
              activeTab === 'labs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <TestTube className="h-5 w-5 mr-2" />
            Lab Results
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Diagnosis */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Stethoscope className="h-5 w-5 text-gray-500" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">Diagnosis</h3>
              </div>
              <p className="text-gray-600">{patient.diagnosis}</p>
            </div>

            {/* History */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-gray-500" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">History</h3>
              </div>
              <p className="text-gray-600 whitespace-pre-line">{patient.history}</p>
            </div>

            {/* Examination */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <ClipboardList className="h-5 w-5 text-gray-500" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">Physical Examination</h3>
              </div>
              <p className="text-gray-600 whitespace-pre-line">{patient.examination}</p>
            </div>

            {/* Notes */}
            {patient.notes && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">Additional Notes</h3>
                </div>
                <p className="text-gray-600 whitespace-pre-line">{patient.notes}</p>
              </div>
            )}

            {/* Admission Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-gray-500" />
                <h3 className="ml-2 text-lg font-medium text-gray-900">Admission Details</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Admitted:</span>{' '}
                  {new Date(patient.admission_date).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Last Updated:</span>{' '}
                  {new Date(patient.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="space-y-6">
            {vitalsLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                {/* Latest Vitals */}
                {latestVitals && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <Heart className="h-8 w-8 text-red-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Heart Rate</p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {latestVitals.heart_rate} <span className="text-sm text-gray-500">bpm</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <Wind className="h-8 w-8 text-blue-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Oxygen Saturation</p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {latestVitals.oxygen_saturation}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <Thermometer className="h-8 w-8 text-orange-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Temperature</p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {latestVitals.temperature}°C
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <Activity className="h-8 w-8 text-purple-500" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Blood Pressure</p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {latestVitals.blood_pressure}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vitals Charts */}
                {vitals.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Heart Rate History</h3>
                      <VitalsChart
                        data={vitals}
                        metric="heart_rate"
                        color="#ef4444"
                        label="Heart Rate"
                        unit="bpm"
                      />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Oxygen Saturation History</h3>
                      <VitalsChart
                        data={vitals}
                        metric="oxygen_saturation"
                        color="#3b82f6"
                        label="SpO2"
                        unit="%"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-6">
            {medsLoading ? (
              <LoadingSpinner />
            ) : (
              <MedicationList
                medications={medications}
                onUpdateStatus={updateMedicationStatus}
              />
            )}
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="space-y-6">
            {labsLoading ? (
              <LoadingSpinner />
            ) : (
              <LabResults results={labResults} />
            )}
          </div>
        )}

        {activeTab === 'discharge' && showDischargeForm && (
          <DischargeForm
            patient={patient}
            onDischarge={handleDischargeComplete}
          />
        )}
      </div>
    </div>
  );
}