/**
 * AI Content Generator Helper
 * Generates compelling About Me bios and detailed Project descriptions using Google Gemini API or Smart Fallback.
 */

export const generateBio = async ({ name, title, skills = [], experienceYears = '3+', tone = 'professional' }) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const skillsList = skills.length > 0 ? skills.join(', ') : 'modern web tech';
      const prompt = `Write a compelling portfolio "About Me" bio for ${name || 'a Developer'} whose job title is "${title || 'Full Stack Engineer'}". Key skills: ${skillsList}. Experience: ${experienceYears} years. Tone: ${tone}. Keep it concise (2-4 sentences), highly impressive, professional, and directly usable in a portfolio website.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch (e) {
      console.warn('Gemini API call failed, falling back to template generator:', e.message);
    }
  }

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

export const generateProjectDescription = async ({ title, techStack = [], goal = '', role = 'Lead Developer' }) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const stack = techStack.length > 0 ? techStack.join(', ') : 'React, Node.js, and MongoDB';
      const prompt = `Write a detailed, high-impact project description for a developer portfolio project titled "${title}". Role: ${role}. Tech Stack: ${stack}. Primary Goal: ${goal || 'streamline workflows'}. Keep it concise (2-3 sentences), highlighting architectural choices, responsive UI, and performance optimizations.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch (e) {
      console.warn('Gemini API call failed, falling back to template generator:', e.message);
    }
  }

  const stack = techStack.length > 0 ? techStack.join(', ') : 'React, Node.js, and MongoDB';
  const goalClause = goal ? ` to ${goal}` : ' to streamline user workflows and elevate operational performance';

  return `Engineered ${title || 'a high-performance application'}${goalClause}. As the ${role}, I architected the core application workflow utilizing ${stack}. Implemented robust security authentication, responsive UI components, dynamic data handling, and optimized database queries, delivering a 40% improvement in load times and an enhanced user experience.`;
};
