import React from 'react';

function App() {
  const projects = [
    {
      title: "Founders' Edge Landing Page",
      category: "Web Development",
      description: "A high-converting startup accelerator landing page featuring smooth scroll interactions and clean monochrome layout.",
      tags: ["React", "Tailwind CSS", "UI/UX"]
    },
    {
      title: "Smart Enclosure Monitoring",
      category: "AIoT / Embedded UI",
      description: "Interactive real-time monitoring dashboard for smart environmental and storage hardware controls.",
      tags: ["React", "IoT", "Data Viz"]
    },
    {
      title: "The Print Aura - Brand Graphics",
      category: "Graphic Design",
      description: "High-impact visual identity, custom apparel vectors, cyber aesthetics, and promotional marketing assets.",
      tags: ["Branding", "Vector Art", "Photoshop"]
    }
  ];

  const skills = [
    "React.js", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 & CSS3",
    "Adobe Photoshop", "Adobe Illustrator", "UI/UX Design", "Git & GitHub"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 z-50 px-6 md:px-16 py-4 flex justify-between items-center">
        <span className="text-xl font-bold tracking-widest text-cyan-400">KALANA.</span>
        <div className="space-x-6 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
          <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-16">
        <div className="inline-block px-4 py-1 mb-4 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          Available for Freelance & Projects
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Kalana</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Frontend Developer & Graphic Designer passionate about crafting modern digital interfaces, clean web experiences, and distinctive brand visuals.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#projects" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/20">
            Explore Work
          </a>
          <a href="#contact" className="border border-slate-800 hover:border-slate-600 bg-slate-900/50 text-slate-200 font-medium px-6 py-3 rounded-lg transition-all">
            Get in Touch
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-16 max-w-5xl mx-auto border-t border-slate-900">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">About Me</h2>
        <p className="text-slate-400 text-lg leading-relaxed text-center max-w-3xl mx-auto mb-8">
          I bridge the gap between creative visual design and responsive front-end engineering. Whether building sleek React web applications or developing custom digital graphics, I focus on clean aesthetics, optimal usability, and fast performance.
        </p>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 px-6 md:px-16 max-w-5xl mx-auto border-t border-slate-900">
        <h2 className="text-3xl font-bold mb-10 text-white text-center">Skills & Technologies</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill, index) => (
            <span key={index} className="px-5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 md:px-16 max-w-6xl mx-auto border-t border-slate-900">
        <h2 className="text-3xl font-bold mb-12 text-white text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
              <div>
                <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">{proj.category}</span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-cyan-300 transition-colors">{proj.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{proj.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                {proj.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-xs px-2.5 py-1 rounded bg-slate-800/80 text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-16 max-w-4xl mx-auto text-center border-t border-slate-900">
        <h2 className="text-3xl font-bold mb-4 text-white">Let's Work Together</h2>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto text-base">
          Have an upcoming design project or need a responsive web interface built? Feel free to reach out.
        </p>
        <a href="mailto:your-email@example.com" className="inline-block bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-8 py-3.5 rounded-lg transition-all shadow-lg shadow-cyan-500/20">
          Say Hello
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-xs border-t border-slate-900">
        © {new Date().getFullYear()} Kalana. Built with React & Tailwind CSS. Hosted on Vercel.
      </footer>
    </div>
  );
}

export default App;
