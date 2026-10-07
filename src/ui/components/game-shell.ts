/**
 * Shared game chrome shell — header, button row, status, area, modals.
 * Keeps page-to-page cohesion without changing game logic.
 */

import { applyGameModeChrome, clearGameModeChrome } from '../player-colors';

export type GameMode = 'human-vs-human' | 'human-vs-ai';
export type AIDifficultyLevel = 'easy' | 'medium' | 'hard';

export interface GameShellOptions {
  title: string;
  helpTitle: string;
  /** Inner HTML for `.rules-content` (trusted static copy from this repo). */
  helpContentHtml: string;
  /** Wrapper class around `#board` (e.g. `hex-game-area`). Default: `game-area`. */
  gameAreaClass?: string;
  /** Extra class(es) on `#board`. */
  boardClass?: string;
  /**
   * Replace the default game-area markup entirely.
   * Must include an element with id === mountId (default `board`).
   */
  gameAreaHtml?: string;
  /** Primary mount element id. Default: `board`. */
  mountId?: string;
  showTutorial?: boolean;
  showMoveHistory?: boolean;
  /** Include empty `#status` mount. Default true. */
  showStatus?: boolean;
  /** Unique radio `name` for this game's mode inputs. */
  modeRadioName: string;
  defaultMode?: GameMode;
  /** UI order of mode options. Defaults to human-first unless defaultMode is AI. */
  modeOrder?: GameMode[];
  vsHumanDescription?: string;
  vsAiDescription?: string;
  /** Kings-style difficulty picker (only when vs AI). */
  showDifficulty?: boolean;
  defaultDifficulty?: AIDifficultyLevel;
  /** Extra HTML inside `.mode-selector` before the Start button. */
  newGameExtraHtml?: string;
  onNavigateHome: () => void;
  onStartGame: (mode: GameMode, difficulty?: AIDifficultyLevel) => void;
  onTutorial?: () => void;
}

export interface GameShellElements {
  /** Primary mount (`#board` or custom mountId). */
  board: HTMLElement | null;
  status: HTMLElement | null;
  historyContent: HTMLElement | null;
  moveHistoryPanel: HTMLElement | null;
  newGameBtn: HTMLElement | null;
  tutorialBtn: HTMLElement | null;
  helpBtn: HTMLElement | null;
  helpModal: HTMLElement | null;
  newGameModal: HTMLElement | null;
  backBtn: HTMLElement | null;
  cleanup: () => void;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** True when the element is not inside a hidden/inert/display:none ancestor. */
export function isKeyboardReachable(el: Element): boolean {
  let node: Element | null = el;
  while (node && node !== document.documentElement) {
    if (node instanceof HTMLElement) {
      if (node.hasAttribute('hidden') || node.hasAttribute('inert')) {
        return false;
      }
      if (node.classList.contains('hidden')) return false;
      const { display, visibility } = node.style;
      if (display === 'none' || visibility === 'hidden') return false;
    }
    node = node.parentElement;
  }
  return true;
}

/** True when the element (and ancestors up to `root`) are not display:none / hidden / inert. */
function isDisplayedWithin(el: HTMLElement, root: HTMLElement): boolean {
  let cur: HTMLElement | null = el;
  while (cur && cur !== root) {
    if (
      cur.classList.contains('hidden') ||
      cur.hasAttribute('hidden') ||
      cur.hasAttribute('inert')
    ) {
      return false;
    }
    if (cur.style.display === 'none') return false;
    cur = cur.parentElement;
  }
  return true;
}

/** Focusable controls inside a dialog (skips hidden difficulty section, inert, etc.). */
export function getFocusableWithin(root: Element): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((el) => {
    if (el.getAttribute('aria-disabled') === 'true') return false;
    return isKeyboardReachable(el);
  });
}

/** Focusable controls inside an open modal (jsdom-safe; skips nested hidden). */
function getModalFocusables(modal: HTMLElement): HTMLElement[] {
  return getFocusableWithin(modal).filter((el) =>
    isDisplayedWithin(el, modal)
  );
}

