import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    resumeDownloads: {
      type: Number,
      default: 0,
    },
    projectClicks: {
      type: Number,
      default: 0,
    },
    visitorIps: [
      {
        ip: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    dailyStats: [
      {
        date: { type: String, required: true }, // Format YYYY-MM-DD
        views: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
export default Analytics;
