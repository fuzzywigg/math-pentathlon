/**
 * Wave 66 leftover after tip/#316 — calla × juggle residual handshake.
 * Distinct from wave64 capture/roll-disabled; deepen style + strong labels. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 66 handshake — calla × juggle residual', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts calla style pulse + juggle dice-area + strong labels', () => {
    const callaCss = readFileSync(
      resolve(process.cwd(), 'src/style.css'),
      'utf8'
    );
    expect(callaCss).toContain('@keyframes callaPitPulse');
    expect(callaCss).toContain('stroke: #48bb78');
    expect(
      callaTutorial.steps.find((s) => s.id === 'strategy-tip')?.message
    ).toContain('<li>Count ahead to land in your Calla!</li>');

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toMatch(/\.juggle-dice-area\s*\{[^}]*flex-direction:\s*column/);
    expect(jCss).toMatch(/\.juggle-roll-btn\s*\{[^}]*color:\s*white/);
    expect(
      juggleTutorial.steps.find((s) => s.id === 'turn-sequence')?.message
    ).toContain('<strong>Roll:</strong>');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'placement-rules')?.message
    ).toContain(
      '<li>Shapes cannot overlap with previously placed shapes</li>'
    );
  });
});
