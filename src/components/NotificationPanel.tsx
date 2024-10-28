import React from 'react';
import { Bell, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'status' | 'lab' | 'medication';
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
}

interface NotificationPanelProps {
  notifications: Notification[];
}

export function NotificationPanel({ notifications }: NotificationPanelProps) {
  const getIcon = (severity: Notification['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">Notifications</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start">
              {getIcon(notification.severity)}
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="mt-1 text-xs text-gray-500">{notification.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}