import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Send, Check } from 'lucide-react';

export function FinalCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-[var(--s-8)] bg-gradient-to-br from-[var(--surface-white)] to-[var(--surface-light)]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6">
              Build with precision.
              <br />
              Deploy with intelligence.
            </h2>
            
            <p className="text-base md:text-lg text-[var(--neutral-700)] mb-8 md:mb-12 max-w-2xl mx-auto">
              Let's discuss how we can engineer intelligent systems for your enterprise transformation.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-4 md:p-8 shadow-lg border border-[var(--neutral-300)] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-left">
                    <label htmlFor="name" className="block text-sm mb-2 text-[var(--neutral-700)]">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="text-left">
                    <label htmlFor="email" className="block text-sm mb-2 text-[var(--neutral-700)]">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="text-left">
                  <label htmlFor="message" className="block text-sm mb-2 text-[var(--neutral-700)]">
                    Project Brief *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--neutral-300)] rounded-lg focus:outline-none focus:border-[var(--accent-blue)] transition-colors resize-none"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>
                
                <Button variant="primary" icon={Send}>
                  Schedule a Consultation
                </Button>
              </form>
            ) : (
              <motion.div
                className="py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="mb-2">Thank you!</h3>
                <p className="text-[var(--neutral-700)]">
                  We'll be in touch within 24 hours to discuss your project.
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.p
            className="mt-8 text-sm text-[var(--neutral-700)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Prefer email? Reach us directly at{' '}
            <a href="mailto:contact.ignisailabs@gmail.com" className="text-[var(--accent-blue)] hover:underline">
              contact.ignisailabs@gmail.com
            </a>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
