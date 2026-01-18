import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConsultationForm from './ConsultationForm';

interface ConsultationModalProps {
  initialPlan?: string;
}

export default function ConsultationModal({ initialPlan }: ConsultationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(initialPlan);

  // Listen for trigger clicks
  useEffect(() => {
    const handleTriggerClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest('.consultation-trigger');
      
      if (trigger) {
        e.preventDefault();
        const plan = trigger.getAttribute('data-plan');
        if (plan) setSelectedPlan(plan);
        setIsOpen(true);
      }
    };

    // Also handle nav CTA button
    const navCta = document.getElementById('nav-cta-btn');
    if (navCta) {
      navCta.addEventListener('click', () => setIsOpen(true));
    }

    document.addEventListener('click', handleTriggerClick);
    
    return () => {
      document.removeEventListener('click', handleTriggerClick);
      if (navCta) {
        navCta.removeEventListener('click', () => setIsOpen(true));
      }
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPlan(undefined);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[75vw] max-w-2xl -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-2xl modal-content-scroll">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="sticky top-4 right-4 float-right z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-accent-purple)] hover:border-[var(--color-accent-purple)] transition-all duration-300 shadow-md hover:shadow-lg"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="p-5 sm:p-6 md:p-8 pt-2 sm:pt-4">
                {/* Header */}
                <div className="mb-6 sm:mb-8 pr-12 sm:pr-14">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                    Book a Consultation
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
                    Tell us about your goals and we'll get back to you within 24 hours.
                  </p>
                </div>

                {/* Form */}
                <ConsultationForm 
                  onClose={handleClose}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
