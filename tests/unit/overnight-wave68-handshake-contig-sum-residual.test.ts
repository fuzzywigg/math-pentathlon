/**
 * Wave 68 leftover after tip/#337 — Contig × Sum residual handshake.
 * Mount unsaturated inject/style pins (no fab/fiar). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 handshake — contig × sum residual', () => {
  it('mounts residual tutorial + inject + style leftovers for both', () => {
    const contigStep = contig60Tutorial.steps.find((s) => s.id === 'objective');
    const sumStep = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(contigStep?.title).toBe('Objective');
    expect(sumStep?.title).toBe('Matching Rules');

    injectContigStyles();
    injectSDStyles();
    const contigCss = document.getElementById('contig-styles')?.textContent ?? '';
    const sumCss = document.getElementById('sd-styles')?.textContent ?? '';
    expect(contigCss).toMatch(/\.contig-cell-valid\s*\{[\s\S]*?background:\s*#c8e6c9/);
    expect(sumCss).toMatch(/\.sd-hand\s*\{[\s\S]*?max-width:\s*300px/);

    const style = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(style).toMatch(/\.contig-pass-btn\s*\{[\s\S]*?min-width:\s*120px/);
    expect(style).toMatch(/\.sd-roll-btn\s*\{[\s\S]*?font-weight:\s*600/);
  });
});
