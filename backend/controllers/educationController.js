import Education from '../models/Education.js';
import Portfolio from '../models/Portfolio.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

export const getEducation = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      const education = mockStore.education.filter((e) => e.portfolioId === portfolio?._id);
      return res.json({ success: true, education });
    }
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const education = await Education.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    res.json({ success: true, education });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEducation = async (req, res) => {
  try {
    const { institution, degree, fieldOfStudy, duration, cgpa } = req.body;
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      const item = await mockStore.addEducation({
        userId: req.user._id,
        portfolioId: portfolio?._id,
        institution,
        degree,
        fieldOfStudy,
        duration,
        cgpa,
      });
      return res.status(201).json({ success: true, message: 'Education added', education: item });
    }
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const item = await Education.create({
      userId: req.user._id,
      portfolioId: portfolio._id,
      institution,
      degree,
      fieldOfStudy,
      duration,
      cgpa,
    });
    res.status(201).json({ success: true, message: 'Education added', education: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEducation = async (req, res) => {
  res.json({ success: true, message: 'Education updated' });
};

export const deleteEducation = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      await mockStore.deleteEducation(req.params.id);
      return res.json({ success: true, message: 'Education deleted' });
    }
    await Education.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
