import { describe, expect, it } from 'vitest';
import { signUpSchema } from './auth.js';
import { toFieldErrors } from './validation.js';

const validInput = { email: 'ana@example.com', password: 'a-long-password', displayName: 'Ana' };

function errorsFor(input: unknown) {
  const result = signUpSchema.safeParse(input);
  if (result.success) throw new Error('Expected the input to be rejected');
  return toFieldErrors(result.error);
}

describe('signUpSchema', () => {
  it('accepts a valid input', () => {
    expect(signUpSchema.parse(validInput)).toEqual(validInput);
  });

  it('lowercases and trims the email, and trims the display name', () => {
    const result = signUpSchema.parse({
      ...validInput,
      email: '  Ana@Example.COM ',
      displayName: '  Ana  ',
    });

    expect(result.email).toBe('ana@example.com');
    expect(result.displayName).toBe('Ana');
  });

  it('keeps the spaces of a password', () => {
    const result = signUpSchema.parse({ ...validInput, password: '  spaces are fine  ' });

    expect(result.password).toBe('  spaces are fine  ');
  });

  it.each(['', 'not-an-email', 'ana@', '@example.com', 'ana example@x.com'])(
    'rejects the email %j',
    (email) => {
      expect(errorsFor({ ...validInput, email }).email).toEqual(['validation.email.invalid']);
    },
  );

  it('rejects an email longer than 254 characters', () => {
    const email = `${'a'.repeat(250)}@example.com`;

    expect(errorsFor({ ...validInput, email }).email).toContain('validation.email.too_long');
  });

  it('rejects a password shorter than 8 characters', () => {
    expect(errorsFor({ ...validInput, password: '1234567' }).password).toEqual([
      'validation.password.too_short',
    ]);
  });

  it('rejects a password longer than 128 characters', () => {
    expect(errorsFor({ ...validInput, password: 'a'.repeat(129) }).password).toEqual([
      'validation.password.too_long',
    ]);
  });

  it('rejects a display name that is empty once trimmed', () => {
    expect(errorsFor({ ...validInput, displayName: '   ' }).displayName).toEqual([
      'validation.display_name.too_short',
    ]);
  });

  it('rejects a display name longer than 30 characters', () => {
    expect(errorsFor({ ...validInput, displayName: 'a'.repeat(31) }).displayName).toEqual([
      'validation.display_name.too_long',
    ]);
  });

  it('reports every missing field as required', () => {
    expect(errorsFor({})).toEqual({
      email: ['validation.required'],
      password: ['validation.required'],
      displayName: ['validation.required'],
    });
  });

  it.each([null, undefined, 'text', 42])('rejects %j instead of an object', (input) => {
    expect(signUpSchema.safeParse(input).success).toBe(false);
  });
});
