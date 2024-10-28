import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { ComparisonData } from '../types/reports';

interface ComparisonMetricsProps {
  comparison: ComparisonData;
}

export function ComparisonMetrics({ comparison }: ComparisonMetricsProps) {
  const renderChange = (value: number) => {
    const isPositive = value > 0;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    const Icon = isPositive ? ArrowUp : ArrowDown;

    return (
      <div className={`flex items-center ${color}`}>
        <Icon className="h-4 w-4 mr-1" />
        <span>{Math.abs(value)}%</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Period Comparison</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Total Patients</h4>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {comparison.previousPeriod.totalPatients}
                </p>
                <p className="text-sm text-gray-500">Previous</p>
              </div>
              {renderChange(comparison.changes.totalPatients)}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Critical Cases</h4>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {comparison.previousPeriod.criticalCases}
                </p>
                <p className="text-sm text-gray-500">Previous</p>
              </div>
              {renderChange(comparison.changes.criticalCases)}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Average Stay</h4>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {comparison.previousPeriod.averageStayDuration.toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">Previous</p>
              </div>
              {renderChange(comparison.changes.averageStayDuration)}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Bed Occupancy</h4>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {(comparison.previousPeriod.bedOccupancyRate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Previous</p>
              </div>
              {renderChange(comparison.changes.bedOccupancyRate)}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Readmission Rate</h4>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {(comparison.previousPeriod.readmissionRate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Previous</p>
              </div>
              {renderChange(comparison.changes.readmissionRate)}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Mortality Rate</h4>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {(comparison.previousPeriod.mortalityRate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Previous</p>
              </div>
              {renderChange(comparison.changes.mortalityRate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}