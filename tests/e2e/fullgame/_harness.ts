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
  let noProgress = 0;
  let lastFill = '';
  let restarts = 0;
  let turnsSinceRestart = 0;
  for (let i = 0; i < driver.maxTurns; i++) {
    if (await isOver(page, driver)) return;

    // Ramrod deadlock: restart HvH under same seed path
    if (
      driver.id === 'ramrod' &&
      (await page.locator('.ramrod-deadlock-hint').count()) > 0
    ) {
      await startHumanVsHuman(page);
      stalled = 0;
      noProgress = 0;
      continue;
    }

    // Juggle softlock: boards stall with unfillable gaps. Reshuffle when fill
    // is unchanged for a stretch (or stuck high). Do not hard-cap deal length —
    // completable slow fills need room past ~200 turns.
    if (driver.id === 'juggle') {
      turnsSinceRestart += 1;
      const fillInfo = await page.evaluate(() => {
        const parse = (sel: string) => {
          const t =
            document.querySelector(sel)?.textContent?.replace('%', '') || '0';
          return parseInt(t, 10) || 0;
        };
        const f1 = parse('.juggle-board.player1 .fill-percent');
        const f2 = parse('.juggle-board.player2 .fill-percent');
        return { key: `${f1}|${f2}`, max: Math.max(f1, f2), min: Math.min(f1, f2) };
      });
      if (fillInfo.key === lastFill) noProgress += 1;
      else {
        noProgress = 0;
        lastFill = fillInfo.key;
      }
      const softlocked =
        noProgress > 25 ||
        (fillInfo.max >= 90 && noProgress > 12) ||
        (fillInfo.min >= 85 && turnsSinceRestart > 120 && noProgress > 6);
      if (softlocked && restarts < 40) {
        await startHumanVsHuman(page);
        restarts += 1;
        noProgress = 0;
        lastFill = '';
        stalled = 0;
        turnsSinceRestart = 0;
        continue;
      }
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
            'button:has-text("Pass"), button:has-text("Continue"), .star-track-draw-btn, .juggle-choose-other-btn'
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

    // Ramrod: some deals open in mutual-pass deadlock — reshuffle before asserts.
    if (driver.id === 'ramrod') {
      for (let r = 0; r < 5; r++) {
        if ((await page.locator('.ramrod-deadlock-hint').count()) === 0) break;
        await startHumanVsHuman(page);
      }
    }

    // Illegal move rejected (status/material stable — selection chrome may churn)
    const beforeIllegal = await boardFingerprint(page);
    await driver.tryIllegal(page);
    await page.waitForTimeout(80);
    const afterIllegal = await boardFingerprint(page);
    expect(afterIllegal).toBe(beforeIllegal);

    // Legal move accepted
    let accepted = false;
    for (let attempt = 0; attempt < 12; attempt++) {
      if (
        driver.id === 'ramrod' &&
        (await page.locator('.ramrod-deadlock-hint').count()) > 0
      ) {
        await startHumanVsHuman(page);
        continue;
      }
      const beforeLegal = await boardFingerprint(page);
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
    for (let i = 0; i < 30; i++) {
      if (await isOver(page, driver)) {
        flipped = true; // game ended — seat control changed
        break;
      }
      const nowText = await readStatusText(page);
      const now = seatToken(nowText);
      if (
        openingSeat !== 'unknown' &&
        now !== 'unknown' &&
        now !== openingSeat
      ) {
        flipped = true;
        break;
      }
      // Class-based seat chrome (pent / fiar / kwa)
      const seatClass = await page.evaluate(() => {
        const el = document.querySelector(
          '.pent-status, .fiar-status, .kwa-status, .sd-status, .pg-status, .frac-status, .pinball-status'
        );
        if (!el) return '';
        if (el.classList.contains('player2')) return 'p2';
        if (el.classList.contains('player1')) return 'p1';
        return '';
      });
      if (
        seatClass &&
        openingSeat !== 'unknown' &&
        seatClass !== openingSeat
      ) {
        flipped = true;
        break;
      }
      await driver.playLegal(page);
      await page.waitForTimeout(50);
    }
    expect(flipped, 'expected turn indicator to flip seats').toBe(true);

    // Juggle: opening legal/flip asserts advance the seeded RNG and often leave
    // a fragmented deal. Reshuffle once so play-to-end starts from a fresh hand
    // (UI-only New Game — same path as softlock recovery).
    if (driver.id === 'juggle') {
      await startHumanVsHuman(page);
      await expect(page.locator(driver.mount).first()).toBeVisible({
        timeout: 15_000,
      });
    }

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
