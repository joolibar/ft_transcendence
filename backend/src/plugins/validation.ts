import { buildValidationError } from '@miga/shared';
import type { FastifyInstance, FastifySchemaCompiler, FastifyTypeProvider } from 'fastify';
import { ZodError, type z } from 'zod';

// Lets a route declare `schema: { body, params, querystring }` with Zod schemas
// and get the parsed, typed values in `request.body`, `request.params` and
// `request.query`.
export interface ZodTypeProvider extends FastifyTypeProvider {
  validator: this['schema'] extends z.ZodType ? z.output<this['schema']> : unknown;
}

// Fastify calls this for the body, params and query of every route with a schema.
// What the schema returns (trimmed, lowercased...) replaces the raw input.
const validatorCompiler: FastifySchemaCompiler<z.ZodType> =
  ({ schema }) =>
  (data) => {
    const result = schema.safeParse(data);
    return result.success ? { value: result.data } : { error: result.error };
  };

// Installs the Zod validator and answers every invalid request with a 400 in
// the same shape (`validationErrorSchema` in @miga/shared). Other errors keep
// Fastify's default handling.
export function registerValidation(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler);
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      request.log.info(
        { fields: Object.keys(buildValidationError(error).fields) },
        'Invalid input',
      );
      return reply.code(400).send(buildValidationError(error));
    }
    return reply.send(error);
  });
}
