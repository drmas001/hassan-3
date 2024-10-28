import React from 'react';
import { Filter } from 'lucide-react';

interface PatientFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function PatientFilters({ statusFilter, onStatusFilterChange }: PatientFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Filter className="h-5 w-5 text-gray-400 mr-2" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="Stable">Stable</option>
          <option value="Critical">Critical</option>
          <option value="Discharged">Discharged</option>
        </select>
      </div>
    </div>
  );
}