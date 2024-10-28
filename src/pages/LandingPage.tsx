import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Users, Clock } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <Activity className="h-12 w-12 text-blue-600" />
              <h1 className="ml-4 text-4xl font-bold text-gray-900">ICU Manager</h1>
            </div>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced patient care management system designed for intensive care units.
              Streamline your workflow and enhance patient care with our comprehensive solution.
            </p>
            <div className="mt-8">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-blue-500" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Secure Access
              </h3>
            </div>
            <p className="text-gray-600">
              Role-based access control ensures data security and proper authorization
              for all medical staff.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-green-500" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Patient Management
              </h3>
            </div>
            <p className="text-gray-600">
              Comprehensive patient monitoring with real-time updates and detailed
              medical history tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-purple-500" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Real-time Updates
              </h3>
            </div>
            <p className="text-gray-600">
              Stay informed with instant notifications about patient status changes
              and critical updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}