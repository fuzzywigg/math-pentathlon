/**
 * Shared shell/menu a11y keepers — focus-visible, reduced-motion, landmarks.
 * Does not touch src/games/* boards. Complements a11y-shell.test.ts.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { readAppCss } from './_app-css';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderGameSelector } from '../../src/ui/game-selector';
import { mountGameShell } from '../../src/ui/components/game-shell';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

const styleCss = readAppCss();
const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

describe('Shell/menu a11y keepers — skip-link + document landmarks', () => {
  it('keeps skip-link → main#main-content in index.html', () => {
    expect(indexHtml).toMatch(
      /<a class="skip-link" href="#main-content">Skip to main content<\/a>/
    );
    expect(indexHtml).toMatch(/<main id="main-content" tabindex="-1">/);
  });

  it('honors prefers-reduced-motion for document scroll-behavior', () => {
    expect(styleCss).toMatch(
      /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{[^}]*html\s*\{[^}]*scroll-behavior:\s*auto/s
    );
  });
});

describe('Shell/menu a11y keepers — focus-visible on primary nav/menu', () => {
  it('declares :focus-visible for division tabs and accordion headers', () => {
    expect(styleCss).toMatch(/\.division-tab:focus-visible\s*\{/);
    expect(styleCss).toMatch(/\.accordion-header:focus-visible\s*\{/);
  });

  it('declares :focus-visible for game cards (menu tiles)', () => {
    expect(styleCss).toMatch(/\.game-card:focus-visible\s*\{/);
  });

  it('declares :focus-visible / :focus-within for shell chrome controls', () => {
    expect(styleCss).toMatch(/\.button-row button:focus-visible/);
    expect(styleCss).toMatch(/\.back-button:focus-visible/);
    expect(styleCss).toMatch(/\.mode-option:focus-within\s*\{/);
    expect(styleCss).toMatch(/\.difficulty-btn:focus-visible\s*\{/);
    expect(styleCss).toMatch(/\.start-game-btn:focus-visible\s*\{/);
    expect(styleCss).toMatch(/\.modal-close:focus-visible\s*\{/);
    expect(styleCss).toMatch(/\.collapse-toggle:focus-visible\s*\{/);
  });

  it('declares board/in-game :focus-visible rings for gridcells and role=button', () => {
    expect(styleCss).toMatch(/\[role=['"]gridcell['"]\]:focus-visible/);
    expect(styleCss).toMatch(/#board \[role=['"]button['"]\]:focus-visible/);
    expect(styleCss).toMatch(/svg \[role=['"]gridcell['"]\]:focus-visible/);
  });
});

describe('Shell/menu a11y keepers — reduced motion for menu chrome', () => {
  it('disables accordion / tab / card motion under prefers-reduced-motion', () => {
    // Prefer a stable co-located block near menu styles (not EOF game animations).
    const menuMotionIdx = styleCss.indexOf(
      '/* Shell / menu reduced motion — accordion + tab/card chrome only.'
    );
    expect(menuMotionIdx).toBeGreaterThan(-1);
    const block = styleCss.slice(menuMotionIdx, menuMotionIdx + 900);
    expect(block).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(block).toMatch(/\.accordion-panel/);
    expect(block).toMatch(/\.division-tab:hover/);
    expect(block).toMatch(/\.game-card:hover/);
    expect(block).toMatch(/transform:\s*none/);
    expect(block).toMatch(/transition:\s*none/);
  });
});

describe('Shell/menu a11y keepers — landmark + heading sanity', () => {
  let container: HTMLElement | null = null;

  afterEach(() => {
    container?.remove();
    container = null;
  });

  it('game selector exposes header, labeled nav, footer, and one h1', () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    renderGameSelector(container);

    expect(container.querySelector('header.game-selector-hero')).toBeTruthy();
    const nav = container.querySelector('nav.division-tabs');
    expect(nav?.getAttribute('aria-label')).toBe('Division navigation');
    expect(container.querySelector('footer.game-selector-footer')).toBeTruthy();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe('Math Pentathlon');
  });

  it('game shell exposes header h1 and labeled actions nav', () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mountGameShell(container, {
      title: 'Hex',
      helpTitle: 'How to Play',
      helpContentHtml: '<p>Rules</p>',
      modeRadioName: 'a11y-shell-keepers',
      showMoveHistory: true,
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    expect(container.querySelector('header.game-header h1')?.textContent).toBe(
      'Hex'
    );
    const actions = container.querySelector('nav.button-row');
    expect(actions?.getAttribute('aria-label')).toBe('Game actions');
    expect(container.querySelector('#new-game-btn')).toBeTruthy();
    expect(container.querySelector('#help-btn')).toBeTruthy();
    expect(
      container.querySelector('.collapse-toggle')?.getAttribute('aria-expanded')
    ).toBe('true');
  });
});
