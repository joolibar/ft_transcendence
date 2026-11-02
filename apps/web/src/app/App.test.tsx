import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

function mockFetch(response: Response | Error) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(() =>
      response instanceof Error ? Promise.reject(response) : Promise.resolve(response),
    );
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('App', () => {
  it('shows the product name and a checking state while waiting', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Miga' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Checking API…');
  });

  it('shows the API and database state when the health check succeeds', async () => {
    const fetchSpy = mockFetch(jsonResponse({ status: 'ok', database: 'up', uptimeSeconds: 3 }));
    render(<App />);

    expect(await screen.findByText('API ok · database up')).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith('/api/health');
  });

  it('shows an error when the API answers with an error status', async () => {
    mockFetch(jsonResponse({ message: 'Bad gateway' }, 502));
    render(<App />);

    expect(await screen.findByText('API unreachable')).toBeInTheDocument();
  });

  it('shows an error when the response does not match the expected shape', async () => {
    mockFetch(jsonResponse({ unexpected: true }));
    render(<App />);

    expect(await screen.findByText('API unreachable')).toBeInTheDocument();
  });

  it('shows an error when the API cannot be reached', async () => {
    mockFetch(new TypeError('Failed to fetch'));
    render(<App />);

    expect(await screen.findByText('API unreachable')).toBeInTheDocument();
  });
});
