import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ExplorePortfoliosPage from './pages/ExplorePortfoliosPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import PersonalInfoPage from './pages/PersonalInfoPage';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import EducationPage from './pages/EducationPage';
import ExperiencePage from './pages/ExperiencePage';
import CertificatesPage from './pages/CertificatesPage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import TemplatesPage from './pages/TemplatesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import GeneratePage from './pages/GeneratePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#0b0f19]" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#0b0f19]" />;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/explore" element={<ExplorePortfoliosPage />} />

      {/* Admin Panel */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />

      {/* SaaS Dashboard Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="personal" element={<PersonalInfoPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="resume" element={<ResumeUploadPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="generate" element={<GeneratePage />} />
        <Route path="inbox" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Public Dynamic Portfolio Routes: /u/:username and /:username */}
      <Route path="/u/:username" element={<PublicPortfolioPage />} />
      <Route path="/:username" element={<PublicPortfolioPage />} />
    </Routes>
  );
};

export default App;
