import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
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
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required (e.g., 2020 - 2024)'],
      trim: true,
    },
    cgpa: {
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

const Education = mongoose.models.Education || mongoose.model('Education', educationSchema);
export default Education;
