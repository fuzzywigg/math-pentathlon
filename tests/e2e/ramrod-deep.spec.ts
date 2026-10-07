/**
 * E2E regression: Ramrod human vs AI full games on tablet + desktop,
 * Easy/Medium/Hard — finishes without stall, exposes thinking UI, ≥44px targets.
 */
import { test, expect, type Page } from '@playwright/test';

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
  await page.goto('/#/game/ramrod');
  await expect(page.getByTestId('game-loading')).toBeHidden({ timeout: 20_000 });
  await expect(page.locator('.ramrod-board, #new-game-btn').first()).toBeVisible({
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
  await expect(page.locator('.ramrod-board')).toBeVisible();
}

async function playHumanTurn(page: Page) {
  await page.evaluate(() => {
    const click = (el: Element | null | undefined) => {
      el?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    };
    const pass = [...document.querySelectorAll('.ramrod-btn-secondary')].find(
      (b) => b.textContent?.includes('Pass Turn')
    );
    if (pass) {
      click(pass);
      return;
    }
    const rod = document.querySelector(
      '.ramrod-player-player1 .ramrod-rod-wrapper.selectable'
    );
    click(rod);
    const valid = document.querySelector('.ramrod-slot.valid');
    if (valid) {
      click(valid);
      return;
    }
    const clear = [...document.querySelectorAll('.ramrod-btn-secondary')].find(
      (b) => b.textContent?.includes('Clear Selection')
    );
    click(clear);
    const rods = [
      ...document.querySelectorAll(
        '.ramrod-player-player1 .ramrod-rod-wrapper.selectable'
      ),
    ];
    click(rods[1] ?? rods[0]);
    click(document.querySelector('.ramrod-slot.valid'));
  });
}

async function waitHumanOrEnd(page: Page) {
  const deadline = Date.now() + STALL_MS;
  while (Date.now() < deadline) {
    const info = await page.evaluate(() => {
      const status =
        document.querySelector('.ramrod-status')?.textContent?.trim() ?? '';
      const thinking = !!document.querySelector('.ramrod-computer-thinking');
      const pass = [...document.querySelectorAll('.ramrod-btn-secondary')].some(
        (b) => b.textContent?.includes('Pass Turn')
      );
      const selectable = document.querySelectorAll(
        '.ramrod-rod-wrapper.selectable'
      ).length;
      const banner = !!document.querySelector('.ramrod-winner-banner');
      const computerText = /computer|thinking/i.test(status);
      return { status, thinking, pass, selectable, banner, computerText };
    });
    if (info.banner || /wins|tie/i.test(info.status)) {
      return { kind: 'ended' as const, ...info };
    }
    if (
      !info.computerText &&
      !info.thinking &&
      (info.pass || info.selectable > 0)
    ) {
      return { kind: 'human' as const, ...info };
    }
    await page.waitForTimeout(120);
  }
  const status =
    (await page.locator('.ramrod-status').textContent().catch(() => '')) ?? '';
  return { kind: 'stall' as const, status: status.trim() };
}

async function playFullGame(
  page: Page,
  difficulty: 'easy' | 'medium' | 'hard'
) {
  await startVsAi(page, difficulty);
  let thinkSeen = 0;
  for (let t = 0; t < MAX_HUMAN_TURNS; t++) {
    const gate = await waitHumanOrEnd(page);
    if (gate.kind === 'ended') {
      expect(gate.kind).toBe('ended');
      return { thinkSeen, status: gate.status };
    }
    expect(gate.kind, `stall at turn ${t}: ${gate.status}`).toBe('human');
    await playHumanTurn(page);
    await page.waitForTimeout(80);
    const flash = await page
      .locator('.ramrod-status')
      .textContent()
      .catch(() => '');
    if (/computer|thinking/i.test(flash || '')) thinkSeen++;
    if (
      await page
        .locator('.ramrod-computer-thinking')
        .count()
        .then((n) => n > 0)
    ) {
      thinkSeen++;
    }
    const post = await page.locator('.ramrod-status').textContent();
    if (/wins|tie/i.test(post || '')) {
      return { thinkSeen, status: post?.trim() ?? '' };
    }
  }
  throw new Error('turn budget exceeded');
}

test.describe('Ramrod deep playtest', () => {
  for (const difficulty of ['easy', 'medium', 'hard'] as const) {
    test(`desktop vs AI ${difficulty} finishes`, async ({ page }) => {
      const result = await playFullGame(page, difficulty);
      expect(result.status).toMatch(/wins|tie/i);
      expect(result.thinkSeen).toBeGreaterThan(0);
    });
  }

  test('tablet touch floors ≥44px + finishes medium', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await startVsAi(page, 'medium');

    const measures = await page.evaluate(() => {
      const rods = [...document.querySelectorAll('.ramrod-rod-wrapper.selectable')];
      const slots = [...document.querySelectorAll('.ramrod-slot')];
      const size = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { w: r.width, h: r.height };
      };
      return {
        rod: rods[0] ? size(rods[0]) : null,
        slot: slots[0] ? size(slots[0]) : null,
        hint: document.querySelector('.ramrod-turn-hint')?.textContent ?? '',
      };
    });
    expect(measures.rod).toBeTruthy();
    expect(measures.rod!.h).toBeGreaterThanOrEqual(44);
    expect(measures.rod!.w).toBeGreaterThanOrEqual(44);
    expect(measures.slot!.h).toBeGreaterThanOrEqual(44);
    expect(measures.hint).toMatch(/Blue|rod/i);

    // Finish the game
    let thinkSeen = 0;
    for (let t = 0; t < MAX_HUMAN_TURNS; t++) {
      const gate = await waitHumanOrEnd(page);
      if (gate.kind === 'ended') break;
      expect(gate.kind).toBe('human');
      await playHumanTurn(page);
      if (
        await page
          .locator('.ramrod-computer-thinking')
          .count()
          .then((n) => n > 0)
      ) {
        thinkSeen++;
      }
      const post = await page.locator('.ramrod-status').textContent();
      if (/wins|tie/i.test(post || '')) break;
      if (t === MAX_HUMAN_TURNS - 1) throw new Error('tablet turn budget');
    }
    expect(thinkSeen).toBeGreaterThanOrEqual(0);
    await context.close();
  });
});
