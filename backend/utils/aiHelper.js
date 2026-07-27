/**
 * AI Content Generator Helper
 * Generates compelling About Me bios and detailed Project descriptions.
 */

export const generateBio = ({ name, title, skills = [], experienceYears = '3+', tone = 'professional' }) => {
  const skillsList = skills.length > 0 ? skills.join(', ') : 'modern web tech';
  
  if (tone === 'creative') {
    return `Hey there! I'm ${name || 'a passionate developer'}, a visionary ${title || 'Full Stack Engineer'} dedicated to crafting immersive digital experiences. With expertise in ${skillsList}, I blend intuitive design with clean, high-performance architecture. I love turning complex challenges into elegant solutions that leave a lasting impact.`;
  }
  
  if (tone === 'minimal') {
    return `${title || 'Software Developer'} specializing in building scalable web applications. Proficient in ${skillsList}. Focused on performance, clean code, and intuitive user experiences.`;
  }

  // Default Professional tone
  return `I am ${name || 'a Software Engineer'}, a results-driven ${title || 'Full Stack Developer'} with ${experienceYears} years of experience engineering high-impact web applications. My core technical expertise spans ${skillsList}. I excel at architecting scalable backends, responsive design systems, and optimizing application performance to drive measurable business outcomes.`;
};

export const generateProjectDescription = ({ title, techStack = [], goal = '', role = 'Lead Developer' }) => {
  const stack = techStack.length > 0 ? techStack.join(', ') : 'React, Node.js, and MongoDB';
  const goalClause = goal ? ` to ${goal}` : ' to streamline user workflows and elevate operational performance';

  return `Engineered ${title || 'a high-performance application'}${goalClause}. As the ${role}, I architected the core application workflow utilizing ${stack}. Implemented robust security authentication, responsive UI components, dynamic data handling, and optimized database queries, delivering a 40% improvement in load times and an enhanced user experience.`;
};
