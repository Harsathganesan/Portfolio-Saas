import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      title: { type: String, default: '' },
      bio: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      avatar: { type: String, default: '' },
      aboutMeHtml: { type: String, default: '' },
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    resumeUrl: { type: String, default: '' },
    templateId: {
      type: String,
      default: 'minimalist',
      enum: ['minimalist', 'creative', 'corporate', 'cyber', 'sleek'],
    },
    themeMode: {
      type: String,
      default: 'dark',
      enum: ['dark', 'light'],
    },
    primaryColor: {
      type: String,
      default: '#6366f1', // Indigo accent
    },
    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        year: { type: String, default: '' },
      },
    ],
    languages: [
      {
        name: { type: String, required: true },
        proficiency: { type: String, default: 'Fluent' }, // Native, Fluent, Intermediate, Basic
      },
    ],
    interests: [{ type: String }],
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    customDomain: { type: String, default: '' },
    published: { type: Boolean, default: false },
    slug: { type: String, lowercase: true, default: '' },
    publishedAt: { type: Date },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
