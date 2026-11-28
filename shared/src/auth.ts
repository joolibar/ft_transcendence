import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const DISPLAY_NAME_MIN_LENGTH = 2;
export const DISPLAY_NAME_MAX_LENGTH = 30;

// Error messages are translation keys: the web app translates them (es, ca, en).
const required = { error: 'validation.required' };

// Input of the sign-up form and of POST /api/auth/sign-up. Used on both sides
// (architecture rule 6). Sign up and log in (#18) builds on it.
export const signUpSchema = z.object({
  // Trim and lowercase first, then check the format of the cleaned value.
  email: z
    .string(required)
    .trim()
    .toLowerCase()
    .pipe(
      z
        .email({ error: 'validation.email.invalid' })
        .max(254, { error: 'validation.email.too_long' }),
    ),
  password: z
    .string(required)
    .min(PASSWORD_MIN_LENGTH, { error: 'validation.password.too_short' })
    .max(PASSWORD_MAX_LENGTH, { error: 'validation.password.too_long' }),
  displayName: z
    .string(required)
    .trim()
    .min(DISPLAY_NAME_MIN_LENGTH, { error: 'validation.display_name.too_short' })
    .max(DISPLAY_NAME_MAX_LENGTH, { error: 'validation.display_name.too_long' }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
