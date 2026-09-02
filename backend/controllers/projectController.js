import Project from '../models/Project.js';
import Portfolio from '../models/Portfolio.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

// @desc    Get all user projects
// @route   GET /api/projects
export const getProjects = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
      const projects = mockStore.projects.filter((p) => p.portfolioId === portfolio._id);
      return res.json({ success: true, projects });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const projects = await Project.find({ portfolioId: portfolio._id }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl, thumbnail, category, isFeatured } = req.body;
    const gitLink = githubUrl || req.body.github || req.body.gitUrl || req.body.repoUrl || req.body.github_url || '';
    const demoLink = liveUrl || req.body.demoUrl || req.body.link || '';
    const imgUrl = thumbnail || req.body.image || req.body.imageUrl || '';

    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

      const project = await mockStore.addProject({
        userId: req.user._id,
        portfolioId: portfolio._id,
        title,
        description,
        techStack: Array.isArray(techStack) ? techStack : techStack ? techStack.split(',').map((t) => t.trim()) : [],
        githubUrl: gitLink,
        github: gitLink,
        liveUrl: demoLink,
        thumbnail: imgUrl,
        category: category || 'Web Application',
        isFeatured: isFeatured || false,
      });

      return res.status(201).json({ success: true, message: 'Project created', project });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });

    const project = await Project.create({
      userId: req.user._id,
      portfolioId: portfolio._id,
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : techStack ? techStack.split(',').map((t) => t.trim()) : [],
      githubUrl: gitLink,
      liveUrl: demoLink,
      thumbnail: imgUrl,
      category: category || 'Web Application',
      isFeatured: isFeatured || false,
    });

    res.status(201).json({ success: true, message: 'Project created', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl, thumbnail, category, isFeatured } = req.body;
    const gitLink = githubUrl !== undefined ? githubUrl : (req.body.github !== undefined ? req.body.github : (req.body.gitUrl !== undefined ? req.body.gitUrl : req.body.repoUrl));
    const demoLink = liveUrl !== undefined ? liveUrl : (req.body.demoUrl !== undefined ? req.body.demoUrl : (req.body.link !== undefined ? req.body.link : undefined));
    const imgUrl = thumbnail !== undefined ? thumbnail : (req.body.image !== undefined ? req.body.image : (req.body.imageUrl !== undefined ? req.body.imageUrl : undefined));

    if (isInMemoryFallback) {
      const proj = mockStore.projects.find((p) => p._id.toString() === req.params.id);
      if (proj) {
        if (title) proj.title = title;
        if (description !== undefined) proj.description = description;
        if (techStack) proj.techStack = Array.isArray(techStack) ? techStack : techStack.split(',').map((t) => t.trim());
        if (gitLink !== undefined) proj.githubUrl = gitLink;
        if (demoLink !== undefined) proj.liveUrl = demoLink;
        if (imgUrl !== undefined) proj.thumbnail = imgUrl;
      }
      return res.json({ success: true, message: 'Project updated', project: proj });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (project.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (techStack) project.techStack = Array.isArray(techStack) ? techStack : techStack.split(',').map((t) => t.trim());
    if (gitLink !== undefined) project.githubUrl = gitLink;
    if (demoLink !== undefined) project.liveUrl = demoLink;
    if (imgUrl !== undefined) project.thumbnail = imgUrl;
    if (category) project.category = category;
    if (isFeatured !== undefined) project.isFeatured = isFeatured;

    await project.save();
    res.json({ success: true, message: 'Project updated', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      await mockStore.deleteProject(req.params.id);
      return res.json({ success: true, message: 'Project deleted' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (project.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
