/**
 * Wave 67 leftover after tip/#316 — calla × juggle residual handshake.
 * Distinct from wave64/66; deepen AI violet + active board + strong exacts. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 handshake — calla × juggle residual', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts calla AI violet + juggle active border + tutorial exacts', () => {
    const callaCss = readFileSync(
      resolve(process.cwd(), 'src/style.css'),
      'utf8'
    );
    expect(callaCss).toContain(
      'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
    );
    expect(callaCss).toContain('drop-shadow(0 0 4px rgba(72, 187, 120, 0.3))');
    expect(
      callaTutorial.steps.find((s) => s.id === 'goal')?.message
    ).toContain('<strong>most cubes in your Calla</strong>');

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toMatch(
      /\.juggle-board\.active\s*\{[^}]*border-color:\s*#ffc107/
    );
    expect(jCss).toMatch(
      /\.juggle-die\.selectable:hover\s*\{[^}]*transform:\s*scale\(1\.1\)/
    );
    expect(
      juggleTutorial.steps.find((s) => s.id === 'dice-values')?.message
    ).toContain('<li><strong>1</strong> = Monomino (1 cell)</li>');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('<li>Plan ahead to avoid getting stuck</li>');
  });
});
