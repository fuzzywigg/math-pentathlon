/**
 * Wave 68 leftover after tip/#333 — calla × juggle residual handshake.
 * Distinct from wave67 AI violet/die border; deepen filter + status-var leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 68 handshake — calla × juggle residual', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts calla hover filter + juggle status vars + exact labels', () => {
    const callaCss = readFileSync(
      resolve(process.cwd(), 'src/style.css'),
      'utf8'
    );
    expect(callaCss).toContain('drop-shadow(0 0 12px rgba(72, 187, 120, 0.7))');
    expect(callaCss).toContain('url(#calla-board-gradient)');
    expect(
      callaTutorial.steps.find((s) => s.id === 'your-calla')?.message
    ).toContain('When passing YOUR Calla, you drop a cube in it too!');

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toMatch(
      /\.juggle-status\.player1\s*\{[^}]*color:\s*var\(--color-player1, #2196f3\)/
    );
    expect(jCss).toMatch(
      /\.juggle-cell\.occupied-player1\s*\{[^}]*background:\s*var\(--color-player1, #2196f3\)/
    );
    expect(
      juggleTutorial.steps.find((s) => s.id === 'turn-sequence')?.message
    ).toContain('<li><strong>Roll:</strong> Roll two dice</li>');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toContain('Click <strong>Finish</strong> and fill your grid!');
  });
});
