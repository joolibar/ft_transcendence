import { signUpSchema, validationErrorSchema } from '@miga/shared';
import Fastify, { type FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { registerValidation, type ZodTypeProvider } from './validation.js';

let app: FastifyInstance;

// A small app with one route per kind of input, so every place where the API
// reads data from the client is covered without touching the database.
beforeEach(async () => {
  app = Fastify();
  registerValidation(app);
  const routes = app.withTypeProvider<ZodTypeProvider>();

  routes.post('/sign-up', { schema: { body: signUpSchema } }, (request) => request.body);
  routes.get(
    '/places/:id',
    { schema: { params: z.object({ id: z.coerce.number().int().positive() }) } },
    (request) => ({ id: request.params.id }),
  );
  routes.get(
    '/search',
    {
      schema: {
        querystring: z.object({
          q: z.string().min(2),
          limit: z.coerce.number().int().min(1).max(50).default(20),
        }),
      },
    },
    (request) => request.query,
  );
  app.get('/boom', () => {
    throw new Error('Something broke');
  });
  await app.ready();
});

afterEach(async () => {
  await app.close();
});

describe('request validation', () => {
  it('passes a valid body through, cleaned by the schema', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/sign-up',
      payload: { email: ' Ana@Example.com ', password: 'a-long-password', displayName: 'Ana' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      email: 'ana@example.com',
      password: 'a-long-password',
      displayName: 'Ana',
    });
  });

  it('answers 400 with the shared error format when the body is invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/sign-up',
      payload: { email: 'nope', password: 'short', displayName: 'Ana' },
    });

    expect(response.statusCode).toBe(400);
    const body = validationErrorSchema.parse(response.json());
    expect(body.fields).toEqual({
      email: ['validation.email.invalid'],
      password: ['validation.password.too_short'],
    });
  });

  it('answers 400 when the body is missing', async () => {
    const response = await app.inject({ method: 'POST', url: '/sign-up' });

    expect(response.statusCode).toBe(400);
    expect(validationErrorSchema.safeParse(response.json()).success).toBe(true);
  });

  it('answers 400 when the body is not valid JSON', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/sign-up',
      headers: { 'content-type': 'application/json' },
      payload: '{not json',
    });

    expect(response.statusCode).toBe(400);
  });

  it('converts a valid param to its type', async () => {
    const response = await app.inject({ method: 'GET', url: '/places/42' });

    expect(response.json()).toEqual({ id: 42 });
  });

  it.each(['abc', '0', '-3', '1.5'])('answers 400 for the param %j', async (id) => {
    const response = await app.inject({ method: 'GET', url: `/places/${id}` });

    expect(response.statusCode).toBe(400);
    expect(validationErrorSchema.parse(response.json()).fields).toHaveProperty('id');
  });

  it('applies the defaults of a valid query', async () => {
    const response = await app.inject({ method: 'GET', url: '/search?q=pizza' });

    expect(response.json()).toEqual({ q: 'pizza', limit: 20 });
  });

  it.each(['/search', '/search?q=a', '/search?q=pizza&limit=0', '/search?q=pizza&limit=51'])(
    'answers 400 for the query %s',
    async (url) => {
      const response = await app.inject({ method: 'GET', url });

      expect(response.statusCode).toBe(400);
      expect(validationErrorSchema.safeParse(response.json()).success).toBe(true);
    },
  );

  it('does not turn other errors into validation errors', async () => {
    const response = await app.inject({ method: 'GET', url: '/boom' });

    expect(response.statusCode).toBe(500);
    expect(response.json()).not.toHaveProperty('code', 'VALIDATION_ERROR');
  });
});
