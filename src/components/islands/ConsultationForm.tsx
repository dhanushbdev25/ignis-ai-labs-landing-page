import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consultationSchema, type ConsultationFields } from './consultation-schema';
import { PRIMARY_INTEREST_OPTIONS, BACKGROUND_OPTIONS } from '../../content/form-options';

interface Props {
  onClose: () => void;
}

const inputBase =
  'peer w-full bg-transparent border-0 border-b border-hairline px-0 py-3 text-ivory text-base font-sans placeholder:text-ivory/25 focus:outline-none focus:ring-0 transition-colors duration-300 rounded-none';

function FieldShell({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <div className="group relative">
      {children}
      {/* focus filament: hairline ignites molten left-to-right */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-ember-red via-ember-core to-ember-amber transition-transform duration-500 ease-out group-focus-within:scale-x-100"
      />
      {error && (
        <p role="alert" className="mt-1.5 font-mono text-[11px] tracking-wider text-ember-core">
          {error}
        </p>
      )}
    </div>
  );
}

function FieldLabel({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block font-mono text-[11px] uppercase tracking-[0.18em] text-ember-amber/70"
    >
      {children}
      {required && <span className="text-ember-core"> *</span>}
    </label>
  );
}

export default function ConsultationForm({ onClose }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultationFields>({ resolver: zodResolver(consultationSchema) });

  const onSubmit = async (data: ConsultationFields) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as { error?: string }).error || 'Failed to submit');
      }
      setTicket(`REQ-${Date.now().toString(36).toUpperCase()}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (ticket) {
    return (
      <div className="flex min-h-[320px] flex-col items-start justify-center py-8 text-left">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ember-amber/70">
          SPARK RECEIVED · {ticket}
        </p>
        <h3 className="mt-5 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] tracking-tight text-ivory">
          We&rsquo;ll reply within <em className="font-display italic text-gradient-molten">24 hours</em>.
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-ivory/60">
          Your request is in the forge. A member of our team will reach out to
          schedule the consultation.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 font-mono text-[12px] uppercase tracking-[0.18em] text-ivory/60 underline decoration-hairline-hot underline-offset-8 transition-colors hover:text-ember-amber"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <FieldShell error={errors.fullName?.message}>
          <FieldLabel htmlFor="cf-name" required>Full Name</FieldLabel>
          <input id="cf-name" type="text" autoComplete="name" placeholder="Your name" className={inputBase}
            aria-invalid={!!errors.fullName} {...register('fullName')} />
        </FieldShell>

        <FieldShell error={errors.email?.message}>
          <FieldLabel htmlFor="cf-email" required>Email Address</FieldLabel>
          <input id="cf-email" type="email" autoComplete="email" placeholder="you@company.com" className={inputBase}
            aria-invalid={!!errors.email} {...register('email')} />
        </FieldShell>

        <FieldShell error={errors.mobile?.message}>
          <FieldLabel htmlFor="cf-mobile" required>Mobile Number</FieldLabel>
          <input id="cf-mobile" type="tel" autoComplete="tel" placeholder="+91 00000 00000" className={inputBase}
            aria-invalid={!!errors.mobile} {...register('mobile')} />
        </FieldShell>

        <FieldShell>
          <FieldLabel htmlFor="cf-company">Company</FieldLabel>
          <input id="cf-company" type="text" autoComplete="organization" placeholder="Optional" className={inputBase}
            {...register('company')} />
        </FieldShell>

        <FieldShell error={errors.primaryInterest?.message}>
          <FieldLabel htmlFor="cf-interest" required>Primary Interest</FieldLabel>
          <div className="relative">
            <select id="cf-interest" defaultValue="" className={`${inputBase} appearance-none pr-8 [&>option]:bg-surface-2 [&>option]:text-ivory`}
              aria-invalid={!!errors.primaryInterest} {...register('primaryInterest')}>
              <option value="" disabled>Select…</option>
              {PRIMARY_INTEREST_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <svg aria-hidden="true" viewBox="0 0 12 12" className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-ember-amber/70">
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        </FieldShell>

        <FieldShell error={errors.background?.message}>
          <FieldLabel htmlFor="cf-background" required>Your Background</FieldLabel>
          <div className="relative">
            <select id="cf-background" defaultValue="" className={`${inputBase} appearance-none pr-8 [&>option]:bg-surface-2 [&>option]:text-ivory`}
              aria-invalid={!!errors.background} {...register('background')}>
              <option value="" disabled>Select…</option>
              {BACKGROUND_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <svg aria-hidden="true" viewBox="0 0 12 12" className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-ember-amber/70">
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        </FieldShell>
      </div>

      <FieldShell error={errors.goals?.message}>
        <FieldLabel htmlFor="cf-goals" required>What are you looking to achieve with Ignis AI Labs?</FieldLabel>
        <textarea id="cf-goals" rows={4} placeholder="Tell us about your goals…"
          className={`${inputBase} min-h-[96px] resize-y`}
          aria-invalid={!!errors.goals} {...register('goals')} />
      </FieldShell>

      {submitError && (
        <p role="alert" className="border border-ember-core/30 bg-ember-deep/20 px-4 py-3 font-mono text-[12px] tracking-wider text-ember-amber">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="btn-molten w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{submitting ? 'Transmitting…' : 'Submit Request'}</span>
      </button>
    </form>
  );
}
