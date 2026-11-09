import { z } from 'zod';
import { PRIMARY_INTEREST_OPTIONS, BACKGROUND_OPTIONS } from '../../content/form-options';

export const consultationSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().min(1, 'Email address is required').email('Invalid email address'),
  mobile: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[\d\s\-+()]+$/.test(val), {
      message: 'Invalid mobile number format',
    }),
  company: z.string().trim().optional(),
  primaryInterest: z.enum(PRIMARY_INTEREST_OPTIONS, {
    errorMap: () => ({ message: 'Please select your primary interest' }),
  }),
  background: z.enum(BACKGROUND_OPTIONS, {
    errorMap: () => ({ message: 'Please select your background' }),
  }),
  goals: z
    .string()
    .trim()
    .min(1, 'Please tell us what you are looking to achieve')
    .min(10, 'Please provide more details (at least 10 characters)'),
});

export type ConsultationFields = z.infer<typeof consultationSchema>;
