/**
 * Accessibility pass keepers — prefers-reduced-motion (core + games + JS)
 * and WCAG 2.1 AA contrast tokens for UI text/controls.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readAppCss } from './_app-css';
import { getHighlightStyles } from '../../src/core/alignment/highlight-ui';
import { getDiceStyles, animateRoll } from '../../src/core/dice/dice-ui';
import {
  durationMsForMotion,
  prefersReducedMotion,
} from '../../src/ui/reduced-motion';
import type { RollResult } from '../../src/core/dice/types';

const styleCss = readAppCss();
const starsCss = readFileSync(
  resolve(process.cwd(), 'src/games/stars-bars/board-ui.ts'),
  'utf8'
);
const kwaCss = readFileSync(
  resolve(process.cwd(), 'src/games/kwatro-sinko/board-ui.ts'),
  'utf8'
);
const polyCss = readFileSync(
  resolve(process.cwd(), 'src/core/polyomino/polyomino-ui.ts'),
  'utf8'
);
const hexUiCss = readFileSync(
  resolve(process.cwd(), 'src/core/hex/hex-ui.ts'),
  'utf8'
);
const graphCss = readFileSync(
  resolve(process.cwd(), 'src/core/graph/graph-ui.ts'),
  'utf8'
);
const attrCss = readFileSync(
  resolve(process.cwd(), 'src/core/attributes/attribute-ui.ts'),
  'utf8'
);
const fiar3d = readFileSync(
  resolve(process.cwd(), 'src/ui/three/fiar-board-3d.ts'),
  'utf8'
);

describe('durationMsForMotion', () => {
  it('returns reduced duration when OS prefers reduce', () => {
    expect(
      durationMsForMotion(1000, 0, {
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: true,
      })
    ).toBe(0);
  });

  it('returns full duration when motion is allowed', () => {
    expect(
      durationMsForMotion(1000, 0, {
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
    ).toBe(1000);
  });
});

describe('Core + game CSS honors prefers-reduced-motion', () => {
  it('alignment / dice / polyomino / hex / graph / attributes disable decorative motion', () => {
    const highlight = getHighlightStyles();
    expect(highlight).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(highlight).toMatch(/\.highlight-winning/);
    expect(highlight).toContain("html[data-reduced-motion='true']");

    const dice = getDiceStyles();
    expect(dice).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(dice).toMatch(/\.die-wrapper\.rolling/);

    for (const src of [polyCss, hexUiCss, graphCss, attrCss]) {
      expect(src).toMatch(/prefers-reduced-motion:\s*reduce/);
      expect(src).toContain("html[data-reduced-motion='true']");
    }
  });

  it('Stars & Bars + Kwatro winner banners skip glow under reduced motion', () => {
    expect(starsCss).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(starsCss).toMatch(/\.stars-winner-banner/);
    expect(kwaCss).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(kwaCss).toMatch(/\.kwa-winner-banner/);
  });

  it('shell menu mirrors reduced-motion onto html[data-reduced-motion]', () => {
    expect(styleCss).toContain(
      "html[data-reduced-motion='true'] .accordion-panel"
    );
    expect(styleCss).toContain("html[data-reduced-motion='true'] .game-card");
  });

  it('3D boards consult prefersReducedMotion before piece scale emphasis', () => {
    expect(fiar3d).toContain('prefersReducedMotion');
    expect(fiar3d).toMatch(/emphasize/);
  });
});

describe('animateRoll skips tumble when reduced motion', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('renders final faces immediately under prefers-reduced-motion', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
      })
    );

    const host = document.createElement('div');
    document.body.appendChild(host);
    const result: RollResult = {
      id: 'roll-test',
      rolls: [
        {
          id: 'd1',
          diceType: 'd6',
          value: 4,
          isSelected: false,
          isLocked: false,
          timestamp: 0,
        },
      ],
      total: 4,
    };

    let complete = false;
    animateRoll(host, result, {
      duration: 1000,
      onComplete: () => {
        complete = true;
      },
    });

    expect(complete).toBe(true);
    expect(host.querySelector('.die-wrapper.rolling')).toBeNull();
    expect(host.querySelector('.total-value')?.textContent).toBe('4');
  });
});

describe('WCAG AA contrast keepers (UI text / controls)', () => {
  it('menu muted text uses AA slate (not #94a3b8)', () => {
    expect(styleCss).toMatch(
      /\.game-card-division\s*\{[^}]*color:\s*#475569/s
    );
    expect(styleCss).toMatch(/\.footer-note\s*\{[^}]*color:\s*#475569/s);
  });

  it('difficulty selected fills meet white-on-fill AA', () => {
    expect(styleCss).toMatch(
      /\.difficulty-btn\.easy\.selected\s*\{[^}]*background:\s*#15803d/s
    );
    expect(styleCss).toMatch(
      /\.difficulty-btn\.hard\.selected\s*\{[^}]*background:\s*#c62828/s
    );
    expect(styleCss).toMatch(
      /\.difficulty-btn\.medium\.selected\s*\{[^}]*color:\s*#1a1a2e/s
    );
  });

  it('AI thinking status uses system-dark for AA text', () => {
    expect(styleCss).toMatch(
      /\.status-ai-thinking\s*\{[^}]*color:\s*var\(--color-system-dark\)/s
    );
  });

  it('prefersReducedMotion helper stays wired for tests', () => {
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(true);
  });
});
