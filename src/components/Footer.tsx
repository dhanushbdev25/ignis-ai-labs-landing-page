import { Zap, Mail, Phone, Linkedin, Twitter, Github } from 'lucide-react';

export function Footer() {
  const footerSections = [
    // {
    //   title: 'About',
    //   links: ['Company', 'Team', 'Careers', 'News']
    // },
    {
      title: 'Services',
      links: ['Software Engineering', 'AI & ML', 'Data Engineering', 'Product Design', 'Consulting', 'Training']
    },
    {
      title: 'Solutions',
      links: ['Enterprise Software', 'Supply Chain', 'Financial Systems', 'Healthcare Tech', 'Energy & Utilities', 'Transportation & Logistics']
    },
    // {
    //   title: 'Resources',
    //   links: ['Case Studies', 'Documentation', 'Blog', 'Support']
    // }
  ];

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[var(--neutral-900)] text-white py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12 mb-12">
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
                href="mailto:contact.ignisailabs@gmail.com" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={16} />
                contact.ignisailabs@gmail.com
              </a>
              <a 
                href="tel:+916380294386" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Phone size={16} />
                +91 6380294386
              </a>
              <div className="text-sm text-gray-400 leading-relaxed pt-1">
                <div>8/90 A, Saint Thomas Nagar, B Colony</div>
                <div>Tirunelveli, 627007</div>
                <div>Tamil Nadu, India</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-11 h-11 rounded-full border border-gray-700 flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors min-w-[44px] min-h-[44px]"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 rounded-full border border-gray-700 flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors min-w-[44px] min-h-[44px]"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 rounded-full border border-gray-700 flex items-center justify-center hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)] transition-colors min-w-[44px] min-h-[44px]"
                aria-label="GitHub"
              >
                <Github size={18} />
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
