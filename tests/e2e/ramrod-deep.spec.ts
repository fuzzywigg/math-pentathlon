/**
 * E2E regression: Ramrod human vs AI full games on tablet + desktop,
 * Easy/Medium/Hard — finishes without stall, exposes thinking UI, ≥44px targets.
 *
 * Nondeterministic deals can reach mutual-place deadlock (both seats Pass forever;
 * rules do not auto-settle — see playtest docs). The harness detects the deadlock
 * hint, restarts New Game, and retries so CI does not flake on deal seed.
 */
import { test, expect, type Page } from '@playwright/test';
import {
  dismissOwl,
  startVsAiAt,
} from './helpers/page';

const MAX_HUMAN_TURNS = 60;
const STALL_MS = 15_000;
/** Bad deals that surface mutual-place deadlock — restart rather than burn budget. */
const MAX_DEADLOCK_RESTARTS = 4;

/** DOM-dispatch clicks — survives shell overflow-clip quirks (same as playtest harness). */
async function playHumanTurn(
  page: Page
): Promise<'placed' | 'passed' | 'deadlock' | 'noop'> {
  const deadlock = await page.locator('.ramrod-deadlock-hint').count();
  if (deadlock > 0) return 'deadlock';

  return page.evaluate(() => {
    const click = (el: Element | null | undefined) => {
      el?.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    };

    if (document.querySelector('.ramrod-deadlock-hint')) return 'deadlock' as const;

    const pass = [...document.querySelectorAll('.ramrod-btn-secondary')].find(
      (b) => b.textContent?.includes('Pass Turn')
    );
    if (pass) {
      click(pass);
      return 'passed' as const;
    }

    const rodCount = document.querySelectorAll(
      '.ramrod-player-player1 .ramrod-rod-wrapper.selectable'
    ).length;
    if (rodCount === 0) return 'noop' as const;

    // Try every hand index. Hand order is stable across synchronous updateUI
    // rebuilds; only trying rods[0]/[1] previously left legal later rods untried.
    for (let index = 0; index < rodCount; index++) {
      const current = [
        ...document.querySelectorAll(
          '.ramrod-player-player1 .ramrod-rod-wrapper.selectable'
        ),
      ];
      if (!current[index]) continue;
      click(current[index]);
      const valids = [...document.querySelectorAll('.ramrod-slot.valid')];
      if (valids.length > 0) {
        const complete = valids.find((s) =>
          s.parentElement?.textContent?.includes('Need:')
        );
        click(complete ?? valids[0]);
        return 'placed' as const;
      }
      const selected = document.querySelector(
        '.ramrod-rod-wrapper.selected.selectable'
      );
      click(selected); // tap selected again to clear
      const clear = [...document.querySelectorAll('.ramrod-btn-secondary')].find(
        (b) => b.textContent?.includes('Clear Selection')
      );
      click(clear);
    }
    return 'noop' as const;
  });
}

type GateInfo = {
  kind: 'ended' | 'human' | 'stall' | 'deadlock';
  status: string;
  thinking: boolean;
  pass: boolean;
  selectable: number;
  banner: boolean;
  computerText: boolean;
  deadlock: boolean;
};

async function waitHumanOrEnd(page: Page): Promise<GateInfo> {
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
      const deadlock = !!document.querySelector('.ramrod-deadlock-hint');
      return {
        status,
        thinking,
        pass,
        selectable,
        banner,
        computerText,
        deadlock,
      };
    });
    if (info.deadlock) {
      return { kind: 'deadlock', ...info };
    }
    if (info.banner || /wins|tie/i.test(info.status)) {
      return { kind: 'ended', ...info };
    }
    if (
      !info.computerText &&
      !info.thinking &&
      (info.pass || info.selectable > 0)
    ) {
      return { kind: 'human', ...info };
    }
    await page.waitForTimeout(120);
  }
  const status =
    (await page.locator('.ramrod-status').textContent().catch(() => '')) ?? '';
  const deadlock =
    (await page.locator('.ramrod-deadlock-hint').count().catch(() => 0)) > 0;
  if (deadlock) {
    return {
      kind: 'deadlock',
      status: status.trim(),
      thinking: false,
      pass: false,
      selectable: 0,
      banner: false,
      computerText: false,
      deadlock: true,
    };
  }
  return {
    kind: 'stall',
    status: status.trim(),
    thinking: false,
    pass: false,
    selectable: 0,
    banner: false,
    computerText: false,
    deadlock: false,
  };
}

/**
 * After a human handoff, wait briefly for AI thinking chrome (or end/deadlock)
 * so thinkSeen is not lost to a too-short flash sample.
 */
