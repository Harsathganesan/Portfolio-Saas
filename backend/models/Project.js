import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
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
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    githubUrl: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Web Application',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
