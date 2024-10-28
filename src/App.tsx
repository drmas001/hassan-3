import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetails } from './components/PatientDetails';
import { AdmitPatientForm } from './components/AdmitPatientForm';
import { Reports } from './components/Reports';
import { DischargeHistory } from './components/DischargeHistory';
import { LabResults } from './components/LabResults';
import { AdminPage } from './components/AdminPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/welcome" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <Layout>
                <PatientList />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/patients/:id"
          element={
            <PrivateRoute>
              <Layout>
                <PatientDetails />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/admit"
          element={
            <PrivateRoute requiredRole="Doctor">
              <Layout>
                <AdmitPatientForm />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Layout>
                <Reports />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/discharges"
          element={
            <PrivateRoute>
              <Layout>
                <DischargeHistory />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/lab-results"
          element={
            <PrivateRoute>
              <Layout>
                <LabResults />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="Admin">
              <Layout>
                <AdminPage />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;