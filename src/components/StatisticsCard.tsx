import React from 'react';
import { Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Statistics {
  totalPatients: number;
  criticalPatients: number;
  stablePatients: number;
  newAdmissions: number;
}

interface StatisticsCardProps {
  stats: Statistics;
}

export function StatisticsCard({ stats }: StatisticsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Critical</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.criticalPatients}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Stable</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.stablePatients}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-purple-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">New Today</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.newAdmissions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}