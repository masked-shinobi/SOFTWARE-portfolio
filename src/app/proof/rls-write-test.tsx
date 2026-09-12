// =============================================================================
// RLS Write Test — Client Component
// =============================================================================
// Tests that the anon key (browser client) CANNOT insert into the projects
// table. RLS should block this with an error.
// =============================================================================

'use client';

import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- intentional: RLS test needs raw operations
import { createClient } from '@/lib/supabase/client';

interface TestResult {
  action: string;
  blocked: boolean;
  message: string;
}

export function RlsWriteTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  async function runTests() {
    setRunning(true);
    setResults([]);

    const supabase = createClient();
    const testResults: TestResult[] = [];

    // Test 1: Attempt INSERT into projects (should be blocked)
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('projects')
        .insert({
          title: 'RLS Test — DELETE ME',
          slug: 'rls-test-delete-me',
          tech_stack: [],
          images: [],
          featured: false,
          published: false,
          display_order: 9999,
        });

      testResults.push({
        action: 'INSERT into projects',
        blocked: !!error,
        message: error ? `Blocked: ${error.message}` : '⚠️ NOT BLOCKED — RLS may be misconfigured!',
      });
    }

    // Test 2: Attempt UPDATE on projects (should affect 0 rows or error)
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error, count } = await (supabase as any)
        .from('projects')
        .update({ title: 'HACKED' })
        .eq('display_order', 1)
        .select('id');

      const wasBlocked = !!error || (count !== null && count === 0);
      testResults.push({
        action: 'UPDATE projects (change title)',
        blocked: wasBlocked,
        message: error
          ? `Blocked: ${error.message}`
          : `Rows affected: ${count ?? 'unknown'} (should be 0)`,
      });
    }

    // Test 3: Attempt DELETE on projects (should affect 0 rows or error)
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error, count } = await (supabase as any)
        .from('projects')
        .delete()
        .eq('slug', 'rls-test-delete-me')
        .select('id');

      const wasBlocked = !!error || (count !== null && count === 0);
      testResults.push({
        action: 'DELETE from projects',
        blocked: wasBlocked,
        message: error
          ? `Blocked: ${error.message}`
          : `Rows affected: ${count ?? 'unknown'} (should be 0)`,
      });
    }

    setResults(testResults);
    setRunning(false);
  }

  return (
    <div>
      <button
        onClick={runTests}
        disabled={running}
        style={{
          padding: '0.5rem 1.5rem',
          fontSize: '1rem',
          cursor: running ? 'wait' : 'pointer',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          marginBottom: '1rem',
        }}
      >
        {running ? 'Testing…' : '🔒 Run RLS Write Tests'}
      </button>

      {results.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Action</th>
              <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Blocked?</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{r.action}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  {r.blocked ? '✅ Yes' : '❌ No'}
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', color: r.blocked ? '#2a7' : 'red' }}>
                  {r.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
