import { Zap, Mail, Linkedin, Twitter, Github } from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: 'About',
      links: ['Company', 'Team', 'Careers', 'News']
    },
    {
      title: 'Services',
      links: ['Software Engineering', 'AI & ML', 'Data Engineering', 'Product Design']
    },
    {
      title: 'Solutions',
      links: ['Enterprise Software', 'Supply Chain', 'Financial Systems', 'Healthcare Tech']
    },
    {
      title: 'Resources',
      links: ['Case Studies', 'Documentation', 'Blog', 'Support']
    }
  ];

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[var(--neutral-900)] text-white py-16">
      <div className="max-w-[1400px] mx-auto px-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-[var(--accent-blue)]" size={28} />
              <span className="text-xl tracking-tight">Ignis AI Labs</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Engineering intelligent systems for enterprise transformation through software, AI, and data engineering.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <a 
                href="mailto:contact@ignisailabs.com" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={16} />
                contact@ignisailabs.com
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollToSection(link)}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Ignis AI Labs. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
