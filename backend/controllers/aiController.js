import { generateBio, generateProjectDescription } from '../utils/aiHelper.js';

// @desc    Generate AI About Me / Bio
// @route   POST /api/ai/generate-bio
export const handleGenerateBio = async (req, res) => {
  try {
    const { name, title, skills, experienceYears, tone } = req.body;
    const generatedBio = await generateBio({ name, title, skills, experienceYears, tone });

    res.json({
      success: true,
      bio: generatedBio,
      text: generatedBio,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate AI Project Description
// @route   POST /api/ai/generate-project-desc
export const handleGenerateProjectDesc = async (req, res) => {
  try {
    const { title, techStack, goal, role } = req.body;
    const generatedDesc = await generateProjectDescription({ title, techStack, goal, role });

    res.json({
      success: true,
      description: generatedDesc,
      text: generatedDesc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
