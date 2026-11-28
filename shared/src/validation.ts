import { z } from 'zod';

// Key used for errors that belong to the whole input, not to one field.
export const FORM_ERROR_KEY = '_form';

// Body of every 400 answer of the API. The form uses `fields` to show each
// message next to its input. Messages are translation keys, never final text.
export const validationErrorSchema = z.object({
  statusCode: z.literal(400),
  code: z.literal('VALIDATION_ERROR'),
  message: z.string(),
  fields: z.record(z.string(), z.array(z.string())),
});

export type FieldErrors = Record<string, string[]>;
export type ValidationError = z.infer<typeof validationErrorSchema>;

// Groups the issues of a failed parse by field: `address.street` for nested
// fields, `_form` for errors that belong to no field.
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const fields: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : FORM_ERROR_KEY;
    (fields[key] ??= []).push(issue.message);
  }
  return fields;
}

export function buildValidationError(error: z.ZodError): ValidationError {
  return {
    statusCode: 400,
    code: 'VALIDATION_ERROR',
    message: 'validation.failed',
    fields: toFieldErrors(error),
  };
}
