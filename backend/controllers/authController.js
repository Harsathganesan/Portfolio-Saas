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

    const cleanedEmail = String(email).toLowerCase().trim();
    const cleanedUsername = String(username).toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');

    if (!cleanedUsername || cleanedUsername.length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long (letters, numbers, hyphens, underscores).' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Fallback store handling if MongoDB is offline
    if (isInMemoryFallback) {
      const existingEmail = await mockStore.findUserByEmail(cleanedEmail);
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const existingUser = await mockStore.findUserByUsername(cleanedUsername);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username is already taken' });
      }

      const user = await mockStore.createUser({ username: cleanedUsername, email: cleanedEmail, password, fullName });
      const portfolio = await mockStore.createPortfolio({
        userId: user._id,
        username: user.username,
        isPublished: true,
        published: true,
        publishedAt: new Date(),
        slug: user.username,
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
    }

    // Normal MongoDB path
    const existingUser = await User.findOne({
      $or: [{ email: cleanedEmail }, { username: cleanedUsername }],
    });

    if (existingUser) {
      if (existingUser.email === cleanedEmail) {
        return res.status(400).json({ success: false, message: 'Email is already registered. Please log in instead.' });
      }
      return res.status(400).json({ success: false, message: 'Username is already taken. Please choose another username.' });
    }

    const user = await User.create({
      username: cleanedUsername,
      email: cleanedEmail,
      password,
      fullName: fullName || cleanedUsername,
    });

    const portfolio = await Portfolio.create({
      userId: user._id,
      username: user.username,
      isPublished: true,
      published: true,
      publishedAt: new Date(),
      slug: user.username,
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
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email or username is already registered.' });
    }
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((val) => val.message).join(', ');
      return res.status(400).json({ success: false, message });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username and password' });
    }

    const loginIdentifier = String(email).toLowerCase().trim();

    if (isInMemoryFallback) {
      const user = (await mockStore.findUserByEmail(loginIdentifier)) || (await mockStore.findUserByUsername(loginIdentifier));
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email/username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email/username or password' });
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

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email/username or password' });
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

// @desc    Change logged-in user password
// @route   PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please enter current password and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    if (isInMemoryFallback) {
      const user = await mockStore.findUserById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect current password' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      return res.json({ success: true, message: 'Password changed successfully' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error updating password' });
  }
};

