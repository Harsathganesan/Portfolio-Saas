import Experience from '../models/Experience.js';
import Portfolio from '../models/Portfolio.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

export const getExperience = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      const experience = mockStore.experience.filter((e) => e.portfolioId === portfolio?._id);
      return res.json({ success: true, experience });
    }
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const experience = await Experience.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    res.json({ success: true, experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExperience = async (req, res) => {
  try {
    const { company, position, duration, location, description, isCurrent } = req.body;
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      const item = await mockStore.addExperience({
        userId: req.user._id,
        portfolioId: portfolio?._id,
        company,
        position,
        duration,
        location,
        description,
        isCurrent,
      });
      return res.status(201).json({ success: true, message: 'Experience added', experience: item });
    }
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const item = await Experience.create({
      userId: req.user._id,
      portfolioId: portfolio._id,
      company,
      position,
      duration,
      location,
      description,
      isCurrent,
    });
    res.status(201).json({ success: true, message: 'Experience added', experience: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { company, position, role, duration, location, description, isCurrent } = req.body;
    const updateData = {
      company,
      position: position || role,
      duration,
      location,
      description,
      isCurrent,
    };

    if (isInMemoryFallback) {
      const item = await mockStore.updateExperience(req.params.id, updateData);
      return res.json({ success: true, message: 'Experience updated', experience: item });
    }

    const item = await Experience.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: 'Experience updated', experience: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteExperience = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      await mockStore.deleteExperience(req.params.id);
      return res.json({ success: true, message: 'Experience deleted' });
    }
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
