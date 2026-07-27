import Skill from '../models/Skill.js';
import Portfolio from '../models/Portfolio.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

// @desc    Get user skills
// @route   GET /api/skills
export const getSkills = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
      const skills = mockStore.skills.filter((s) => s.portfolioId === portfolio._id);
      return res.json({ success: true, skills });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const skills = await Skill.find({ portfolioId: portfolio._id }).sort({ proficiencyLevel: -1 });
    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new skill
// @route   POST /api/skills
export const createSkill = async (req, res) => {
  try {
    const { name, category, proficiencyLevel, iconName } = req.body;

    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

      const skill = await mockStore.addSkill({
        userId: req.user._id,
        portfolioId: portfolio._id,
        name,
        category: category || 'Frontend',
        proficiencyLevel: Number(proficiencyLevel) || 80,
        iconName: iconName || '',
      });

      return res.status(201).json({ success: true, message: 'Skill added', skill });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const skill = await Skill.create({
      userId: req.user._id,
      portfolioId: portfolio._id,
      name,
      category: category || 'Frontend',
      proficiencyLevel: Number(proficiencyLevel) || 80,
      iconName: iconName || '',
    });

    res.status(201).json({ success: true, message: 'Skill added', skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
export const updateSkill = async (req, res) => {
  try {
    const { name, category, proficiencyLevel, iconName } = req.body;

    if (isInMemoryFallback) {
      const skill = await mockStore.updateSkill(req.params.id, {
        ...(name && { name }),
        ...(category && { category }),
        ...(proficiencyLevel !== undefined && { proficiencyLevel: Number(proficiencyLevel) }),
        ...(iconName !== undefined && { iconName }),
      });
      return res.json({ success: true, message: 'Skill updated', skill });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    if (skill.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (name) skill.name = name;
    if (category) skill.category = category;
    if (proficiencyLevel !== undefined) skill.proficiencyLevel = Number(proficiencyLevel);
    if (iconName !== undefined) skill.iconName = iconName;

    await skill.save();
    res.json({ success: true, message: 'Skill updated', skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
export const deleteSkill = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      await mockStore.deleteSkill(req.params.id);
      return res.json({ success: true, message: 'Skill deleted' });
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    if (skill.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
