/**
 * STUB inspect narration map — Cycle-2 B drop-inspect.
 *
 * This is NOT MESSAGE_LIBRARY (`owl-messages.ts`). Soft-tutor copy for kids who
 * drop Ollie onto UI (reader-book + stylus). Replace later with real curriculum
 * lines; keep ids/kinds stable where practical.
 */

export type InspectChrome =
  | 'game-header'
  | 'button-row'
  | 'howto'
  | 'tutorial'
  | 'new-game'
  | 'back'
  | 'unknown-chrome';

export type InspectTarget =
  | { kind: 'kings-cell'; row: number; col: number }
  | { kind: 'hex-cell'; row: number; col: number }
  | { kind: 'fiar-node'; nodeId: string }
  | { kind: 'hex-a-gone-cell'; q: number; r: number }
  | { kind: 'hex-a-gone-bank'; shape: string }
  | { kind: 'star-space'; space: number; player: string }
  | { kind: 'star-piece'; player: string }
  | { kind: 'chrome'; chrome: InspectChrome }
  | { kind: 'unknown' };

/** Walk from the hit element up the DOM for known game / chrome attrs. */
export function resolveInspectTarget(el: Element | null): InspectTarget {
  if (!el) return { kind: 'unknown' };

  // Hex-a-Gone bank shape (button) before generic cells
  const bankBtn = el.closest('[data-shape]');
  if (bankBtn instanceof Element) {
    const shape = bankBtn.getAttribute('data-shape');
    if (shape) return { kind: 'hex-a-gone-bank', shape };
  }

  // Hex-a-Gone board cell (axial)
  const hagCell = el.closest('[data-q][data-r]');
  if (hagCell instanceof Element) {
    const q = Number(hagCell.getAttribute('data-q'));
    const r = Number(hagCell.getAttribute('data-r'));
    if (Number.isFinite(q) && Number.isFinite(r)) {
      return { kind: 'hex-a-gone-cell', q, r };
    }
  }

  // Star Track piece
  const starPiece = el.closest('.star-track-piece[data-player]');
  if (starPiece instanceof Element) {
    const player = starPiece.getAttribute('data-player') || 'unknown';
    return { kind: 'star-piece', player };
  }

  // Star Track space
  const starSpace = el.closest('.star-track-space[data-space]');
  if (starSpace instanceof Element) {
    const space = Number(starSpace.getAttribute('data-space'));
    const player = starSpace.getAttribute('data-player') || 'unknown';
    if (Number.isFinite(space)) {
      return { kind: 'star-space', space, player };
    }
  }

  // FIAR node
  const fiarNode = el.closest('[data-node-id]');
  if (fiarNode instanceof Element) {
    const nodeId = fiarNode.getAttribute('data-node-id');
    if (nodeId) return { kind: 'fiar-node', nodeId };
  }

  // Hex board cell (SVG group) — before Kings .cell so attrs don't collide wrongly
  const hexCell = el.closest('.hex-cell-group[data-row][data-col]');
  if (hexCell instanceof Element) {
    const row = Number(hexCell.getAttribute('data-row'));
    const col = Number(hexCell.getAttribute('data-col'));
    if (Number.isFinite(row) && Number.isFinite(col)) {
      return { kind: 'hex-cell', row, col };
    }
  }

  // Kings & Quadraphages cell
  const kingsCell = el.closest('.cell[data-row][data-col]');
  if (kingsCell instanceof Element) {
    const row = Number(kingsCell.getAttribute('data-row'));
    const col = Number(kingsCell.getAttribute('data-col'));
    if (Number.isFinite(row) && Number.isFinite(col)) {
      return { kind: 'kings-cell', row, col };
    }
  }

  // Known chrome controls (ids used across game shells)
  if (el.closest('#help-btn')) return { kind: 'chrome', chrome: 'howto' };
  if (el.closest('#tutorial-btn')) return { kind: 'chrome', chrome: 'tutorial' };
  if (el.closest('#new-game-btn')) return { kind: 'chrome', chrome: 'new-game' };
  if (el.closest('#back-btn')) return { kind: 'chrome', chrome: 'back' };
  if (el.closest('.button-row')) return { kind: 'chrome', chrome: 'button-row' };
  if (el.closest('.game-header')) return { kind: 'chrome', chrome: 'game-header' };

  return { kind: 'unknown' };
}

/**
 * STUB narration for a resolved drop target.
 * Prefix makes it obvious this is inspect-stub copy, not MESSAGE_LIBRARY.
 */
export function stubNarrationFor(target: InspectTarget): string {
  switch (target.kind) {
    case 'kings-cell':
      return `[STUB inspect] Kings cell row ${target.row}, column ${target.col}. What piece could live here?`;
    case 'hex-cell':
      return `[STUB inspect] Hex cell at row ${target.row}, column ${target.col}. Who connects across?`;
    case 'fiar-node':
      return `[STUB inspect] FIAR node ${target.nodeId}. Count the neighbors you can reach.`;
    case 'hex-a-gone-cell':
      return `[STUB inspect] Hex-a-Gone cell q=${target.q}, r=${target.r}. Could a shape fit here?`;
    case 'hex-a-gone-bank':
      return `[STUB inspect] Pattern-block bank: ${target.shape}. How many empty cells does it cover?`;
    case 'star-space':
      return `[STUB inspect] Star Track space ${target.space} (${target.player}). How far to the star?`;
    case 'star-piece':
      return `[STUB inspect] Star Track piece for ${target.player}. Where will the next chain take them?`;
    case 'chrome':
      return stubChromeNarration(target.chrome);
    case 'unknown':
      return `[STUB inspect] Hmm — I don't recognize that spot yet. Try a board square or a How to Play button!`;
    default: {
      const _exhaustive: never = target;
      return _exhaustive;
    }
  }
}

function stubChromeNarration(chrome: InspectChrome): string {
  switch (chrome) {
    case 'howto':
      return `[STUB inspect] That's How to Play — open it when you want the rules in words and pictures.`;
    case 'tutorial':
      return `[STUB inspect] Tutorial starts a guided walk-through. Great when you're learning!`;
    case 'new-game':
      return `[STUB inspect] New Game resets the board so you can try a fresh match.`;
    case 'back':
      return `[STUB inspect] Back takes you to the game list. Pick another adventure anytime.`;
    case 'button-row':
      return `[STUB inspect] These are the game controls — New Game, Tutorial, How to Play.`;
    case 'game-header':
      return `[STUB inspect] That's the game title area. You're in the middle of a match!`;
    case 'unknown-chrome':
      return `[STUB inspect] Chrome on the page — not a board square, but part of the shell.`;
    default: {
      const _exhaustive: never = chrome;
      return _exhaustive;
    }
  }
}

/** Resolve drop element → STUB speech line (null only if no element). */
export function inspectDropSpeech(el: Element | null): string {
  return stubNarrationFor(resolveInspectTarget(el));
}
