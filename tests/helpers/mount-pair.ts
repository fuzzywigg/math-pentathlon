/**
 * Board + status element pair used by many game-controller unit suites.
 */
export type MountPair = {
  board: HTMLElement;
  status: HTMLElement;
};

export type MountPairOptions = {
  /** Optional className on the board container (e.g. queens-guards). */
  boardClass?: string;
};

/** Create board/status divs, append to document.body, return both. */
export function mountPair(options?: MountPairOptions): MountPair {
  const board = document.createElement('div');
  if (options?.boardClass) {
    board.className = options.boardClass;
  }
  const status = document.createElement('div');
  document.body.append(board, status);
  return { board, status };
}
