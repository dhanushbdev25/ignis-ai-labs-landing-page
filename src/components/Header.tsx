import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { Zap, Menu, X } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = ['Capabilities', 'Solutions', 'Process', 'Work', 'Contact'];

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
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
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px] h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Zap className="text-[var(--accent-blue)]" size={24} />
            <span className="text-[var(--neutral-900)] tracking-tight">Ignis AI Labs</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
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

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button variant="primary" onClick={() => scrollToSection('contact')}>
              Start Your Project
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-11 h-11 flex items-center justify-center text-[var(--neutral-900)] hover:bg-[var(--neutral-300)] rounded-lg transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Slide-in Menu */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Zap className="text-[var(--accent-blue)]" size={24} />
                    <span className="text-[var(--neutral-900)] tracking-tight">Ignis AI Labs</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-11 h-11 flex items-center justify-center text-[var(--neutral-700)] hover:bg-[var(--neutral-300)] rounded-lg transition-colors min-w-[44px] min-h-[44px]"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Mobile Navigation Items */}
                <nav className="space-y-2 mb-8">
                  {navItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item)}
                      className="w-full text-left px-4 py-3 text-[var(--neutral-700)] hover:text-[var(--accent-blue)] hover:bg-[var(--surface-light)] rounded-lg transition-colors duration-200 text-base"
                    >
                      {item}
                    </button>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <Button 
                  variant="primary" 
                  onClick={() => scrollToSection('contact')}
                  className="w-full"
                >
                  Start Your Project
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
