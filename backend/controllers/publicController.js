import Portfolio from '../models/Portfolio.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';

// @desc    Search and explore published portfolios
// @route   GET /api/public/explore
export const explorePortfolios = async (req, res) => {
  try {
    const { query, category, isFeatured } = req.query;

    let searchFilter = { isPublished: true };

    if (isFeatured === 'true') {
      searchFilter.isFeatured = true;
    }

    if (query) {
      const regex = new RegExp(query, 'i');
      searchFilter.$or = [
        { username: regex },
        { 'personalInfo.fullName': regex },
        { 'personalInfo.title': regex },
        { 'personalInfo.bio': regex },
      ];
    }

    const portfolios = await Portfolio.find(searchFilter).sort({ isFeatured: -1, createdAt: -1 }).limit(20);

    const enrichedPortfolios = await Promise.all(
      portfolios.map(async (p) => {
        const skillCount = await Skill.countDocuments({ portfolioId: p._id });
        const projectCount = await Project.countDocuments({ portfolioId: p._id });
        return {
          ...p.toObject(),
          stats: { skillCount, projectCount },
        };
      })
    );

    res.json({
      success: true,
      portfolios: enrichedPortfolios,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
