import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
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
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position/Role is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required (e.g., Jan 2022 - Present)'],
      trim: true,
    },
    location: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Experience = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
export default Experience;
