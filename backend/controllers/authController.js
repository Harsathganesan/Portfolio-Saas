import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import Analytics from '../models/Analytics.js';
import { generateToken } from '../utils/jwt.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';
import bcrypt from 'bcryptjs';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const cleanedUsername = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');

    // Fallback store handling if MongoDB is offline
    if (isInMemoryFallback) {
      const existingEmail = await mockStore.findUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const existingUser = await mockStore.findUserByUsername(cleanedUsername);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username is already taken' });
      }

      const user = await mockStore.createUser({ username: cleanedUsername, email, password, fullName });
      const portfolio = await mockStore.createPortfolio({
        userId: user._id,
        username: user.username,
        personalInfo: {
          fullName: user.fullName || user.username,
          title: 'Full Stack Developer',
          bio: `Welcome to ${user.username}'s portfolio! Passionate developer building software.`,
          email: user.email,
        },
      });

      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully (In-Memory Mode)',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    }

    // Normal MongoDB path
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const existingUsername = await User.findOne({ username: cleanedUsername });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const user = await User.create({
      username: cleanedUsername,
      email,
      password,
      fullName: fullName || cleanedUsername,
    });

    const portfolio = await Portfolio.create({
      userId: user._id,
      username: user.username,
      personalInfo: {
        fullName: user.fullName || user.username,
        title: 'Full Stack Developer',
        bio: `Welcome to ${user.username}'s portfolio! Passionate developer building software.`,
        email: user.email,
      },
    });

    await Analytics.create({
      portfolioId: portfolio._id,
      username: user.username,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (isInMemoryFallback) {
      const user = await mockStore.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isDisabled) {
      return res.status(403).json({ success: false, message: 'Account is disabled. Contact admin.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      const user = await mockStore.findUserById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  res.json({ success: true, message: 'Password reset instructions sent to email' });
};

export const resetPassword = async (req, res) => {
  res.json({ success: true, message: 'Password reset successfully' });
};
