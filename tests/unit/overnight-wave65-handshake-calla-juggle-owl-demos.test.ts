/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Handshake calla×juggle×owl×demos.
 * Distinct from #311 demos / open #314 owl / open #315 calla-juggle tutorials. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { injectJuggleStyles } from '../../src/games/juggle/board-ui';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

describe('Wave 65 handshake — calla × juggle × owl × demos', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    localStorage.clear();
    storage.resetAll();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    storage.resetAll();
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts residual style/inject/format/demo leftovers', () => {
    const style = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(style).toMatch(/\.calla-board\s*\{[^}]*max-width:\s*550px/);
    expect(style).toContain('animation: callaPitPulse 2s ease-in-out infinite');
    expect(style).toMatch(/\.calla-last-move\s*\{[^}]*color:\s*#c05621/);

    injectJuggleStyles();
    const jCss = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(jCss).toMatch(/\.juggle-boards\s*\{[^}]*gap:\s*2rem/);
    expect(jCss).toMatch(/\.juggle-cell\s*\{[^}]*width:\s*28px/);
    expect(jCss).toMatch(/\.juggle-die\s*\{[^}]*font-size:\s*40px/);

    for (const m of owlMessages.getMessagesByCategory('milestone:reached')) {
      if (m.id !== 'milestone-games-50') storage.markMessageSeen(m.id);
    }
    expect(
      owlMessages.selectMessage('milestone:reached', {})!.text
    ).toBe('50 games! You are officially a Math Pentathlon enthusiast!');

    const attr = document.createElement('div');
    document.body.appendChild(attr);
    renderAttributeDemo(attr);
    expect(attr.querySelector('style')?.textContent ?? '').toContain(
      '2px dashed #ccc'
    );

    document.body.innerHTML = '';
    const frac = document.createElement('div');
    document.body.appendChild(frac);
    renderFractionDemo(frac);
    expect(frac.querySelector('style')?.textContent ?? '').toContain('#45a049');

    document.body.innerHTML = '';
    const poly = document.createElement('div');
    document.body.appendChild(poly);
    renderPolyominoDemo(poly);
    expect(poly.querySelector('style')?.textContent ?? '').toMatch(
      /\.shape-gallery\s*\{[^}]*gap:\s*15px/
    );
  });
});
