import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Frontend', // Frontend, Backend, Database, DevOps, Tools, Design, Other
    },
    proficiencyLevel: {
      type: Number,
      min: 1,
      max: 100,
      default: 80,
    },
    iconName: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
export default Skill;
