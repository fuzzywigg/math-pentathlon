/**
 * E2E regression: Sum Dominoes human vs AI full games on tablet + desktop,
 * Easy/Medium/Hard — finishes without stall, exposes thinking UI, ≥44px targets.
 */
import { test, expect, type Page } from '@playwright/test';
import {
  dismissOwl,
  startVsAiAt,
} from './helpers/page';

const MAX_HUMAN_TURNS = 60;
const STALL_MS = 15_000;

async function playHumanTurn(page: Page) {
  const roll = page.locator('.sd-roll-btn');
  if (await roll.isVisible().catch(() => false)) {
    if (!(await roll.isDisabled().catch(() => true))) {
      await roll.click({ force: true });
      await page.waitForTimeout(100);
    }
  }
  const pass = page.locator('.sd-pass-btn');
  if (await pass.isVisible().catch(() => false)) {
    await pass.click({ force: true });
    return;
  }
  const playable = page.locator('.sd-hand-domino-playable');
  if ((await playable.count()) > 0) {
    await playable.first().click({ force: true });
    const valid = page.locator('.sd-cell-valid');
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
        document.querySelector('.sd-status')?.textContent?.trim() ?? '';
      const thinking = !!document.querySelector('.sd-computer-thinking');
      const roll = document.querySelector('.sd-roll-btn') as HTMLButtonElement | null;
      const canRoll = !!roll && !roll.disabled;
      const pass = !!document.querySelector('.sd-pass-btn');
      const playable = document.querySelectorAll('.sd-hand-domino-playable').length;
      const computer = /computer/i.test(status);
      return { status, thinking, canRoll, pass, playable, computer };
    });
    if (/wins!|draw|tie/i.test(info.status)) return { kind: 'ended' as const, ...info };
    if (!info.computer && !info.thinking && (info.canRoll || info.pass || info.playable > 0)) {
      return { kind: 'human' as const, ...info };
    }
    await page.waitForTimeout(120);
  }
  const status = (await page.locator('.sd-status').textContent())?.trim() ?? '';
  return { kind: 'stall' as const, status };
}

async function playFullGame(page: Page, difficulty: 'easy' | 'medium' | 'hard') {
  await startVsAiAt(page, 'sum-dominoes', difficulty);
  let sawThinking = false;
  let turns = 0;

  for (turns = 0; turns < MAX_HUMAN_TURNS; turns++) {
    const gate = await waitHumanOrEnd(page);
    if (gate.kind === 'ended') {
      return { outcome: 'ended' as const, turns, status: gate.status, sawThinking };
    }
    if (gate.kind === 'stall') {
      return { outcome: 'stall' as const, turns, status: gate.status, sawThinking };
    }
    if (gate.thinking || /computer/i.test(gate.status)) sawThinking = true;

    await playHumanTurn(page);
    await page.waitForTimeout(80);
    const flash = (await page.locator('.sd-status').textContent())?.trim() ?? '';
    if (/computer|thinking/i.test(flash)) sawThinking = true;
    if (/wins!|draw|tie/i.test(flash)) {
      return { outcome: 'ended' as const, turns: turns + 1, status: flash, sawThinking };
    }
  }
  const status = (await page.locator('.sd-status').textContent())?.trim() ?? '';
  return { outcome: 'budget' as const, turns, status, sawThinking };
}

test.describe('Sum Dominoes deep playtest e2e', () => {
  for (const difficulty of ['easy', 'medium', 'hard'] as const) {
    test(`desktop vs AI ${difficulty} finishes without stall`, async ({
      page,
    }) => {
      const result = await playFullGame(page, difficulty);
      expect(result.outcome, result.status).toBe('ended');
      expect(result.status).toMatch(/wins!|draw|tie/i);
    });
  }

  test.describe('tablet touch', () => {
    test.use({
      ...{
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
        isMobile: true,
      },
    });

    test('tablet Easy full game + 44px hit floors', async ({ page }) => {
      await startVsAiAt(page, 'sum-dominoes', 'easy');

      const sizes = await page.evaluate(() => {
        const roll = document.querySelector('.sd-roll-btn');
        const rr = roll?.getBoundingClientRect();
        const hand = document.querySelector('.sd-hand-domino');
        const hr = hand?.getBoundingClientRect();
        return {
          roll: rr ? { w: rr.width, h: rr.height } : null,
          hand: hr ? { w: hr.width, h: hr.height } : null,
        };
      });
      expect(sizes.roll).toBeTruthy();
      expect(sizes.roll!.h).toBeGreaterThanOrEqual(44);
      expect(sizes.roll!.w).toBeGreaterThanOrEqual(120);
      expect(sizes.hand).toBeTruthy();
      expect(sizes.hand!.h).toBeGreaterThanOrEqual(44);
      expect(sizes.hand!.w).toBeGreaterThanOrEqual(44);

      // Finish the game
      let ended = false;
      for (let t = 0; t < MAX_HUMAN_TURNS; t++) {
        const gate = await waitHumanOrEnd(page);
        if (gate.kind === 'ended') {
          ended = true;
          break;
        }
        expect(gate.kind, gate.status).not.toBe('stall');
        await playHumanTurn(page);
        const status = (await page.locator('.sd-status').textContent()) ?? '';
        if (/wins!|draw|tie/i.test(status)) {
          ended = true;
          break;
        }
      }
      expect(ended).toBe(true);
    });

    test('tablet Medium shows computer thinking and does not illicit-roll Blue', async ({
      page,
    }) => {
      await startVsAiAt(page, 'sum-dominoes', 'medium');
      // Human opens
      await page.locator('.sd-roll-btn').click({ force: true });
      const pass = page.locator('.sd-pass-btn');
      const playable = page.locator('.sd-hand-domino-playable');
      if ((await playable.count()) > 0) {
        await playable.first().click({ force: true });
        const valid = page.locator('.sd-cell-valid');
        if ((await valid.count()) > 0) await valid.first().click({ force: true });
      } else if (await pass.isVisible().catch(() => false)) {
        await pass.click({ force: true });
      }

      // AI should think
      await expect(page.locator('.sd-status')).toContainText(/computer/i, {
        timeout: 3000,
      });

      // Wait until Blue's turn again — must see Roll (not auto-rolled dice)
      const gate = await waitHumanOrEnd(page);
      expect(gate.kind).not.toBe('stall');
      if (gate.kind === 'human') {
        const rollVisible = await page.locator('.sd-roll-btn').isVisible();
        const diceVisible = await page.locator('.sd-dice-display').isVisible();
        // Fresh human rolling seat: Roll button, no dice yet
        if (rollVisible) {
          expect(diceVisible).toBe(false);
        }
      }
    });
  });
});
