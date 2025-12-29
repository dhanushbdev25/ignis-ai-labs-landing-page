import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Zap } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Capabilities', 'Solutions', 'Process', 'Work', 'Contact'];

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'h-14 bg-white/80 backdrop-blur-md shadow-md' 
          : 'h-20 bg-white/50 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-[1400px] mx-auto px-[120px] h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Zap className="text-[var(--accent-blue)]" size={24} />
          <span className="text-[var(--neutral-900)] tracking-tight">Ignis AI Labs</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-[var(--neutral-700)] hover:text-[var(--accent-blue)] transition-colors duration-200 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-blue)] transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Button variant="primary" onClick={() => scrollToSection('contact')}>
            Start Your Project
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
