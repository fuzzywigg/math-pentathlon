/**
 * Shared assertion flow for one complete HvH match (burn-1007).
 */
import { expect, type Page } from '@playwright/test';
import { getDriver, type GameDriver } from './_drivers';
import {
  attachConsoleTrap,
  backToMenu,
  boardFingerprint,
  gotoGameHvH,
  isGameOverText,
  playAgainHvH,
  readStatusText,
  startHumanVsHuman,
} from './_helpers';

function seatToken(status: string): 'p1' | 'p2' | 'unknown' {
  const s = status.toLowerCase();
  if (/player 2|\bred\b/.test(s) && !/player 1|\bblue\b|\byou\b/.test(s)) {
    return 'p2';
  }
  if (/player 1|\bblue\b|\byou\b|\byour turn\b/.test(s)) return 'p1';
  if (/\bred\b/.test(s)) return 'p2';
  return 'unknown';
}

async function isOver(page: Page, driver: GameDriver): Promise<boolean> {
  if (await page.locator(driver.gameOver).first().isVisible().catch(() => false)) {
    const text = await readStatusText(page);
    const banner = await page
      .locator(driver.gameOver)
      .first()
      .textContent()
      .catch(() => '');
    if (isGameOverText(`${text} ${banner ?? ''}`)) return true;
  }
  const status = await readStatusText(page);
  return isGameOverText(status);
}

async function playToGameOver(page: Page, driver: GameDriver): Promise<void> {
  let stalled = 0;
  for (let i = 0; i < driver.maxTurns; i++) {
    if (await isOver(page, driver)) return;

    // Ramrod deadlock: restart HvH under same seed path
    if (
      driver.id === 'ramrod' &&
      (await page.locator('.ramrod-deadlock-hint').count()) > 0
    ) {
      await startHumanVsHuman(page);
      stalled = 0;
      continue;
    }

    const before = await boardFingerprint(page);
    const acted = await driver.playLegal(page);
    await page.waitForTimeout(40);
    const after = await boardFingerprint(page);

    if (!acted && before === after) {
      stalled += 1;
      if (stalled > 8) {
        // Nudge: try pass-like buttons generically
        await page
          .locator(
            'button:has-text("Pass"), button:has-text("Continue"), .star-track-draw-btn'
          )
          .first()
          .click({ force: true })
          .catch(() => undefined);
        await page.waitForTimeout(60);
      }
      if (stalled > 25) {
        throw new Error(
          `${driver.id}: stalled after ${i} turns; status=${await readStatusText(page)}`
        );
      }
      continue;
    }
    stalled = 0;
  }
  if (!(await isOver(page, driver))) {
    throw new Error(
      `${driver.id}: did not reach game-over in ${driver.maxTurns} turns; status=${await readStatusText(page)}`
    );
  }
}

/**
 * Full acceptance path for one game id.
 * Tag: @fullgame (CI required path grep-inverts this).
 */
export async function runFullgameMatch(
  page: Page,
  gameId: string
): Promise<void> {
  const driver = getDriver(gameId);
  const trap = attachConsoleTrap(page);

  try {
    await gotoGameHvH(page, gameId);

    // Board renders
    await expect(page.locator(driver.mount).first()).toBeVisible({
      timeout: 15_000,
    });

    const openingStatus = await readStatusText(page);
    expect(openingStatus.length).toBeGreaterThan(0);
    expect(isGameOverText(openingStatus)).toBe(false);
    const openingSeat = seatToken(openingStatus);

    // Illegal move rejected (fingerprint stable)
    const beforeIllegal = await boardFingerprint(page);
    await driver.tryIllegal(page);
    await page.waitForTimeout(80);
    const afterIllegal = await boardFingerprint(page);
    expect(afterIllegal).toBe(beforeIllegal);

    // Legal move accepted
    const beforeLegal = await boardFingerprint(page);
    let accepted = false;
    for (let attempt = 0; attempt < 6; attempt++) {
      const acted = await driver.playLegal(page);
      await page.waitForTimeout(60);
      const afterLegal = await boardFingerprint(page);
      if (acted && afterLegal !== beforeLegal) {
        accepted = true;
        break;
      }
    }
    expect(accepted, 'expected a legal UI move to change board/status').toBe(
      true
    );

    // Turn indicator flips (or free-turn then eventually flips / ends)
    let flipped = false;
    for (let i = 0; i < 12; i++) {
      if (await isOver(page, driver)) {
        flipped = true; // game ended — seat control changed
        break;
      }
      const now = seatToken(await readStatusText(page));
      if (
        openingSeat !== 'unknown' &&
        now !== 'unknown' &&
        now !== openingSeat
      ) {
        flipped = true;
        break;
      }
      await driver.playLegal(page);
      await page.waitForTimeout(50);
    }
    expect(flipped, 'expected turn indicator to flip seats').toBe(true);

    // Complete match
    await playToGameOver(page, driver);
    await expect(page.locator(driver.gameOver).first()).toBeVisible({
      timeout: 10_000,
    });
    const endText = `${await readStatusText(page)} ${
      (await page.locator(driver.gameOver).first().textContent()) ?? ''
    }`;
    expect(isGameOverText(endText)).toBe(true);

    // Play again (New Game → HvH)
    await playAgainHvH(page);
    await expect(page.locator(driver.mount).first()).toBeVisible({
      timeout: 15_000,
    });
    const againStatus = await readStatusText(page);
    expect(isGameOverText(againStatus)).toBe(false);

    // Back to menu
    await backToMenu(page);
    await expect(page.locator('.game-card').first()).toBeVisible();

    expect(trap.errors, trap.errors.join('\n')).toEqual([]);
  } finally {
    trap.dispose();
  }
}
