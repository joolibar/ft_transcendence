import { signUpSchema, type FieldErrors } from '@miga/shared';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useZodForm } from './useZodForm';

type Handlers = {
  onSubmit?: (data: unknown) => void;
  serverErrors?: FieldErrors;
  translate?: (key: string) => string;
};

// A tiny form that only exists to exercise the hook.
function SignUpForm({ onSubmit = () => {}, serverErrors, translate }: Handlers) {
  const form = useZodForm({
    schema: signUpSchema,
    initialValues: { email: '', password: '', displayName: '' },
    onSubmit,
    translate,
  });
  return (
    <form onSubmit={form.handleSubmit} noValidate>
      {(['email', 'password', 'displayName'] as const).map((name) => (
        <div key={name}>
          <label htmlFor={name}>{name}</label>
          <input id={name} {...form.getInputProps(name)} />
          {form.errors[name] && <p {...form.getErrorProps(name)}>{form.errors[name]}</p>}
        </div>
      ))}
      <button type="submit">Send</button>
      <button
        type="button"
        onClick={() => {
          if (serverErrors) form.setServerErrors(serverErrors);
        }}
      >
        Server error
      </button>
    </form>
  );
}

function type(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function click(name: string) {
  fireEvent.click(screen.getByRole('button', { name }));
}

function fill(values: { email: string; password: string; displayName: string }) {
  type('email', values.email);
  type('password', values.password);
  type('displayName', values.displayName);
}

describe('useZodForm', () => {
  it('shows no errors before the first submit', () => {
    render(<SignUpForm />);
    type('email', 'nope');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('email')).not.toHaveAttribute('aria-invalid');
  });

  it('submits the cleaned data when the input is valid', async () => {
    const onSubmit = vi.fn();
    render(<SignUpForm onSubmit={onSubmit} />);
    fill({ email: ' Ana@Example.com', password: 'a-long-password', displayName: 'Ana' });

    click('Send');

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'ana@example.com',
        password: 'a-long-password',
        displayName: 'Ana',
      });
    });
  });

  it('does not submit and shows each error next to its field', async () => {
    const onSubmit = vi.fn();
    render(<SignUpForm onSubmit={onSubmit} />);
    fill({ email: 'nope', password: 'short', displayName: 'Ana' });

    click('Send');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText('validation.email.invalid')).toBeInTheDocument();
    expect(screen.getByText('validation.password.too_short')).toBeInTheDocument();
    expect(screen.queryByText(/display_name/)).not.toBeInTheDocument();
  });

  it('links each invalid input to its error for screen readers', async () => {
    render(<SignUpForm />);
    fill({ email: 'nope', password: 'a-long-password', displayName: 'Ana' });

    click('Send');

    const input = screen.getByLabelText('email');
    const error = await screen.findByRole('alert');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(screen.getByLabelText('password')).not.toHaveAttribute('aria-invalid');
  });

  it('updates the errors while typing once the form was submitted', async () => {
    render(<SignUpForm />);
    fill({ email: 'nope', password: 'a-long-password', displayName: 'Ana' });
    click('Send');
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    type('email', 'ana@example.com');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('email')).not.toHaveAttribute('aria-invalid');
  });

  it('translates the messages with the given function', async () => {
    render(<SignUpForm translate={(key) => `translated ${key}`} />);

    click('Send');

    expect(await screen.findByText('translated validation.email.invalid')).toBeInTheDocument();
  });

  it('shows the errors that the API sent back', async () => {
    render(<SignUpForm serverErrors={{ email: ['validation.email.invalid'] }} />);

    click('Server error');

    expect(await screen.findByText('validation.email.invalid')).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toHaveAttribute('aria-invalid', 'true');
  });
});
