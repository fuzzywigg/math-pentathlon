/**
 * Overnight TOKENMAXX — injectGraphStyles id guard is idempotent.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectGraphStyles } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.getElementById('graph-styles')?.remove();
});

describe('Overnight core graph-ui — inject styles idempotent', () => {
  it('second call does not add another style#graph-styles', () => {
    injectGraphStyles();
    injectGraphStyles();
    injectGraphStyles();
    expect(document.querySelectorAll('#graph-styles')).toHaveLength(1);
    expect(document.getElementById('graph-styles')?.textContent).toContain(
      '.graph-node'
    );
  });
});
