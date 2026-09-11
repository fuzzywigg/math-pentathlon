import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mountGameShell } from '../../src/ui/components/game-shell';

describe('Cycle-3 a11y shell (light)', () => {
  let container: HTMLElement | null = null;

  afterEach(() => {
    container?.remove();
    container = null;
  });

  it('index.html has skip link targeting main#main-content', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).toMatch(/lang="en"/);
    expect(html).toMatch(
      /<a class="skip-link" href="#main-content">Skip to main content<\/a>/
    );
    expect(html).toMatch(/<main id="main-content" tabindex="-1">/);
    expect(html).toMatch(/<div id="app"><\/div>/);
  });

  it('game shell modal-close buttons are labeled for assistive tech', () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mountGameShell(container, {
      title: 'Test Game',
      helpTitle: 'How to Play',
      helpContentHtml: '<p>Rules</p>',
      modeRadioName: 'test-mode',
      onNavigateHome: () => undefined,
      onStartGame: () => undefined,
    });

    const closes = container.querySelectorAll('.modal-close');
    expect(closes.length).toBe(2);
    closes.forEach((btn) => {
      expect(btn.getAttribute('aria-label')).toBe('Close');
      expect(btn.getAttribute('type')).toBe('button');
    });
  });

  it('showDifficulty renders Easy/Medium/Hard and passes selection on vs-AI start', () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    let startedMode: string | undefined;
    let startedDifficulty: string | undefined;

    mountGameShell(container, {
      title: 'Test Game',
      helpTitle: 'How to Play',
      helpContentHtml: '<p>Rules</p>',
      modeRadioName: 'test-mode-diff',
      defaultMode: 'human-vs-ai',
      showDifficulty: true,
      onNavigateHome: () => undefined,
      onStartGame: (mode, difficulty) => {
        startedMode = mode;
        startedDifficulty = difficulty;
      },
    });

    const difficultySection = container.querySelector('#difficulty-section');
    expect(difficultySection).toBeTruthy();
    expect(difficultySection?.querySelectorAll('.difficulty-btn').length).toBe(
      3
    );

    const hardBtn = container.querySelector(
      '.difficulty-btn.hard'
    ) as HTMLButtonElement;
    hardBtn.click();

    const startBtn = container.querySelector(
      '#start-game-btn'
    ) as HTMLButtonElement;
    startBtn.click();

    expect(startedMode).toBe('human-vs-ai');
    expect(startedDifficulty).toBe('hard');
  });
});