function ensureModalDialogSemantics(modal: HTMLElement): void {
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  const title = modal.querySelector('h2');
  if (title) {
    if (!title.id) {
      title.id = `${modal.id || 'game-modal'}-title`;
    }
    modal.setAttribute('aria-labelledby', title.id);
  }
}

type ModalFocusState = {
  restoreEl: HTMLElement | null;
};

function openShellModal(
  modal: HTMLElement,
  state: ModalFocusState,
  opener: HTMLElement | null
): void {
  ensureModalDialogSemantics(modal);
  state.restoreEl =
    opener ??
    (document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null);
  modal.classList.remove('hidden');
  const focusables = getModalFocusables(modal);
  // Prefer primary action when present; otherwise first control (often Close).
  const startBtn = modal.querySelector<HTMLElement>('#start-game-btn');
  const target =
    (startBtn && isDisplayedWithin(startBtn, modal) ? startBtn : null) ??
    focusables[0] ??
    modal;
  if (target === modal && !modal.hasAttribute('tabindex')) {
    modal.setAttribute('tabindex', '-1');
  }
  target.focus();
}

function closeShellModal(modal: HTMLElement, state: ModalFocusState): void {
  if (modal.classList.contains('hidden')) return;
  modal.classList.add('hidden');
  const restore = state.restoreEl;
  state.restoreEl = null;
  // Defer so display:none on the modal settles before moving focus (#491).
  queueMicrotask(() => {
    if (restore && document.contains(restore)) {
      restore.focus();
    }
  });
}

/** Keep Tab cycling inside an open dialog (#491 API; used by unit tests). */
export function trapTabKey(modal: HTMLElement, e: KeyboardEvent): void {
  if (e.key !== 'Tab') return;
  const items = getFocusableWithin(modal);
  if (items.length === 0) return;

  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;

  if (e.shiftKey) {
    if (active === first || !modal.contains(active)) {
      e.preventDefault();
      last.focus();
    }
  } else if (active === last || !modal.contains(active)) {
    e.preventDefault();
    first.focus();
  }
}

/** Keep Tab / Shift+Tab inside an open modal (focus trap). */
function trapModalTabKey(e: KeyboardEvent, modal: HTMLElement): void {
  if (e.key !== 'Tab' || modal.classList.contains('hidden')) return;
  const focusables = getModalFocusables(modal);
  if (focusables.length === 0) {
    e.preventDefault();
    modal.focus();
    return;
  }
  trapTabKey(modal, e);
}

function buildModeOption(
  mode: GameMode,
  radioName: string,
  selected: boolean,
  vsHumanDescription: string,
  vsAiDescription: string
): string {
  const isAi = mode === 'human-vs-ai';
  const title = isAi ? 'Play vs AI' : '2 Player';
  const desc = isAi ? vsAiDescription : vsHumanDescription;
  const selectedClass = selected ? ' selected' : '';
  const checked = selected ? ' checked' : '';
  return `
            <label class="mode-option${selectedClass}" data-mode="${mode}">
              <input type="radio" name="${escapeAttr(radioName)}" value="${mode}"${checked}>
              <div class="mode-option-content">
                <div class="mode-option-title">${title}</div>
                <div class="mode-option-desc">${escapeAttr(desc)}</div>
              </div>
            </label>`;
}

function buildDifficultySection(defaultDifficulty: AIDifficultyLevel): string {
  const levels: AIDifficultyLevel[] = ['easy', 'medium', 'hard'];
  const buttons = levels
    .map((level) => {
      const selected = level === defaultDifficulty ? ' selected' : '';
      const label = level.charAt(0).toUpperCase() + level.slice(1);
      return `<button class="difficulty-btn ${level}${selected}" data-difficulty="${level}">${label}</button>`;
    })
    .join('');

  return `
          <div id="difficulty-section" class="difficulty-selector">
            <h4>AI Difficulty</h4>
            <div class="difficulty-options">
              ${buttons}
            </div>
          </div>`;
}

