import { toFieldErrors, type FieldErrors } from '@miga/shared';
import { useId, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import type { z } from 'zod';

type Values = Record<string, string>;

interface UseZodFormOptions<Schema extends z.ZodType> {
  schema: Schema;
  initialValues: Values;
  // Runs only with valid, cleaned data. It handles its own errors.
  onSubmit: (data: z.output<Schema>) => void | Promise<void>;
  // Turns an error message (a translation key) into text. Defaults to the key.
  translate?: (key: string) => string;
}

// Validates a form with the same shared schema the API uses, and wires the
// accessibility attributes: `aria-invalid` on the input, and `aria-describedby`
// pointing at the element that shows its error.
//
//   <form onSubmit={form.handleSubmit} noValidate>
//     <input {...form.getInputProps('email')} />
//     {form.errors.email && <p {...form.getErrorProps('email')}>{form.errors.email}</p>}
//
// Errors appear on submit; after that they update as the user types.
export function useZodForm<Schema extends z.ZodType>({
  schema,
  initialValues,
  onSubmit,
  translate = (key) => key,
}: UseZodFormOptions<Schema>) {
  const formId = useId();
  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // One message per field is enough to show: the first one.
  function toMessages(fields: FieldErrors) {
    return Object.fromEntries(
      Object.entries(fields).flatMap(([name, keys]) =>
        keys[0] ? [[name, translate(keys[0])]] : [],
      ),
    );
  }

  function validate(next: Values) {
    const result = schema.safeParse(next);
    setErrors(result.success ? {} : toMessages(toFieldErrors(result.error)));
    return result;
  }

  const errorId = (name: string) => `${formId}-${name}-error`;

  return {
    values,
    errors,

    getInputProps(name: string) {
      return {
        name,
        value: values[name] ?? '',
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          const next = { ...values, [name]: event.target.value };
          setValues(next);
          if (submitted) validate(next);
        },
        'aria-invalid': errors[name] ? (true as const) : undefined,
        'aria-describedby': errors[name] ? errorId(name) : undefined,
      };
    },

    getErrorProps(name: string) {
      return { id: errorId(name), role: 'alert' as const };
    },

    handleSubmit: (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitted(true);
      const result = validate(values);
      if (result.success) void onSubmit(result.data);
    },

    // Shows the `fields` of a 400 answer from the API next to the inputs.
    setServerErrors: (fields: FieldErrors) => {
      setErrors(toMessages(fields));
    },
  };
}
