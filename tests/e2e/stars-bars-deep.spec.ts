/**
 * E2E regression: Stars & Bars human vs AI full games on tablet + desktop,
 * Easy/Medium/Hard — finishes without stall, thinking UI, ≥44px targets.
 */
import { test, expect, type Page, devices } from '@playwright/test';

const MAX_HUMAN_TURNS = 60;
const STALL_MS = 15_000;

async function dismissOwl(page: Page) {
  const dismiss = page.locator(
    '#ollie-owl button[aria-label="Dismiss message"], #ollie-owl .owl-bubble-dismiss'
  );
  if (await dismiss.first().isVisible().catch(() => false)) {
    await dismiss.first().click({ force: true }).catch(() => {});
  }
  const minimize = page.locator('#ollie-owl .owl-minimize-btn');
  if (await minimize.isVisible().catch(() => false)) {
    await minimize.click({ force: true }).catch(() => {});
  }
  await page.evaluate(() => {
    const el = document.getElementById('ollie-owl');
    if (el) (el as HTMLElement).style.pointerEvents = 'none';
  });
}

async function startVsAi(page: Page, difficulty: 'easy' | 'medium' | 'hard') {
  await page.goto('/#/game/stars-bars');
  await expect(page.getByTestId('game-loading')).toBeHidden({ timeout: 20_000 });
  await expect(page.locator('.stars-board, #new-game-btn').first()).toBeVisible({
    timeout: 20_000,
  });
  await dismissOwl(page);
  await page.locator('#new-game-btn').click();
  const modal = page.locator('#new-game-modal');
  await expect(modal).toBeVisible({ timeout: 10_000 });
  await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
  await page.locator(`.difficulty-btn.${difficulty}`).click();
  await page.locator('#start-game-btn').click();
  await expect(modal).toHaveClass(/hidden/);
  await dismissOwl(page);
  await expect(page.locator('.stars-board')).toBeVisible();
}

async function playHumanTurn(page: Page) {
  const pass = page.locator('.stars-pass-btn');
  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
    return;
  }
  const playable = page.locator(
    '.stars-hand-container:first-child .stars-card:not(.disabled)'
  );
  if ((await playable.count()) > 0) {
    await playable.first().click({ force: true });
    const valid = page.locator('.stars-cell.valid');
    if ((await valid.count()) > 0) {
      await valid.first().click({ force: true });
    }
    return;
  }
  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
  }
}

async function waitHumanOrEnd(page: Page) {
  const deadline = Date.now() + STALL_MS;
  while (Date.now() < deadline) {
    const info = await page.evaluate(() => {
      const status =
        document.querySelector('.stars-status')?.textContent?.trim() ?? '';
      const thinking = !!document.querySelector('.status-ai-thinking');
      const pass = !!document.querySelector('.stars-pass-btn');
      const playable = document.querySelectorAll(
        '.stars-hand-container:first-child .stars-card:not(.disabled)'
      ).length;
      const computer = /computer is thinking/i.test(status);
      const yourTurn = /your turn/i.test(status);
      return { status, thinking, pass, playable, computer, yourTurn };
    });
    if (/wins|tie|draw/i.test(info.status)) {
      return { kind: 'ended' as const, ...info };
    }
    if (
      !info.computer &&
      !info.thinking &&
      (info.pass || info.playable > 0 || info.yourTurn)
    ) {
      return { kind: 'human' as const, ...info };
    }
    await page.waitForTimeout(120);
  }
  const status = (await page.locator('.stars-status').textContent())?.trim() ?? '';
  return { kind: 'stall' as const, status };
}

async function playFullGame(
  page: Page,
  difficulty: 'easy' | 'medium' | 'hard'
) {
  await startVsAi(page, difficulty);
  let sawThinking = false;
  let turns = 0;

  for (turns = 0; turns < MAX_HUMAN_TURNS; turns++) {
    const gate = await waitHumanOrEnd(page);
    if (gate.kind === 'ended') {
      return {
        outcome: 'ended' as const,
        turns,
        status: gate.status,
        sawThinking,
      };
    }
    if (gate.kind === 'stall') {
      return {
        outcome: 'stall' as const,
        turns,
        status: gate.status,
        sawThinking,
      };
    }
    if (gate.thinking || /computer/i.test(gate.status)) sawThinking = true;

    await playHumanTurn(page);
    await page.waitForTimeout(80);
    const flash = (await page.locator('.stars-status').textContent())?.trim() ?? '';
    if (/computer|thinking/i.test(flash)) sawThinking = true;
    if (/wins|tie|draw/i.test(flash)) {
      return {
        outcome: 'ended' as const,
        turns: turns + 1,
        status: flash,
        sawThinking,
      };
    }
  }
  const status = (await page.locator('.stars-status').textContent())?.trim() ?? '';
  return { outcome: 'budget' as const, turns, status, sawThinking };
}

