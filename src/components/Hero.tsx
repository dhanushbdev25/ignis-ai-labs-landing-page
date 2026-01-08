import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Button } from './Button';
import { InteractiveBackground } from './InteractiveBackground';
import { ArrowRight, FileText } from 'lucide-react';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[60vh] md:min-h-[72vh] flex items-center overflow-hidden bg-gradient-to-br from-[var(--surface-white)] to-[var(--surface-light)]"
    >
      <InteractiveBackground />
      
      <motion.div 
        className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px] py-[var(--s-8)] w-full"
        style={{ y, opacity }}
      >
        <div className="grid grid-cols-12 gap-8">
          <motion.div 
            className="col-span-12 md:col-span-10 lg:col-span-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.h1 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Ignis AI Labs
              <br />
              <motion.span 
                className="block mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                Engineering Intelligent Systems
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-[var(--neutral-700)] mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              Software, AI and data engineering for enterprise transformation.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button 
                variant="primary" 
                icon={ArrowRight}
                onClick={() => scrollToSection('contact')}
                className='mb-4'
              >
                Start Your Project
              </Button>
              <Button 
                variant="secondary" 
                icon={FileText}
                onClick={() => scrollToSection('work')}
                className='mb-4'
              >
                View Case Studies
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {['AI', 'Engineering', 'Data'].map((tag, index) => (
                <motion.span 
                  key={tag}
                  className="px-3 py-1 text-xs tracking-wide text-[var(--accent-slate)] border border-[var(--neutral-300)] rounded-full bg-white/50 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.05, borderColor: 'var(--accent-blue)' }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
