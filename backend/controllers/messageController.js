import Message from '../models/Message.js';
import Portfolio from '../models/Portfolio.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

export const sendMessage = async (req, res) => {
  try {
    const { username, senderName, senderEmail, subject, message } = req.body;
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUsername(username);
      const msg = {
        _id: 'mock_msg_' + Date.now(),
        portfolioId: portfolio?._id,
        recipientUserId: portfolio?.userId,
        senderName,
        senderEmail,
        subject: subject || 'General Inquiry',
        message,
        isRead: false,
        createdAt: new Date(),
      };
      mockStore.messages.push(msg);
      return res.status(201).json({ success: true, message: 'Message sent successfully', data: msg });
    }

    const portfolio = await Portfolio.findOne({ username: username.toLowerCase() });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Recipient portfolio not found' });

    const msg = await Message.create({
      portfolioId: portfolio._id,
      recipientUserId: portfolio.userId,
      senderName,
      senderEmail,
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully', data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyMessages = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      const messages = mockStore.messages.filter((m) => m.recipientUserId === req.user._id);
      return res.json({ success: true, messages });
    }
    const messages = await Message.find({ recipientUserId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  res.json({ success: true, message: 'Message marked as read' });
};

export const deleteMessage = async (req, res) => {
  res.json({ success: true, message: 'Message deleted' });
};
