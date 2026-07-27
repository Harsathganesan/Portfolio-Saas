import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Certificate from '../models/Certificate.js';
import Analytics from '../models/Analytics.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_saas');
    console.log('Connected to DB for seeding...');

    await User.deleteMany();
    await Portfolio.deleteMany();
    await Project.deleteMany();
    await Skill.deleteMany();
    await Education.deleteMany();
    await Experience.deleteMany();
    await Certificate.deleteMany();
    await Analytics.deleteMany();

    // Create Admin
    const admin = await User.create({
      username: 'admin',
      email: 'admin@portfolio.com',
      password: 'adminpassword123',
      fullName: 'SaaS Platform Admin',
      role: 'admin',
    });

    // Create Demo User 1: alexdev
    const user1 = await User.create({
      username: 'alexdev',
      email: 'alex@example.com',
      password: 'password123',
      fullName: 'Alex Rivera',
    });

    const port1 = await Portfolio.create({
      userId: user1._id,
      username: 'alexdev',
      personalInfo: {
        fullName: 'Alex Rivera',
        title: 'Senior Full Stack Engineer & Cloud Architect',
        bio: 'Passionate software engineer building resilient cloud-native microservices, interactive web apps, and modern user interfaces.',
        email: 'alex@riveracode.dev',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        aboutMeHtml: 'Over 6 years of experience building modern web architectures. Specialist in React, Node.js, TypeScript, and MongoDB.',
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
      achievements: [
        { title: 'Best Cloud Innovation Hackathon Winner', year: '2024', description: 'Built an AI log analyzer in 24 hours.' },
        { title: 'Top 1% Open Source Contributor', year: '2023', description: 'Contributed 50+ PRs to popular React ecosystems.' },
      ],
      languages: [
        { name: 'English', proficiency: 'Native' },
        { name: 'Spanish', proficiency: 'Fluent' },
      ],
      interests: ['Distributed Systems', 'UI/UX Design', 'Generative AI', 'Cybersecurity'],
    });

    await Analytics.create({
      portfolioId: port1._id,
      username: 'alexdev',
      totalViews: 1420,
      uniqueVisitors: 890,
      resumeDownloads: 142,
      projectClicks: 530,
      dailyStats: [
        { date: '2026-07-25', views: 240, downloads: 15, clicks: 80 },
        { date: '2026-07-26', views: 380, downloads: 28, clicks: 140 },
        { date: '2026-07-27', views: 800, downloads: 99, clicks: 310 },
      ],
    });

    await Project.create([
      {
        userId: user1._id,
        portfolioId: port1._id,
        title: 'Enterprise AI Cloud Gateway',
        description: 'High-throughput LLM middleware routing requests with caching and rate limiting across 5 cloud providers.',
        techStack: ['Node.js', 'React', 'MongoDB', 'Redis', 'TailwindCSS'],
        githubUrl: 'https://github.com/example/ai-gateway',
        liveUrl: 'https://aigateway.example.com',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
        category: 'SaaS Platform',
        isFeatured: true,
        clicks: 340,
      },
      {
        userId: user1._id,
        portfolioId: port1._id,
        title: 'Nexus Realtime Kanban Board',
        description: 'Collaborative task management platform with WebSocket synchronization and dynamic drag-and-drop animations.',
        techStack: ['React', 'Framer Motion', 'Express', 'Socket.io', 'TailwindCSS'],
        githubUrl: 'https://github.com/example/nexus-kanban',
        liveUrl: 'https://nexus.example.com',
        thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80',
        category: 'Web Application',
        isFeatured: true,
        clicks: 190,
      },
    ]);

    await Skill.create([
      { userId: user1._id, portfolioId: port1._id, name: 'React.js', category: 'Frontend', proficiencyLevel: 95 },
      { userId: user1._id, portfolioId: port1._id, name: 'Node.js & Express', category: 'Backend', proficiencyLevel: 92 },
      { userId: user1._id, portfolioId: port1._id, name: 'Tailwind CSS', category: 'Frontend', proficiencyLevel: 90 },
      { userId: user1._id, portfolioId: port1._id, name: 'MongoDB', category: 'Database', proficiencyLevel: 88 },
      { userId: user1._id, portfolioId: port1._id, name: 'TypeScript', category: 'Frontend', proficiencyLevel: 85 },
      { userId: user1._id, portfolioId: port1._id, name: 'Docker & AWS', category: 'DevOps', proficiencyLevel: 80 },
    ]);

    await Education.create({
      userId: user1._id,
      portfolioId: port1._id,
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      duration: '2018 - 2022',
      cgpa: '3.9 / 4.0',
      description: 'Specialized in Software Engineering and Distributed Systems.',
    });

    await Experience.create([
      {
        userId: user1._id,
        portfolioId: port1._id,
        company: 'Vortex Technologies',
        position: 'Senior Full Stack Engineer',
        duration: '2023 - Present',
        location: 'San Francisco, CA',
        description: 'Led a team of 5 engineers building cloud SaaS products handling 2M+ monthly active requests.',
      },
      {
        userId: user1._id,
        portfolioId: port1._id,
        company: 'Apex Software Studio',
        position: 'Frontend Developer',
        duration: '2022 - 2023',
        location: 'Remote',
        description: 'Architected responsive React design systems and improved page performance core web vitals by 45%.',
      },
    ]);

    await Certificate.create([
      {
        userId: user1._id,
        portfolioId: port1._id,
        title: 'AWS Certified Solutions Architect',
        organization: 'Amazon Web Services',
        issueDate: 'May 2023',
        credentialUrl: 'https://aws.amazon.com',
        certificateImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      },
    ]);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
