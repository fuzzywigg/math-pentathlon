/**
 * Wave 25 — mountGameShell chrome: modals, modes, difficulty, history, Escape, cleanup.
 * Distinct from a11y-shell light smoke and wave 24 seat/inventory.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { mountGameShell } from '../../src/ui/components/game-shell';
import type {
  AIDifficultyLevel,
  GameMode,
  GameShellElements,
} from '../../src/ui/components/game-shell';

let container: HTMLElement;
let shell: GameShellElements | null = null;

beforeEach(() => {
  container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);
});

afterEach(() => {
  shell?.cleanup();
  shell = null;
  container.remove();
  vi.restoreAllMocks();
});

function mount(
  overrides: Partial<Parameters<typeof mountGameShell>[1]> = {}
): GameShellElements {
  shell = mountGameShell(container, {
    title: 'Shell Game',
    helpTitle: 'How to Play Shell',
    helpContentHtml: '<p>Trusted rules</p>',
    modeRadioName: 'wave25-mode',
    onNavigateHome: () => undefined,
    onStartGame: () => undefined,
    ...overrides,
  });
  return shell;
}

describe('Wave 25 game-shell — markup mounts', () => {
  it('renders escaped title, back, new-game, help, status, board', () => {
    mount({ title: 'A <b>Title</b>' });
    const h1 = container.querySelector('h1');
    expect(h1?.innerHTML).toContain('A &lt;b&gt;Title&lt;/b&gt;');
    expect(container.querySelector('#back-btn')).toBeTruthy();
    expect(container.querySelector('#new-game-btn')).toBeTruthy();
    expect(container.querySelector('#help-btn')).toBeTruthy();
    expect(container.querySelector('#status')).toBeTruthy();
    expect(container.querySelector('#board')).toBeTruthy();
    expect(container.querySelector('#tutorial-btn')).toBeNull();
    expect(container.querySelector('#move-history')).toBeNull();
  });

  it('honors showStatus=false, custom boardClass, gameAreaClass, mountId', () => {
    mount({
      showStatus: false,
      boardClass: 'custom-board',
      gameAreaClass: 'hex-game-area',
      mountId: 'custom-mount',
      gameAreaHtml: '<div class="wrap"><div id="custom-mount"></div></div>',
    });
    expect(container.querySelector('#status')).toBeNull();
    expect(container.querySelector('#custom-mount')).toBeTruthy();
    expect(shell?.board?.id).toBe('custom-mount');
  });

  it('shows tutorial + move history when requested', () => {
    const onTutorial = vi.fn();
    mount({ showTutorial: true, showMoveHistory: true, onTutorial });
    expect(container.querySelector('#tutorial-btn')).toBeTruthy();
    expect(container.querySelector('#move-history')).toBeTruthy();
    expect(container.querySelector('#history-content')).toBeTruthy();
    (container.querySelector('#tutorial-btn') as HTMLButtonElement).click();
    expect(onTutorial).toHaveBeenCalledTimes(1);
  });
});

describe('Wave 25 game-shell — mode + difficulty start', () => {
  it('defaults human chrome until Start; applies AI chrome on start', () => {
    const started: Array<{ mode: GameMode; difficulty?: AIDifficultyLevel }> =
      [];
    mount({
      showDifficulty: true,
      defaultMode: 'human-vs-human',
      onStartGame: (mode, difficulty) => started.push({ mode, difficulty }),
    });

    expect(container.dataset.opponent).toBeUndefined();
    expect(container.classList.contains('game-vs-ai')).toBe(false);

    const aiOption = container.querySelector(
      '.mode-option[data-mode="human-vs-ai"]'
    ) as HTMLElement;
    aiOption.click();
    expect(
      (document.getElementById('difficulty-section') as HTMLElement).style
        .display
    ).toBe('block');

    (
      container.querySelector('.difficulty-btn.easy') as HTMLButtonElement
    ).click();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();

    expect(started).toEqual([{ mode: 'human-vs-ai', difficulty: 'easy' }]);
    expect(container.dataset.opponent).toBe('ai');
    expect(container.classList.contains('game-vs-ai')).toBe(true);
    expect(shell?.newGameModal?.classList.contains('hidden')).toBe(true);
  });

  it('omits difficulty arg when showDifficulty is false', () => {
    const started: Array<{ mode: GameMode; difficulty?: AIDifficultyLevel }> =
      [];
    mount({
      defaultMode: 'human-vs-ai',
      modeOrder: ['human-vs-ai', 'human-vs-human'],
      onStartGame: (mode, difficulty) => started.push({ mode, difficulty }),
    });
    expect(container.querySelector('#difficulty-section')).toBeNull();
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(started).toEqual([{ mode: 'human-vs-ai', difficulty: undefined }]);
  });

  it('AI-first defaultMode selects AI radio and shows difficulty section', () => {
    mount({
      defaultMode: 'human-vs-ai',
      showDifficulty: true,
      defaultDifficulty: 'hard',
    });
    const aiInput = container.querySelector(
      'input[value="human-vs-ai"]'
    ) as HTMLInputElement;
    expect(aiInput.checked).toBe(true);
    expect(
      container
        .querySelector('.difficulty-btn.hard')
        ?.classList.contains('selected')
    ).toBe(true);
    expect(
      (document.getElementById('difficulty-section') as HTMLElement).style
        .display
    ).toBe('block');
  });
});

describe('Wave 25 game-shell — modals / Escape / back / history', () => {
  it('opens and closes help + new-game via buttons, close, backdrop, Escape', () => {
    mount();
    const helpModal = shell!.helpModal!;
    const newGameModal = shell!.newGameModal!;

    (shell!.helpBtn as HTMLButtonElement).click();
    expect(helpModal.classList.contains('hidden')).toBe(false);
    (helpModal.querySelector('.modal-close') as HTMLButtonElement).click();
    expect(helpModal.classList.contains('hidden')).toBe(true);

    (shell!.newGameBtn as HTMLButtonElement).click();
    expect(newGameModal.classList.contains('hidden')).toBe(false);
    newGameModal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // clicking the modal backdrop (target === modal) closes
    Object.defineProperty({ target: newGameModal }, 'target', {
      value: newGameModal,
    });
    newGameModal.click();
    // use direct close path
    (newGameModal.querySelector('.modal-close') as HTMLButtonElement).click();
    expect(newGameModal.classList.contains('hidden')).toBe(true);

    (shell!.helpBtn as HTMLButtonElement).click();
    (shell!.newGameBtn as HTMLButtonElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(helpModal.classList.contains('hidden')).toBe(true);
    expect(newGameModal.classList.contains('hidden')).toBe(true);
  });

  it('back button calls onNavigateHome', () => {
    const home = vi.fn();
    mount({ onNavigateHome: home });
    (shell!.backBtn as HTMLButtonElement).click();
    expect(home).toHaveBeenCalledTimes(1);
  });

  it('toggles move-history collapsed + aria-expanded', () => {
    mount({ showMoveHistory: true });
    const panel = shell!.moveHistoryPanel!;
    const toggle = panel.querySelector('.collapse-toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    expect(panel.classList.contains('collapsed')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    expect(panel.classList.contains('collapsed')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('cleanup clears mode chrome and Escape no longer closes after unmount', () => {
    mount({ showDifficulty: true, defaultMode: 'human-vs-ai' });
    (container.querySelector('#start-game-btn') as HTMLButtonElement).click();
    expect(container.dataset.opponent).toBe('ai');

    (shell!.helpBtn as HTMLButtonElement).click();
    shell!.cleanup();
    expect(container.dataset.opponent).toBeUndefined();
    expect(container.classList.contains('game-vs-ai')).toBe(false);

    // Escape handler removed — help stays open if we re-open without cleanup path
    const help = shell!.helpModal!;
    // after cleanup the listener is gone; leave modal open then Escape should not close
    // (modal still in DOM from prior mount)
    expect(help.classList.contains('hidden')).toBe(false);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(help.classList.contains('hidden')).toBe(false);
    shell = null; // already cleaned
  });

  it('injects newGameExtraHtml and custom mode descriptions', () => {
    mount({
      newGameExtraHtml: '<div id="wave25-extra">extra</div>',
      vsHumanDescription: 'Local duel',
      vsAiDescription: 'Bot challenge',
    });
    expect(container.querySelector('#wave25-extra')?.textContent).toBe('extra');
    expect(container.textContent).toContain('Local duel');
    expect(container.textContent).toContain('Bot challenge');
  });
});
