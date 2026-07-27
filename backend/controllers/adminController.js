import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import Analytics from '../models/Analytics.js';
import Project from '../models/Project.js';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const publishedPortfolios = await Portfolio.countDocuments({ isPublished: true });
    const totalProjects = await Project.countDocuments();
    const totalViewsData = await Analytics.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$totalViews' }, totalDownloads: { $sum: '$resumeDownloads' } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        publishedPortfolios,
        totalProjects,
        totalViews: totalViewsData[0]?.totalViews || 0,
        totalDownloads: totalViewsData[0]?.totalDownloads || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Users with Portfolios
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const portfolios = await Portfolio.find();

    const usersWithPortfolio = users.map((user) => {
      const userPort = portfolios.find((p) => p.userId.toString() === user._id.toString());
      return {
        ...user.toObject(),
        portfolio: userPort || null,
      };
    });

    res.json({ success: true, users: usersWithPortfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user status (Enable/Disable)
// @route   PUT /api/admin/users/:id/toggle-status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot disable admin user' });
    }

    user.isDisabled = !user.isDisabled;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isDisabled ? 'disabled' : 'enabled'} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete User and their data
// @route   DELETE /api/admin/users/:id
export const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin account' });
    }

    const portfolio = await Portfolio.findOne({ userId: user._id });
    if (portfolio) {
      await Project.deleteMany({ portfolioId: portfolio._id });
      await Analytics.deleteMany({ portfolioId: portfolio._id });
      await Portfolio.findByIdAndDelete(portfolio._id);
    }

    await User.findByIdAndDelete(user._id);

    res.json({ success: true, message: 'User and all associated data permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Featured Portfolio status
// @route   PUT /api/admin/portfolios/:id/feature
export const toggleFeaturedPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    portfolio.isFeatured = !portfolio.isFeatured;
    await portfolio.save();

    res.json({
      success: true,
      message: `Portfolio ${portfolio.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      portfolio,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
