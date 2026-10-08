/**
 * Shared fullgame assertion runner — one COMPLETE HvH match per game.
 */
import { expect, type Page } from '@playwright/test';
import {
  assertPlayAgainAndMenu,
  dismissOwl,
  gameOverLocator,
  gotoGame,
  installConsoleGuard,
  mountLocator,
  readStatus,
  startHumanFresh,
} from './_shared';
import {
  assertIllegalRejected,
  playOneLegalTurn,
  playToGameOver,
} from './_play';

export type FullgameOptions = {
  /** Override default 180s test budget for long games. */
  timeoutMs?: number;
  maxTurns?: number;
};

/**
 * Board renders → illegal rejected → legal accepted + turn flips →
 * play to game-over → play-again + back-to-menu → no console errors.
 */
export async function runFullgameMatch(
  page: Page,
  gameId: string,
  opts: FullgameOptions = {}
): Promise<void> {
  const getErrors = installConsoleGuard(page);

  await gotoGame(page, gameId);
  await startHumanFresh(page);
  await dismissOwl(page);

  // Board renders
  await expect(mountLocator(page, gameId)).toBeVisible({ timeout: 15_000 });
  const openingStatus = await readStatus(page, gameId);
  expect(openingStatus.length).toBeGreaterThan(0);

  // Illegal move rejected (when applicable for this phase)
  await assertIllegalRejected(page, gameId);

  // Explicit legal move + turn-indicator flip (status text must change).
  // Some illegal probes (Hex) already consumed a legal placement — in that
  // case status already differs from opening; otherwise play one turn now.
  let statusAfterLegal = await readStatus(page, gameId);
  if (statusAfterLegal === openingStatus) {
    const before = statusAfterLegal;
    const ok = await playOneLegalTurn(page, gameId);
    expect(ok, `expected a legal opening move for ${gameId}`).toBe(true);
    await page.waitForTimeout(80);
    statusAfterLegal = await readStatus(page, gameId);
    expect(
      statusAfterLegal,
      `turn indicator should change after legal move (${gameId})`
    ).not.toBe(before);
  } else {
    // Illegal probe included a legal placement (e.g. Hex occupied re-click).
    expect(statusAfterLegal).not.toBe(openingStatus);
  }

  await playToGameOver(page, gameId, {
    maxTurns: opts.maxTurns ?? 220,
  });

  // Game-over screen
  await expect(gameOverLocator(page, gameId)).toBeVisible({ timeout: 15_000 });

  // Play again + back to menu
  await assertPlayAgainAndMenu(page, gameId);

  const errors = getErrors();
  expect(errors, errors.join('\n')).toEqual([]);
}
