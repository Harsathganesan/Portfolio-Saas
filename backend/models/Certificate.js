import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
    },
    issueDate: {
      type: String,
      default: '',
    },
    credentialUrl: {
      type: String,
      default: '',
    },
    certificateImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
export default Certificate;
