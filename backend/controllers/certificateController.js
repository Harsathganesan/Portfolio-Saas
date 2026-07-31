import Certificate from '../models/Certificate.js';
import Portfolio from '../models/Portfolio.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

export const getCertificates = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      const certificates = mockStore.certificates.filter((c) => c.portfolioId === portfolio?._id);
      return res.json({ success: true, certificates });
    }
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const certificates = await Certificate.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const { title, organization, issueDate, credentialUrl, certificateImage } = req.body;
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      const item = await mockStore.addCertificate({
        userId: req.user._id,
        portfolioId: portfolio?._id,
        title,
        organization,
        issueDate,
        credentialUrl,
        certificateImage,
      });
      return res.status(201).json({ success: true, message: 'Certificate added', certificate: item });
    }
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    const item = await Certificate.create({
      userId: req.user._id,
      portfolioId: portfolio._id,
      title,
      organization,
      issueDate,
      credentialUrl,
      certificateImage,
    });
    res.status(201).json({ success: true, message: 'Certificate added', certificate: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const { title, organization, issueDate, credentialUrl, certificateImage } = req.body;
    if (isInMemoryFallback) {
      const item = await mockStore.updateCertificate(req.params.id, {
        title,
        organization,
        issueDate,
        credentialUrl,
        certificateImage,
      });
      return res.json({ success: true, message: 'Certificate updated', certificate: item });
    }
    const item = await Certificate.findByIdAndUpdate(
      req.params.id,
      { title, organization, issueDate, credentialUrl, certificateImage },
      { new: true }
    );
    res.json({ success: true, message: 'Certificate updated', certificate: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      await mockStore.deleteCertificate(req.params.id);
      return res.json({ success: true, message: 'Certificate deleted' });
    }
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
