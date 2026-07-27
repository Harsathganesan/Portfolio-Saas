import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { portfolioService } from '../services/portfolioService';
import { useAuth } from './AuthContext';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { token } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await portfolioService.getMyPortfolio();
      if (res.success) {
        setPortfolio(res.portfolio);
      }
    } catch (err) {
      console.error('Failed to load portfolio:', err);
      setError(err.response?.data?.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const updatePortfolio = async (updateData) => {
    setSaving(true);
    try {
      const res = await portfolioService.updateMyPortfolio(updateData);
      if (res.success) {
        setPortfolio((prev) => ({ ...prev, ...res.portfolio }));
      }
      return res;
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Instant local state updaters for real-time UI updates
  const addSkillToContext = (skill) => {
    setPortfolio((prev) => (prev ? { ...prev, skills: [skill, ...(prev.skills || [])] } : prev));
  };

  const removeSkillFromContext = (skillId) => {
    setPortfolio((prev) => (prev ? { ...prev, skills: (prev.skills || []).filter((s) => s._id !== skillId) } : prev));
  };

  const addProjectToContext = (project) => {
    setPortfolio((prev) => (prev ? { ...prev, projects: [project, ...(prev.projects || [])] } : prev));
  };

  const removeProjectFromContext = (projectId) => {
    setPortfolio((prev) => (prev ? { ...prev, projects: (prev.projects || []).filter((p) => p._id !== projectId) } : prev));
  };

  const addEducationToContext = (edu) => {
    setPortfolio((prev) => (prev ? { ...prev, education: [edu, ...(prev.education || [])] } : prev));
  };

  const removeEducationFromContext = (eduId) => {
    setPortfolio((prev) => (prev ? { ...prev, education: (prev.education || []).filter((e) => e._id !== eduId) } : prev));
  };

  const addExperienceToContext = (exp) => {
    setPortfolio((prev) => (prev ? { ...prev, experience: [exp, ...(prev.experience || [])] } : prev));
  };

  const removeExperienceFromContext = (expId) => {
    setPortfolio((prev) => (prev ? { ...prev, experience: (prev.experience || []).filter((e) => e._id !== expId) } : prev));
  };

  const addCertificateToContext = (cert) => {
    setPortfolio((prev) => (prev ? { ...prev, certificates: [cert, ...(prev.certificates || [])] } : prev));
  };

  const removeCertificateFromContext = (certId) => {
    setPortfolio((prev) => (prev ? { ...prev, certificates: (prev.certificates || []).filter((c) => c._id !== certId) } : prev));
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        setPortfolio,
        loading,
        saving,
        error,
        fetchPortfolio,
        updatePortfolio,
        addSkillToContext,
        removeSkillFromContext,
        addProjectToContext,
        removeProjectFromContext,
        addEducationToContext,
        removeEducationFromContext,
        addExperienceToContext,
        removeExperienceFromContext,
        addCertificateToContext,
        removeCertificateFromContext,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
