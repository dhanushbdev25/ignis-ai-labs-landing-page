import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

interface FormData {
  fullName: string;
  email: string;
  mobile: string;
  company?: string;
  primaryInterest: string;
  background: string;
  goals: string;
}

interface ConsultationFormProps {
  onClose: () => void;
  preselectedPlan?: string;
}

const PRIMARY_INTEREST_OPTIONS = [
  { value: 'Software Development Services', label: 'Software Development Services' },
  { value: 'AI & ML Solutions', label: 'AI & ML Solutions' },
  { value: 'Enterprise System Integration', label: 'Enterprise System Integration' },
  { value: 'Analytics & Business Intelligence', label: 'Analytics & Business Intelligence' },
  { value: 'Consulting & Architecture', label: 'Consulting & Architecture' },
  { value: 'Umbrae / Product Access', label: 'Umbrae / Product Access' },
  { value: 'Partnership / Collaboration', label: 'Partnership / Collaboration' },
];

const BACKGROUND_OPTIONS = [
  { value: 'Business Owner / Executive', label: 'Business Owner / Executive' },
  { value: 'Developer / Builder', label: 'Developer / Builder' },
  { value: 'Data Analyst / Researcher', label: 'Data Analyst / Researcher' },
  { value: 'IT Manager / Technical Lead', label: 'IT Manager / Technical Lead' },
  { value: 'Investor / Trader', label: 'Investor / Trader' },
  { value: 'Product Manager', label: 'Product Manager' },
];

export default function ConsultationForm({ onClose }: ConsultationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit');
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-close modal after 3 seconds on success
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, onClose]);

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6 sm:py-8"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-purple-dark)] flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-2">Thank You!</h3>
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-6">
          We've received your request and will get back to you within 24 hours.
        </p>
        <div className="flex justify-center items-center">
          <button 
            onClick={onClose} 
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-purple-dark)] text-white font-semibold hover:shadow-lg transition-all duration-300 relative z-10"
          >
            Close
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fullName', { required: 'Full name is required' })}
            type="text"
            placeholder="John Doe"
            className={`w-full px-4 py-3 rounded-xl border-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)] focus:border-[var(--color-accent-purple)] focus:outline-none transition-colors ${errors.fullName ? 'border-red-500' : ''}`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            type="email"
            placeholder="john@example.com"
            className={`w-full px-4 py-3 rounded-xl border-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)] focus:border-[var(--color-accent-purple)] focus:outline-none transition-colors ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register('mobile', {
              required: 'Mobile number is required',
              pattern: {
                value: /^[\d\s\-\+\(\)]+$/,
                message: 'Invalid mobile number format',
              },
            })}
            type="tel"
            placeholder="+1 234 567 890"
            className={`w-full px-4 py-3 rounded-xl border-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)] focus:border-[var(--color-accent-purple)] focus:outline-none transition-colors ${errors.mobile ? 'border-red-500' : ''}`}
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-500">{errors.mobile.message}</p>
          )}
        </div>

        {/* Company Name (Optional) */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Company Name
          </label>
          <input
            {...register('company')}
            type="text"
            placeholder="Company Inc (Optional)"
            className="w-full px-4 py-3 rounded-xl border-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)] focus:border-[var(--color-accent-purple)] focus:outline-none transition-colors"
          />
        </div>

        {/* Primary Interest */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Your Primary Interest <span className="text-red-500">*</span>
          </label>
          <select
            {...register('primaryInterest', { required: 'Please select your primary interest' })}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)] focus:border-[var(--color-accent-purple)] focus:outline-none transition-colors ${errors.primaryInterest ? 'border-red-500' : ''}`}
          >
            <option value="">Select your primary interest</option>
            {PRIMARY_INTEREST_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.primaryInterest && (
            <p className="mt-1 text-sm text-red-500">{errors.primaryInterest.message}</p>
          )}
        </div>

        {/* Background */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Your Background <span className="text-red-500">*</span>
          </label>
          <select
            {...register('background', { required: 'Please select your background' })}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)] focus:border-[var(--color-accent-purple)] focus:outline-none transition-colors ${errors.background ? 'border-red-500' : ''}`}
          >
            <option value="">Select your background</option>
            {BACKGROUND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.background && (
            <p className="mt-1 text-sm text-red-500">{errors.background.message}</p>
          )}
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            What are you looking to achieve with Ignis AI Labs? <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('goals', {
              required: 'Please tell us what you are looking to achieve',
              minLength: { value: 10, message: 'Please provide more details (at least 10 characters)' },
            })}
            rows={6}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-[var(--color-border)] focus:border-[var(--color-accent-purple)] focus:outline-none transition-colors min-h-[140px] sm:min-h-[160px] resize-y ${errors.goals ? 'border-red-500' : ''}`}
            placeholder="Tell us about your goals and what you hope to achieve..."
          />
          {errors.goals && (
            <p className="mt-1 text-sm text-red-500">{errors.goals.message}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 sm:p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 text-sm flex items-start gap-2"
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{submitError}</span>
        </motion.div>
      )}

      {/* Submit Button */}
      <div className="pt-4 sm:pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5 relative z-10" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="relative z-10">Submitting...</span>
            </>
          ) : (
            <>
              <span className="relative z-10">Submit Request</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
