/**
 * q-mp-298 mutation audit UI wave 9 — kill survivors in fractions/fraction-bar-ui.
 * Structural / numeric pins only — no player-facing copy asserts.
 *
 * Note: DEFAULT_CONFIG.interactive false→true is intentionally not pinned —
 * `interactive` is never read by render / createInteractive paths (class name
 * is hard-coded). Documented survivor in docs/dev/mutation-audit-ui-9.md.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { renderHorizontalBar } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#fraction-bar-styles')
    .forEach((el) => el.remove());
});

describe('mutation-ui9 fraction-bar-ui', () => {
  it('DEFAULT height 40 + showLabel below → svg height 65 (kills L15 ±1, L21 true→false)', () => {
    // Survivors: height 40→41/39; showLabel true→false (drops +25 bump).
    const svg = renderHorizontalBar({ numerator: 1, denominator: 2 });
    expect(svg.getAttribute('width')).toBe('200');
    expect(svg.getAttribute('height')).toBe('65');
    expect(svg.getAttribute('viewBox')).toBe('0 0 200 65');
    // Structural: default showLabel true appends a <text> (content not asserted).
    expect(svg.querySelector('text')).toBeTruthy();
  });

  it('showLabel false keeps svg height at DEFAULT 40 (kills L15 ±1 without label bump)', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 2 },
      { showLabel: false }
    );
    expect(svg.getAttribute('height')).toBe('40');
    expect(svg.querySelector('text')).toBeNull();
  });

  it('background rect uses x=1 y=1 width=width-2 height=height-2 (kills L73–L75)', () => {
    // Survivors: bg x/y 1→2/0; width-2 → width+2 / 2→3 / 2→1.
    const svg = renderHorizontalBar(
      { numerator: 0, denominator: 4 },
      { showLabel: false, width: 200, height: 40 }
    );
    const bg = svg.querySelector('rect');
    expect(bg).toBeTruthy();
    expect(bg!.getAttribute('x')).toBe('1');
    expect(bg!.getAttribute('y')).toBe('1');
    expect(bg!.getAttribute('width')).toBe('198');
    expect(bg!.getAttribute('height')).toBe('38');
  });

  it('custom width/height still inset bg by exactly 2 on each axis', () => {
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 3 },
      { showLabel: false, width: 120, height: 24 }
    );
    const bg = svg.querySelector('rect');
    expect(bg!.getAttribute('x')).toBe('1');
    expect(bg!.getAttribute('y')).toBe('1');
    expect(bg!.getAttribute('width')).toBe('118');
    expect(bg!.getAttribute('height')).toBe('22');
  });
});