function buildShellHtml(options: GameShellOptions): string {
  const gameAreaClass = options.gameAreaClass ?? 'game-area';
  const boardClassAttr = options.boardClass
    ? ` class="${escapeAttr(options.boardClass)}"`
    : '';
  const defaultMode = options.defaultMode ?? 'human-vs-human';
  const modeOrder =
    options.modeOrder ??
    (defaultMode === 'human-vs-ai'
      ? (['human-vs-ai', 'human-vs-human'] as GameMode[])
      : (['human-vs-human', 'human-vs-ai'] as GameMode[]));
  const vsHumanDescription =
    options.vsHumanDescription ?? 'Pass & play with a friend';
  const vsAiDescription = options.vsAiDescription ?? 'Challenge the computer';
  const showDifficulty = options.showDifficulty === true;
  const defaultDifficulty = options.defaultDifficulty ?? 'medium';

  const tutorialBtn = options.showTutorial
    ? '\n      <button id="tutorial-btn" type="button">Tutorial</button>'
    : '';

  const statusBlock =
    options.showStatus === false ? '' : '\n    <div id="status"></div>';

  const moveHistory = options.showMoveHistory
    ? `
      <div id="move-history" class="move-history collapsible">
        <button class="collapse-toggle" type="button" aria-expanded="true" aria-controls="history-content">
          <span class="collapse-icon">◀</span>
          <span class="collapse-label">History</span>
        </button>
        <div id="history-content" class="history-content"></div>
      </div>`
    : '';

  const modeOptionsHtml = modeOrder
    .map((mode) =>
      buildModeOption(
        mode,
        options.modeRadioName,
        mode === defaultMode,
        vsHumanDescription,
        vsAiDescription
      )
    )
    .join('');

  const difficultyHtml = showDifficulty
    ? buildDifficultySection(defaultDifficulty)
    : '';
  const extraHtml = options.newGameExtraHtml ?? '';

  const gameAreaBlock =
    options.gameAreaHtml ??
    `<div class="${escapeAttr(gameAreaClass)}">${moveHistory}
      <div id="board"${boardClassAttr}></div>
    </div>`;

  return `
    <header class="game-header">
      <button id="back-btn" class="back-button" type="button" aria-label="Back to game list">← Games</button>
      <h1>${escapeAttr(options.title)}</h1>
    </header>
    <nav class="button-row" aria-label="Game actions">
      <button id="new-game-btn" type="button">New Game</button>${tutorialBtn}
      <button id="help-btn" type="button">How to Play</button>
    </nav>${statusBlock}
    ${gameAreaBlock}
    <div id="new-game-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="new-game-modal-title">
      <div class="modal-content">
        <button class="modal-close" type="button" aria-label="Close">&times;</button>
        <h2 id="new-game-modal-title">New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
${modeOptionsHtml}
          </div>${difficultyHtml}${extraHtml}
          <button id="start-game-btn" class="start-game-btn" type="button">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
      <div class="modal-content">
        <button class="modal-close" type="button" aria-label="Close">&times;</button>
        <h2 id="help-modal-title">${escapeAttr(options.helpTitle)}</h2>
        <div class="rules-content">
          ${options.helpContentHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * Mount shared game chrome into `container` and wire common interactions.
 * Game-specific init stays in the caller.
 */
export function mountGameShell(
  container: HTMLElement,
  options: GameShellOptions
): GameShellElements {
  container.innerHTML = buildShellHtml(options);

  const mountId = options.mountId ?? 'board';
  const board = document.getElementById(mountId);
  const status = document.getElementById('status');
  const historyContent = document.getElementById('history-content');
  const moveHistoryPanel = document.getElementById('move-history');
  const newGameBtn = document.getElementById('new-game-btn');
  const tutorialBtn = document.getElementById('tutorial-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  let selectedMode: GameMode = options.defaultMode ?? 'human-vs-human';
  let selectedDifficulty: AIDifficultyLevel =
    options.defaultDifficulty ?? 'medium';

  // Mode chrome for CSS / board-ui branching (vs-AI purple vs 2P red/blue).
  // defaultMode only selects the modal radio — games init as human until Start.
  applyGameModeChrome(container, 'human-vs-human');

  // Move-history collapse
  const collapseToggle = moveHistoryPanel?.querySelector('.collapse-toggle');
  if (collapseToggle && moveHistoryPanel) {
    collapseToggle.addEventListener('click', () => {
      const isCollapsed = moveHistoryPanel.classList.toggle('collapsed');
      collapseToggle.setAttribute('aria-expanded', String(!isCollapsed));
    });
  }

  const newGameFocus: ModalFocusState = { restoreEl: null };
  const helpFocus: ModalFocusState = { restoreEl: null };

  // Pre-declare dialog semantics so closed modals still expose roles to AT trees.
  // Markup also ships role/aria from #437; ensureModalDialogSemantics is idempotent.
  if (newGameModal) ensureModalDialogSemantics(newGameModal);
  if (helpModal) ensureModalDialogSemantics(helpModal);

  // New Game open — focus trap + restore (#448)
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      openShellModal(newGameModal, newGameFocus, newGameBtn);
    });
  }

  // New Game modal wiring
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const difficultySection = document.getElementById('difficulty-section');
    const difficultyBtns = newGameModal.querySelectorAll('.difficulty-btn');
    const startGameBtn = document.getElementById('start-game-btn');

    // Sync selected class from checked radios (defensive)
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement | null;
      if (input?.checked) {
        option.classList.add('selected');
        selectedMode = input.value as GameMode;
      }
    });

    if (difficultySection) {
      difficultySection.style.display =
        selectedMode === 'human-vs-ai' ? 'block' : 'none';
    }

    const closeNewGameModal = () => {
      closeShellModal(newGameModal, newGameFocus);
    };

    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as GameMode;
        if (difficultySection) {
          difficultySection.style.display =
            selectedMode === 'human-vs-ai' ? 'block' : 'none';
        }
      });
    });

    difficultyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        difficultyBtns.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedDifficulty = (btn as HTMLElement).dataset
          .difficulty as AIDifficultyLevel;
      });
    });

    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      applyGameModeChrome(container, selectedMode);
      options.onStartGame(
        selectedMode,
        options.showDifficulty ? selectedDifficulty : undefined
      );
    });

    modalClose?.addEventListener('click', closeNewGameModal);
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Tutorial
  if (tutorialBtn && options.onTutorial) {
    tutorialBtn.addEventListener('click', () => {
      options.onTutorial?.();
    });
  }

  // Back
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      options.onNavigateHome();
    });
  }

  // Tab trap (#448) + Escape closes every open shell dialog (#437)
  const keydownHandler = (e: KeyboardEvent) => {
    if (helpModal && !helpModal.classList.contains('hidden')) {
      trapModalTabKey(e, helpModal);
    } else if (newGameModal && !newGameModal.classList.contains('hidden')) {
      trapModalTabKey(e, newGameModal);
    }

    if (e.key !== 'Escape') return;
    const helpWasOpen = !!helpModal && !helpModal.classList.contains('hidden');
    const newGameWasOpen =
      !!newGameModal && !newGameModal.classList.contains('hidden');
    if (!helpWasOpen && !newGameWasOpen) return;
    // Hide without per-modal focus restore; pick one opener below (#437).
    if (helpWasOpen) {
      helpModal!.classList.add('hidden');
      helpFocus.restoreEl = null;
    }
    if (newGameWasOpen) {
      newGameModal!.classList.add('hidden');
      newGameFocus.restoreEl = null;
    }
    if (helpWasOpen) {
      helpBtn?.focus();
    } else {
      newGameBtn?.focus();
    }
  };

  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');
    const openHelpModal = () => openShellModal(helpModal, helpFocus, helpBtn);
    const closeHelpModal = () => closeShellModal(helpModal, helpFocus);

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });
  }

  document.addEventListener('keydown', keydownHandler);

  const cleanup = () => {
    document.removeEventListener('keydown', keydownHandler);
    clearGameModeChrome(container);
  };

  return {
    board,
    status,
    historyContent,
    moveHistoryPanel,
    newGameBtn,
    tutorialBtn,
    helpBtn,
    helpModal,
    newGameModal,
    backBtn,
    cleanup,
  };
}
