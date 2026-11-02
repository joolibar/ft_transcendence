import { healthResponseSchema, type HealthResponse } from '@miga/shared';
import { useEffect, useState } from 'react';

// Temporary home page: confirms that web → API → database are connected.
// Replace it with the real screens once the design is ready.
export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data) => setHealth(healthResponseSchema.parse(data)))
      .catch(() => setFailed(true));
  }, []);

  const statusText = failed
    ? 'API unreachable'
    : health
      ? `API ${health.status} · database ${health.database}`
      : 'Checking API…';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 p-6 text-stone-900">
      <h1 className="text-5xl font-semibold tracking-tight">Miga</h1>
      <p className="text-stone-600">
        Save, rate and choose places to eat and drink with your friends.
      </p>
      <p role="status" className="rounded-full bg-white px-4 py-1 text-sm shadow-sm">
        {statusText}
      </p>
    </main>
  );
}
