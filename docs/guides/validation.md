# Validation guide

No invalid input reaches the business logic or the database. The rule ([architecture rule 6](../architecture.md#rules)) is: **one Zod schema in `shared/`, used by the form and by the API route.** The form uses it for fast feedback. The API uses it because anyone can skip the browser and call it directly.

| Piece                                                                          | What it does                                                                |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| [`shared/src/<domain>.ts`](../../shared/src/auth.ts)                           | The schema: what valid input looks like, and the message of each rule.      |
| [`shared/src/validation.ts`](../../shared/src/validation.ts)                   | The shape of the 400 answer and the helper that groups errors by field.     |
| [`backend/src/plugins/validation.ts`](../../backend/src/plugins/validation.ts) | Validates body, params and query with the schema and builds the 400 answer. |
| [`frontend/src/hooks/useZodForm.ts`](../../frontend/src/hooks/useZodForm.ts)   | Validates a form with the schema and sets the accessibility attributes.     |

## Messages are translation keys

A rule's message is a key such as `validation.password.too_short`, not a sentence. The schema is shared, so it cannot know the user's language. The web app translates the key (es, ca, en) when it shows it. Add every new key to the three language files.

## The 400 answer

Every invalid request gets the same answer, so the web app handles it in one place:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "validation.failed",
  "fields": {
    "email": ["validation.email.invalid"],
    "password": ["validation.password.too_short"]
  }
}
```

`fields` maps each field to its messages. Nested fields use a dot (`address.street`). An error that belongs to no field, such as a rule that compares two fields, goes under `_form`. The type is `ValidationError` in `@miga/shared`.

## Adding validation to a new route

1. **Write the schema** in `shared/src/<domain>.ts`, with a key for each message, and export it from `shared/src/index.ts`:

   ```ts
   export const createReviewSchema = z.object({
     rating: z.number({ error: 'validation.required' }).int().min(1).max(5),
     comment: z.string().trim().max(1000, { error: 'validation.comment.too_long' }),
   });
   ```

2. **Use it in the route.** Declare the schema for each part of the request you read, with the type provider so `request.body` is typed. Use `z.coerce` for params and query, which always arrive as text:

   ```ts
   import type { ZodTypeProvider } from '../../plugins/validation.js';

   app.withTypeProvider<ZodTypeProvider>().post(
     '/places/:id/reviews',
     {
       schema: {
         params: z.object({ id: z.coerce.number().int().positive() }),
         body: createReviewSchema,
       },
     },
     async (request) => {
       // request.params.id is a number, request.body is a CreateReview.
     },
   );
   ```

   A route that reads a body, a param or a query without declaring a schema for it is not finished.

3. **Use it in the form** with `useZodForm`. Add `noValidate` so the browser's own messages do not replace ours:

   ```tsx
   const form = useZodForm({ schema: createReviewSchema, initialValues, onSubmit });

   <form onSubmit={form.handleSubmit} noValidate>
     <input {...form.getInputProps('comment')} />
     {form.errors.comment && <p {...form.getErrorProps('comment')}>{form.errors.comment}</p>}
   </form>;
   ```

   The hook sets `aria-invalid` on the input and `aria-describedby` pointing at the error, and the error has `role="alert"`, so screen readers announce it. Errors appear on submit and then update as the user types. When the API answers a 400 anyway (for example the email is taken), pass `fields` from the answer to `form.setServerErrors`.

4. **Test both sides** ([testing guide](testing.md)):
   - `shared`: the valid input passes and each rule rejects its invalid case ([`auth.test.ts`](../../shared/src/auth.test.ts)).
   - `backend`: the route answers 400 for each part of the request ([`validation.test.ts`](../../backend/src/plugins/validation.test.ts)).
   - `frontend`: the form shows the error next to the field ([`useZodForm.test.tsx`](../../frontend/src/hooks/useZodForm.test.tsx)).

## Things to remember

- **Validation is not sanitising for output.** The schema cleans values (trim, lowercase) but does not escape them. React escapes what it renders, and Prisma sends values as query parameters, never as text glued into SQL.
- **Do not log the input.** A rejected sign-up contains a password. The plugin logs only the names of the invalid fields.
- **Limits matter.** Give every string a maximum length, so nobody can send a megabyte as a name.
