import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { buildValidationError, toFieldErrors, validationErrorSchema } from './validation.js';

const schema = z
  .object({
    name: z.string({ error: 'required' }).min(2, { error: 'too_short' }),
    address: z.object({ street: z.string({ error: 'required' }) }),
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, { error: 'mismatch' });

function failure(input: unknown) {
  const result = schema.safeParse(input);
  if (result.success) throw new Error('Expected the input to be rejected');
  return result.error;
}

describe('toFieldErrors', () => {
  it('groups the messages by field', () => {
    const error = failure({ name: 'a', address: {}, password: 'x', confirm: 'x' });

    expect(toFieldErrors(error)).toEqual({
      name: ['too_short'],
      'address.street': ['required'],
    });
  });

  it('puts errors that belong to no field under _form', () => {
    const error = failure({ name: 'ana', address: { street: 's' }, password: 'a', confirm: 'b' });

    expect(toFieldErrors(error)).toEqual({ _form: ['mismatch'] });
  });

  it('keeps every message of a field', () => {
    const many = z.object({ value: z.string().min(3, 'short').regex(/^\d+$/, 'digits') });
    const result = many.safeParse({ value: 'a' });
    if (result.success) throw new Error('Expected the input to be rejected');

    expect(toFieldErrors(result.error)).toEqual({ value: ['short', 'digits'] });
  });
});

describe('buildValidationError', () => {
  it('builds a body that matches the shared error schema', () => {
    const body = buildValidationError(failure({}));

    expect(validationErrorSchema.parse(body)).toEqual(body);
    expect(body).toMatchObject({ statusCode: 400, code: 'VALIDATION_ERROR' });
  });
});