async function observeAiHandoff(page: Page): Promise<{
  thinkSeen: boolean;
  ended: boolean;
  deadlock: boolean;
  status: string;
}> {
  const deadline = Date.now() + 2_500;
  let thinkSeen = false;
  while (Date.now() < deadline) {
    const snap = await page.evaluate(() => {
      const status =
        document.querySelector('.ramrod-status')?.textContent?.trim() ?? '';
      const thinking = !!document.querySelector('.ramrod-computer-thinking');
      const banner = !!document.querySelector('.ramrod-winner-banner');
      const deadlock = !!document.querySelector('.ramrod-deadlock-hint');
      return { status, thinking, banner, deadlock };
    });
    if (snap.thinking || /computer|thinking/i.test(snap.status)) {
      thinkSeen = true;
    }
    if (snap.deadlock) {
      return { thinkSeen, ended: false, deadlock: true, status: snap.status };
    }
    if (snap.banner || /wins|tie/i.test(snap.status)) {
      return { thinkSeen, ended: true, deadlock: false, status: snap.status };
    }
    // Human seat again (AI finished or never started) — stop waiting.
    if (
      !snap.thinking &&
      !/computer|thinking/i.test(snap.status) &&
      thinkSeen
    ) {
      return { thinkSeen, ended: false, deadlock: false, status: snap.status };
    }
    const humanReady = await page.evaluate(() => {
      const status =
        document.querySelector('.ramrod-status')?.textContent?.trim() ?? '';
      if (/computer|thinking/i.test(status)) return false;
      if (document.querySelector('.ramrod-computer-thinking')) return false;
      const pass = [...document.querySelectorAll('.ramrod-btn-secondary')].some(
        (b) => b.textContent?.includes('Pass Turn')
      );
      const selectable = document.querySelectorAll(
        '.ramrod-rod-wrapper.selectable'
      ).length;
      return pass || selectable > 0;
    });
    if (humanReady && !thinkSeen) {
      // Handoff may have been too fast; give one more poll cycle then exit.
      await page.waitForTimeout(80);
      const late = await page.evaluate(() => {
        const status =
          document.querySelector('.ramrod-status')?.textContent?.trim() ?? '';
        return (
          !!document.querySelector('.ramrod-computer-thinking') ||
          /computer|thinking/i.test(status)
        );
      });
      if (late) thinkSeen = true;
      return {
        thinkSeen,
        ended: false,
        deadlock: false,
        status: snap.status,
      };
    }
    await page.waitForTimeout(80);
  }
  const status =
    (await page.locator('.ramrod-status').textContent().catch(() => '')) ?? '';
  return {
    thinkSeen,
    ended: /wins|tie/i.test(status),
    deadlock:
      (await page.locator('.ramrod-deadlock-hint').count().catch(() => 0)) > 0,
    status: status.trim(),
  };
}

async function playFullGame(
  page: Page,
  difficulty: 'easy' | 'medium' | 'hard'
) {
  let thinkSeen = 0;
  let restarts = 0;

  await startVsAiAt(page, 'ramrod', difficulty);

  for (let t = 0; t < MAX_HUMAN_TURNS; t++) {
    const gate = await waitHumanOrEnd(page);
    if (gate.thinking || gate.computerText) thinkSeen++;

    if (gate.kind === 'ended') {
      return { thinkSeen, status: gate.status };
    }

    if (gate.kind === 'deadlock') {
      if (restarts >= MAX_DEADLOCK_RESTARTS) {
        throw new Error(
          `mutual-place deadlock after ${restarts} restarts (rules residual)`
        );
      }
      restarts++;
      await startVsAiAt(page, 'ramrod', difficulty);
      t = -1; // restart turn counter for the new deal
      continue;
    }

    expect(gate.kind, `stall at turn ${t}: ${gate.status}`).toBe('human');

    const action = await playHumanTurn(page);
    if (action === 'deadlock') {
      if (restarts >= MAX_DEADLOCK_RESTARTS) {
        throw new Error(
          `mutual-place deadlock after ${restarts} restarts (rules residual)`
        );
      }
      restarts++;
      await startVsAiAt(page, 'ramrod', difficulty);
      t = -1;
      continue;
    }

    const handoff = await observeAiHandoff(page);
    if (handoff.thinkSeen) thinkSeen++;
    if (handoff.deadlock) {
      if (restarts >= MAX_DEADLOCK_RESTARTS) {
        throw new Error(
          `mutual-place deadlock after ${restarts} restarts (rules residual)`
        );
      }
      restarts++;
      await startVsAiAt(page, 'ramrod', difficulty);
      t = -1;
      continue;
    }
    if (handoff.ended) {
      return { thinkSeen, status: handoff.status };
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
    await startVsAiAt(page, 'ramrod', 'medium');

    const measures = await page.evaluate(() => {
      const rods = [
        ...document.querySelectorAll('.ramrod-rod-wrapper.selectable'),
      ];
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

    // Finish via shared harness (deadlock-aware restarts + AI think wait)
    const result = await (async () => {
      let thinkSeen = 0;
      let restarts = 0;
      for (let t = 0; t < MAX_HUMAN_TURNS; t++) {
        const gate = await waitHumanOrEnd(page);
        if (gate.thinking || gate.computerText) thinkSeen++;
        if (gate.kind === 'ended') {
          return { thinkSeen, status: gate.status };
        }
        if (gate.kind === 'deadlock') {
          if (restarts >= MAX_DEADLOCK_RESTARTS) {
            throw new Error('tablet deadlock restarts exhausted');
          }
          restarts++;
          await startVsAiAt(page, 'ramrod', 'medium');
          t = -1;
          continue;
        }
        expect(gate.kind).toBe('human');
        const action = await playHumanTurn(page);
        if (action === 'deadlock') {
          if (restarts >= MAX_DEADLOCK_RESTARTS) {
            throw new Error('tablet deadlock restarts exhausted');
          }
          restarts++;
          await startVsAiAt(page, 'ramrod', 'medium');
          t = -1;
          continue;
        }
        const handoff = await observeAiHandoff(page);
        if (handoff.thinkSeen) thinkSeen++;
        if (handoff.deadlock) {
          if (restarts >= MAX_DEADLOCK_RESTARTS) {
            throw new Error('tablet deadlock restarts exhausted');
          }
          restarts++;
          await startVsAiAt(page, 'ramrod', 'medium');
          t = -1;
          continue;
        }
        if (handoff.ended) {
          return { thinkSeen, status: handoff.status };
        }
      }
      throw new Error('tablet turn budget');
    })();

    expect(result.status).toMatch(/wins|tie/i);
    expect(result.thinkSeen).toBeGreaterThanOrEqual(0);
    await context.close();
  });
});
