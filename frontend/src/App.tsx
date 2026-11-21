// VillageVerse AI: Master Application Router & State Providers
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { PanchayatProvider } from './context/PanchayatContext';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Public Portal
import { PublicPortal } from './pages/PublicPortal';

// Module Pages
import { Dashboard } from './pages/Dashboard';
import { DigitalTwin } from './pages/DigitalTwin';
import { Agriculture } from './pages/Agriculture';
import { WaterResources } from './pages/WaterResources';
import { Roads } from './pages/Roads';
import { Electricity } from './pages/Electricity';
import { Healthcare } from './pages/Healthcare';
import { Education } from './pages/Education';
import { WasteManagement } from './pages/WasteManagement';
import { Environment } from './pages/Environment';
import { DisasterPrediction } from './pages/DisasterPrediction';
import { AIFuturePrediction } from './pages/AIFuturePrediction';
import { AIDevelopmentPlanner } from './pages/AIDevelopmentPlanner';
import { WhatIfSimulation } from './pages/WhatIfSimulation';
import { ComplaintManagement } from './pages/ComplaintManagement';
import { SustainabilityDashboard } from './pages/SustainabilityDashboard';
import { AIChatbot } from './pages/AIChatbot';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { UserManagement } from './pages/UserManagement';
import { Settings } from './pages/Settings';

// Auth Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <PanchayatProvider>
            <BrowserRouter>
            <Routes>
              {/* Public Official Portal & Auth Routes */}
              <Route path="/" element={<PublicPortal />} />
              <Route path="/portal" element={<PublicPortal />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Master Government Application Layout with 20 Modules */}
              <Route element={<ErrorBoundary><AppLayout /></ErrorBoundary>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/digital-twin" element={<DigitalTwin />} />
                <Route path="/agriculture" element={<Agriculture />} />
                <Route path="/water" element={<WaterResources />} />
                <Route path="/roads" element={<Roads />} />
                <Route path="/electricity" element={<Electricity />} />
                <Route path="/healthcare" element={<Healthcare />} />
                <Route path="/education" element={<Education />} />
                <Route path="/waste" element={<WasteManagement />} />
                <Route path="/environment" element={<Environment />} />
                <Route path="/disaster" element={<DisasterPrediction />} />
                <Route path="/future-prediction" element={<AIFuturePrediction />} />
                <Route path="/development-planner" element={<AIDevelopmentPlanner />} />
                <Route path="/simulation" element={<WhatIfSimulation />} />
                <Route path="/complaints" element={<ComplaintManagement />} />
                <Route path="/sustainability" element={<SustainabilityDashboard />} />
                <Route path="/chatbot" element={<AIChatbot />} />
                <Route path="/reports" element={<ReportsAnalytics />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Wildcard Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </PanchayatProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
  );
}

export default App;
