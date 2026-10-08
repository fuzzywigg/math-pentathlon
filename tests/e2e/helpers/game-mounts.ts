/**
 * Per-game primary board / play-surface selectors shared by smoke, mobile,
 * a11y, visual, and (later) fullgame suites.
 */
export const GAME_MOUNT: Record<string, string> = {
  'kings-quadraphages': '#board .board .cell, .cell-king',
  hex: '.hex-board',
  'star-track': '.star-track-board',
  'hex-a-gone': '.hex-a-gone-board',
  calla: '.calla-wrapper, .calla-pit',
  'sum-dominoes': '.sd-board',
  'par-55': '.par55-board',
  ramrod: '.ramrod-board',
  'kwatro-sinko': '.kwa-board',
  fiar: '.fiar-board-container',
  juggle: '.juggle-board',
  'contig-60': '.contig-board',
  'stars-bars': '.stars-board',
  'fab-a-diffy': '.fab-bar-pool, .fab-answer-board',
  'queens-guards': '.qg-board-container',
  'prime-gold': '.pg-board, .prime-board',
  'remainder-islands': '.remainder-board',
  'pent-em-in': '.pent-board',
  'frac-fact': '.frac-problem, .frac-choice-btn',
  'fraction-pinball':
    '.pinball-board, .pinball-challenge, .pinball-game-container, .pinball-choice-btn',
};

export const DEFAULT_MOUNT = '#board, #game-container, main';
