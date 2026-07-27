import bcrypt from 'bcryptjs';

class MockStore {
  constructor() {
    this.users = [];
    this.portfolios = [];
    this.projects = [];
    this.skills = [];
    this.education = [];
    this.experience = [];
    this.certificates = [];
    this.analytics = [];
    this.messages = [];

    this.initDefaultSeed();
  }

  async initDefaultSeed() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user1 = {
      _id: 'mock_user_1',
      username: 'alexdev',
      email: 'alex@example.com',
      password: hashedPassword,
      fullName: 'Alex Rivera',
      role: 'user',
      isDisabled: false,
      createdAt: new Date(),
    };
    this.users.push(user1);

    const port1 = {
      _id: 'mock_port_1',
      userId: 'mock_user_1',
      username: 'alexdev',
      personalInfo: {
        fullName: 'Alex Rivera',
        title: 'Senior Full Stack Engineer',
        bio: 'Building scalable cloud applications, interactive frontends, and REST APIs.',
        email: 'alex@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      },
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        portfolio: 'https://alexrivera.dev',
      },
      templateId: 'creative',
      themeMode: 'dark',
      primaryColor: '#6366f1',
      isPublished: true,
      isFeatured: true,
      createdAt: new Date(),
    };
    this.portfolios.push(port1);

    this.analytics.push({
      _id: 'mock_analytics_1',
      portfolioId: 'mock_port_1',
      username: 'alexdev',
      totalViews: 142,
      uniqueVisitors: 98,
      resumeDownloads: 15,
      projectClicks: 45,
      dailyStats: [{ date: new Date().toISOString().split('T')[0], views: 10, downloads: 2, clicks: 5 }],
    });

    this.projects.push({
      _id: 'mock_proj_1',
      userId: 'mock_user_1',
      portfolioId: 'mock_port_1',
      title: 'Enterprise AI Gateway',
      description: 'High-throughput LLM middleware routing requests with caching across cloud providers.',
      techStack: ['Node.js', 'React', 'MongoDB', 'TailwindCSS'],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      category: 'SaaS Platform',
      isFeatured: true,
      clicks: 45,
      createdAt: new Date(),
    });

    this.skills.push(
      { _id: 'mock_sk_1', userId: 'mock_user_1', portfolioId: 'mock_port_1', name: 'React.js', category: 'Frontend', proficiencyLevel: 95 },
      { _id: 'mock_sk_2', userId: 'mock_user_1', portfolioId: 'mock_port_1', name: 'Node.js & Express', category: 'Backend', proficiencyLevel: 90 },
      { _id: 'mock_sk_3', userId: 'mock_user_1', portfolioId: 'mock_port_1', name: 'MongoDB', category: 'Database', proficiencyLevel: 85 }
    );
  }

  // Users
  async createUser(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: 'mock_user_' + (this.users.length + 1) + '_' + Date.now(),
      username: userData.username.toLowerCase(),
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      fullName: userData.fullName || userData.username,
      role: userData.role || 'user',
      isDisabled: false,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserByUsername(username) {
    return this.users.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
  }

  async findUserById(id) {
    return this.users.find((u) => u._id.toString() === id.toString()) || null;
  }

  // Portfolios
  async createPortfolio(portData) {
    const newPort = {
      _id: 'mock_port_' + (this.portfolios.length + 1) + '_' + Date.now(),
      userId: portData.userId,
      username: portData.username,
      personalInfo: portData.personalInfo || {},
      socialLinks: portData.socialLinks || {},
      templateId: portData.templateId || 'creative',
      themeMode: portData.themeMode || 'dark',
      isPublished: true,
      isFeatured: false,
      createdAt: new Date(),
    };
    this.portfolios.push(newPort);
    return newPort;
  }

  async findPortfolioByUserId(userId) {
    return this.portfolios.find((p) => p.userId.toString() === userId.toString()) || null;
  }

  async findPortfolioByUsername(username) {
    return this.portfolios.find((p) => p.username.toLowerCase() === username.toLowerCase()) || null;
  }

  // Skill CRUD
  async addSkill(skillData) {
    const skill = {
      _id: 'mock_sk_' + Date.now(),
      userId: skillData.userId,
      portfolioId: skillData.portfolioId,
      name: skillData.name,
      category: skillData.category || 'Frontend',
      proficiencyLevel: Number(skillData.proficiencyLevel) || 80,
      iconName: skillData.iconName || '',
      createdAt: new Date(),
    };
    this.skills.push(skill);
    return skill;
  }

  async updateSkill(id, updates) {
    const skill = this.skills.find((s) => s._id.toString() === id.toString());
    if (!skill) return null;
    Object.assign(skill, updates);
    return skill;
  }

  async deleteSkill(id) {
    this.skills = this.skills.filter((s) => s._id.toString() !== id.toString());
    return true;
  }

  // Project CRUD
  async addProject(projData) {
    const proj = {
      _id: 'mock_proj_' + Date.now(),
      userId: projData.userId,
      portfolioId: projData.portfolioId,
      title: projData.title,
      description: projData.description || '',
      techStack: projData.techStack || [],
      githubUrl: projData.githubUrl || '',
      liveUrl: projData.liveUrl || '',
      thumbnail: projData.thumbnail || '',
      category: projData.category || 'Web App',
      isFeatured: projData.isFeatured || false,
      clicks: 0,
      createdAt: new Date(),
    };
    this.projects.push(proj);
    return proj;
  }

  async deleteProject(id) {
    this.projects = this.projects.filter((p) => p._id.toString() !== id.toString());
    return true;
  }

  // Education CRUD
  async addEducation(eduData) {
    const edu = {
      _id: 'mock_edu_' + Date.now(),
      userId: eduData.userId,
      portfolioId: eduData.portfolioId,
      institution: eduData.institution,
      degree: eduData.degree,
      fieldOfStudy: eduData.fieldOfStudy || '',
      duration: eduData.duration || '',
      cgpa: eduData.cgpa || '',
      createdAt: new Date(),
    };
    this.education.push(edu);
    return edu;
  }

  async deleteEducation(id) {
    this.education = this.education.filter((e) => e._id.toString() !== id.toString());
    return true;
  }

  // Experience CRUD
  async addExperience(expData) {
    const exp = {
      _id: 'mock_exp_' + Date.now(),
      userId: expData.userId,
      portfolioId: expData.portfolioId,
      company: expData.company,
      position: expData.position,
      duration: expData.duration || '',
      location: expData.location || '',
      description: expData.description || '',
      isCurrent: expData.isCurrent || false,
      createdAt: new Date(),
    };
    this.experience.push(exp);
    return exp;
  }

  async deleteExperience(id) {
    this.experience = this.experience.filter((e) => e._id.toString() !== id.toString());
    return true;
  }

  // Certificate CRUD
  async addCertificate(certData) {
    const cert = {
      _id: 'mock_cert_' + Date.now(),
      userId: certData.userId,
      portfolioId: certData.portfolioId,
      title: certData.title,
      organization: certData.organization,
      issueDate: certData.issueDate || '',
      credentialUrl: certData.credentialUrl || '',
      createdAt: new Date(),
    };
    this.certificates.push(cert);
    return cert;
  }

  async deleteCertificate(id) {
    this.certificates = this.certificates.filter((c) => c._id.toString() !== id.toString());
    return true;
  }
}

export const mockStore = new MockStore();
