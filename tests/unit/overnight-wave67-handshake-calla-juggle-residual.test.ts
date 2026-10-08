/**
 * Wave 67 leftover after tip/#323/#324 — calla × juggle residual handshake.
 * Distinct from wave66 pulse/dice-area; deepen AI violet + die border leftovers. Tests-only.
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

  it('mounts calla AI violet + juggle die border + exact labels', () => {
    const callaCss = readFileSync(
      resolve(process.cwd(), 'src/style.css'),
      'utf8'
    );
    expect(callaCss).toContain('linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)');
    expect(callaCss).toMatch(
      /\.calla-pit-valid \.calla-pit-circle\s*\{[^}]*fill:\s*#5a3a22/s
    );
    expect(
      callaTutorial.steps.find((s) => s.id === 'strategy-tip')?.message
    ).toContain('<li>Look for capture opportunities</li>');

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toMatch(/\.juggle-die\s*\{[^}]*border:\s*3px solid #f57c00/);
    expect(jCss).toMatch(/\.juggle-boards\s*\{[^}]*justify-content:\s*center/);
    expect(
      juggleTutorial.steps.find((s) => s.id === 'dice-values')?.message
    ).toContain('<li><strong>1</strong> = Monomino (1 cell)</li>');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'placement-rules')?.message
    ).toContain('<li>Shapes can be rotated and flipped</li>');
  });
});