test.describe('Stars & Bars deep playability', () => {
  test('desktop Easy finishes with You/Computer chrome', async ({ page }) => {
    const result = await playFullGame(page, 'easy');
    expect(result.outcome).toBe('ended');
    expect(result.status).toMatch(/wins|tie/i);
    const scores = await page.locator('.stars-scores').textContent();
    // After game over scores still show You/Computer from vs-AI session
    expect(scores).toMatch(/You:|Computer:/);
  });

  test('tablet Medium finishes; cells and cards ≥44px', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Mini'],
      viewport: { width: 768, height: 1024 },
    });
    const page = await context.newPage();
    await startVsAi(page, 'medium');

    const sizes = await page.evaluate(() => {
      const cell = document.querySelector('.stars-cell')?.getBoundingClientRect();
      const card = document
        .querySelector('.stars-hand-container .stars-card')
        ?.getBoundingClientRect();
      return {
        cellW: cell?.width ?? 0,
        cellH: cell?.height ?? 0,
        cardW: card?.width ?? 0,
        cardH: card?.height ?? 0,
      };
    });
    expect(sizes.cellW).toBeGreaterThanOrEqual(44);
    expect(sizes.cellH).toBeGreaterThanOrEqual(44);
    expect(sizes.cardW).toBeGreaterThanOrEqual(44);
    expect(sizes.cardH).toBeGreaterThanOrEqual(44);

    let sawThinking = false;
    let outcome: 'ended' | 'stall' | 'budget' = 'budget';
    let status = '';
    for (let turns = 0; turns < MAX_HUMAN_TURNS; turns++) {
      const gate = await waitHumanOrEnd(page);
      if (gate.kind === 'ended') {
        outcome = 'ended';
        status = gate.status;
        break;
      }
      if (gate.kind === 'stall') {
        outcome = 'stall';
        status = gate.status;
        break;
      }
      if (gate.thinking || /computer/i.test(gate.status)) sawThinking = true;
      await playHumanTurn(page);
      await page.waitForTimeout(80);
      const flash =
        (await page.locator('.stars-status').textContent())?.trim() ?? '';
      if (/computer|thinking/i.test(flash)) sawThinking = true;
      if (/wins|tie|draw/i.test(flash)) {
        outcome = 'ended';
        status = flash;
        break;
      }
    }
    expect(outcome).toBe('ended');
    expect(status).toMatch(/wins|tie/i);
    expect(sawThinking).toBe(true);
    await context.close();
  });

  test('desktop Hard finishes without stall', async ({ page }) => {
    const result = await playFullGame(page, 'hard');
    expect(result.outcome).toBe('ended');
    expect(result.sawThinking).toBe(true);
  });

  test('New Game mid AI think leaves a clean Your-turn board', async ({
    page,
  }) => {
    await startVsAi(page, 'easy');
    await playHumanTurn(page);
    await page.waitForTimeout(80);
    await page.locator('#new-game-btn').click();
    const modal = page.locator('#new-game-modal');
    await expect(modal).toBeVisible();
    await page.locator('.mode-option[data-mode="human-vs-ai"]').click();
    await page.locator('.difficulty-btn.easy').click();
    await page.locator('#start-game-btn').click();
    await expect(modal).toHaveClass(/hidden/);
    await page.waitForTimeout(2000);
    const status = (await page.locator('.stars-status').textContent())?.trim() ?? '';
    expect(status).toMatch(/Your turn/i);
    expect(status).not.toMatch(/thinking/i);
    const history = await page.locator('.stars-move-item').count();
    expect(history).toBe(0);
  });
});
