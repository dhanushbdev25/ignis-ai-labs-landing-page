import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  preferredPlan: string;
}

interface ConsultationFormProps {
  onClose: () => void;
  preselectedPlan?: string;
}

const PROJECT_TYPES = [
  { value: 'website-design', label: 'Website Design' },
  { value: 'logo-design', label: 'Logo Design' },
  { value: 'branding', label: 'Branding' },
  { value: 'ui-ux', label: 'UI/UX Design' },
  { value: 'mobile-design', label: 'Mobile Design' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'other', label: 'Other' },
];

const BUDGET_RANGES = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-plus', label: '$50,000+' },
];

const STEPS = [
  { id: 1, title: 'Contact Info' },
  { id: 2, title: 'Project Details' },
  { id: 3, title: 'Message' },
];

export default function ConsultationForm({ onClose, preselectedPlan }: ConsultationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      preferredPlan: preselectedPlan || '',
    },
  });

  const watchedFields = watch();

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(['name', 'email']);
      case 2:
        return await trigger(['projectType']);
      case 3:
        return await trigger(['message']);
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

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
        throw new Error('Failed to submit');
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <button 
          onClick={onClose} 
          className="btn-primary inline-flex items-center justify-center gap-2 px-6 sm:px-8"
        >
          <span>Close</span>
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-purple-dark)] text-white shadow-purple-subtle'
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                }`}
              >
                {currentStep > step.id ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className={`text-xs sm:text-sm font-medium hidden sm:block ${
                currentStep >= step.id ? 'text-[var(--color-accent-purple)]' : 'text-[var(--color-text-muted)]'
              }`}>
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 sm:mx-3 transition-all duration-300 ${
                  currentStep > step.id ? 'bg-[var(--color-accent-purple)]' : 'bg-[var(--color-border)]'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {currentStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  placeholder="John Doe"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  placeholder="john@company.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Company</label>
                  <input {...register('company')} type="text" placeholder="Company Inc" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Phone</label>
                  <input {...register('phone')} type="tel" placeholder="+1 234 567 890" />
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Project Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('projectType', { required: 'Please select a project type' })}
                  className={errors.projectType ? 'border-red-500' : ''}
                >
                  <option value="">Select a project type</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="mt-1 text-sm text-red-500">{errors.projectType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Budget Range</label>
                <select {...register('budget')}>
                  <option value="">Select a budget range</option>
                  {BUDGET_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Preferred Plan</label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {['standard', 'premium'].map((plan) => (
                    <label
                      key={plan}
                      className={`flex items-center justify-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        watchedFields.preferredPlan === plan
                          ? 'border-[var(--color-accent-purple)] bg-[var(--color-accent-purple)]/10 shadow-md'
                          : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-secondary)]'
                      }`}
                    >
                      <input
                        {...register('preferredPlan')}
                        type="radio"
                        value={plan}
                        className="sr-only"
                      />
                      <span className="capitalize font-medium text-sm sm:text-base text-[var(--color-text-primary)]">{plan}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Tell us about your project <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('message', {
                  required: 'Please provide some details about your project',
                  minLength: { value: 20, message: 'Please provide more details (at least 20 characters)' },
                })}
                rows={6}
                className={`min-h-[140px] sm:min-h-[160px] ${errors.message ? 'border-red-500' : ''}`}
                placeholder="Describe your project, goals, and any specific requirements..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6">
        {currentStep > 1 ? (
          <button 
            type="button" 
            onClick={prevStep} 
            className="btn-secondary flex-1 order-2 sm:order-1"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}

        {currentStep < 3 ? (
          <button 
            type="button" 
            onClick={nextStep} 
            className="btn-primary inline-flex items-center justify-center gap-2 flex-1 order-1 sm:order-2"
          >
            Continue
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary inline-flex items-center justify-center gap-2 flex-1 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Request</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
