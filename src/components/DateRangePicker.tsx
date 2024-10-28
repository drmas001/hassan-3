import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="date"
          value={value.startDate.toISOString().split('T')[0]}
          onChange={(e) =>
            onChange({
              ...value,
              startDate: new Date(e.target.value),
            })
          }
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <span className="text-gray-500">to</span>
      <input
        type="date"
        value={value.endDate.toISOString().split('T')[0]}
        onChange={(e) =>
          onChange({
            ...value,
            endDate: new Date(e.target.value),
          })
        }
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );
}