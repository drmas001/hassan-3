import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  diagnosis: string;
  bed_number: string;
  status: string;
  admission_date: string;
}

interface PatientListProps {
  patients: Patient[];
  onPatientSelect: (patientId: string) => void;
}

export function PatientList({ patients, onPatientSelect }: PatientListProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              MRN/Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bed
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Diagnosis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Admitted
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                  <div className="text-sm text-gray-500">MRN: {patient.mrn}</div>
                  <div className="text-sm text-gray-500">Age: {patient.age}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {patient.bed_number}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {patient.diagnosis}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  patient.status === 'Critical' 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {patient.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(patient.admission_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button
                  onClick={() => onPatientSelect(patient.id)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}