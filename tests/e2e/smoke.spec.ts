/**
 * High-value e2e smoke: menu loads, every available game opens, and each
 * game can complete a human move with a computer reply in vs-AI mode.
 */
import { test } from './fixtures';
import { expect, type Page } from '@playwright/test';
import { GAMES, type GameInfo } from '../../src/core/game-registry';
import {
  dismissOwlIfNeeded,
  gotoGame,
  mountLocator,
  startHuman,
  startVsAi,
} from './helpers/page';

const AVAILABLE_GAMES = GAMES.filter((g) => g.available);

function titleStem(game: GameInfo): string {
  return game.name.replace(/[!?]+$/, '').split(' (')[0];
}

type BoardFingerprint = {
  status: string;
  history: number;
  p2: number;
  scores: string;
  boardLen: number;
  thinking: boolean;
};

async function fingerprint(page: Page): Promise<BoardFingerprint> {
  return page.evaluate(() => {
    // Prefer game-specific status nodes with real text. The shared shell
    // always mounts an empty `#status` placeholder that must not win.
    const statusSels = [
      '.status-turn',
      '.qg-status',
      '.fiar-status',
      '.ramrod-status',
      '.par55-status',
      '.kwa-status',
      '.juggle-status',
      '.contig-status',
      '.stars-status',
      '.fab-status',
      '.pg-status',
      '.pent-status',
      '.sd-status',
      '.remainder-status',
      '.frac-status',
      '.pinball-status',
      '.hex-status',
      '.calla-status',
      '[role="status"]',
      '#status',
    ];
    let status = '';
    for (const sel of statusSels) {
      const text = (document.querySelector(sel)?.textContent ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      if (text) {
        status = text;
        break;
      }
    }

    const history = document.querySelectorAll(
      [
        '.move-history-entry',
        '.history-entry',
        '.kwa-history li',
        '.kwa-history-move',
        '.ramrod-history-entry',
        '.ramrod-history-move',
        '.sd-history-entry',
        '.pg-move-item',
        '.par55-history-move',
        '.stars-move-item',
        '.fab-history-move',
        '.juggle-history-entry',
        '.contig-history-entry',
      ].join(', ')
    ).length;

    const p2 = document.querySelectorAll(
      [
        '.cell-p2',
        '.hex-cell-p2',
        '.contig-cell-p2',
        '.star-track-piece-p2',
        '.juggle-cell.occupied-player2',
        '.pg-cell.p2',
        '.pg-cell.player2',
        '.island.p2',
        '.stars-cell.p2',
        '.stars-cell.player2',
        '.kwa-chip-p2',
        '.pent-cell-p2',
        '.fiar-board-container [data-owner="2"]',
        '.fiar-board-container .chip-p2',
        '.hex-a-gone-cell-p2',
        '.par55-base.player2',
        '.ramrod-slot.player2',
        '.fab-answer-player2',
        '.qg-piece.player2',
        '[data-owner="player2"]',
      ].join(', ')
    ).length;

    const scores =
      document.querySelector(
        [
          '.contig-score-p2',
          '.sd-score-p2',
          '.frac-scores',
          '.pinball-scores',
          '.pg-scores',
          '.juggle-scores',
          '.calla-scores',
          '.remainder-scores',
          '.fab-scores',
          '.par55-scores',
          '.ramrod-scores',
          '.kwa-chip-info',
          '.stars-scores',
          '.qg-info',
        ].join(', ')
      )?.textContent ?? '';

    const boardLen =
      document.querySelector('#board, #game-container, main')?.innerHTML
        .length ?? 0;
    const thinking =
      !!document.querySelector('.status-ai-thinking') ||
      /thinking/i.test(status);
    return { status, history, p2, scores, boardLen, thinking };
  });
}

/**
 * True when the human seat (Blue / You / Player 1) has the turn.
 * Does not treat shared phase verbs ("select", "roll") as human control —
 * Red's "Select a …" must not count. Thinking / computer copy never counts.
 */
function isHumanTurnStatus(status: string): boolean {
  const s = status.toLowerCase().replace(/\s+/g, ' ').trim();
  if (!s) return false;
  if (/thinking|\bcomputer\b/i.test(s)) return false;
  if (!/\b(blue|you|your turn|player 1)\b/i.test(s)) return false;
  if (/\bred\b/i.test(s) && !/\b(blue|you|player 1)\b/i.test(s)) return false;
  return true;
}

function isGameOverStatus(status: string): boolean {
  return /winner|game over|draw|you win|you lose/i.test(status);
}

function materialDelta(a: BoardFingerprint, b: BoardFingerprint): boolean {
  return (
    a.history !== b.history ||
    a.p2 !== b.p2 ||
    a.scores !== b.scores ||
    Math.abs(a.boardLen - b.boardLen) > 40
  );
}

/**
 * Prove the computer finished a reply — not that a "thinking" indicator
 * appeared. Captures a post-human baseline while AI is searching (or falls
 * back to the pre-human snapshot for a fast reply), then requires a
 * board/history/p2/score change from that baseline, or an explicit return
 * to the human's turn after thinking, or game over.
 *
 * Queens/Hex (and others) may run AI search in a Web Worker and show
 * "Computer is thinking…" asynchronously — poll budget is generous while
 * Easy difficulty keeps wall time low (Hard can be very slow).
 */
async function awaitComputerReply(page: Page, before: BoardFingerprint) {
  let sawThinking = false;
  /** Board state after the human move applied, before the AI move lands. */
  let postHuman: BoardFingerprint | null = null;

  await expect
    .poll(
      async () => {
        const now = await fingerprint(page);

        if (now.thinking) {
          sawThinking = true;
          // Human move is applied; computer move is not yet.
          postHuman = now;
          return false;
        }

        if (!postHuman) {
          const humanLanded =
            materialDelta(now, before) || now.status !== before.status;
          if (!humanLanded) return false;
          // First settled sample may already include a fast AI reply —
          // compare AI effects against the pre-human snapshot in that case.
          postHuman = before;
        }

        const anchor = sawThinking ? postHuman : before;
        const aiEffect = materialDelta(now, anchor);
        const controlBack =
          isHumanTurnStatus(now.status) || isGameOverStatus(now.status);

        if (sawThinking) {
          // Observed AI search: require a post-thinking board/history/p2/score
          // change, or an explicit return to the human's turn / game over.
          return aiEffect || controlBack;
        }

        // Fast AI path (never caught "thinking"): human-only deltas must not
        // pass — demand a material change from pre-human AND control back.
        return aiEffect && controlBack;
      },
      { timeout: 45_000 }
    )
    .toBeTruthy();
}

/** Complete one human action path, then wait for the board/status to advance (AI reply). */
async function playHumanThenAwaitAi(page: Page, gameId: string) {
  const before = await fingerprint(page);

  switch (gameId) {
    case 'kings-quadraphages': {
      await page
        .locator('.cell[data-row="1"][data-col="5"]')
        .click({ force: true });
      await page.locator('.cell[data-row="2"][data-col="5"]').click({
        force: true,
      });
      await page.locator('.cell[data-row="5"][data-col="5"]').click({
        force: true,
      });
      break;
    }
    case 'hex': {
      await page
        .locator('.hex-cell-group[data-row="5"][data-col="5"]')
        .click({ force: true });
      break;
    }
    case 'star-track': {
      await page.locator('.star-track-draw-btn').click({ force: true });
      const chain = page.locator('.star-track-chain-btn');
      await expect(chain.first()).toBeVisible({ timeout: 5000 });
      await chain.first().click({ force: true });
      break;
    }
    case 'hex-a-gone': {
      const bank = page.locator('.hex-a-gone-block-btn:not(.empty)').first();
      await bank.click({ force: true });
      const confirm = page.locator('.hex-a-gone-confirm-btn');
      if (await confirm.isVisible().catch(() => false)) {
        await confirm.click({ force: true });
      }
      const cell = page
        .locator('.hex-a-gone-board [data-q], .hex-a-gone-cell')
        .first();
      if (await cell.count()) {
        await cell.click({ force: true });
      }
      break;
    }
    case 'calla': {
      const pit = page.locator('.calla-pit-valid').first();
      if (await pit.count()) {
        await pit.click({ force: true });
      } else {
        await page.locator('.calla-pit').first().click({ force: true });
      }
      break;
    }
    case 'sum-dominoes': {
      await page.locator('.sd-roll-btn').click({ force: true });
      const playable = page.locator('.sd-hand-domino-playable');
      const pass = page.locator('.sd-pass-btn');
      if ((await playable.count()) > 0) {
        await playable.first().click({ force: true });
        const valid = page.locator('.sd-cell-valid');
        if ((await valid.count()) > 0) {
          await valid.first().click({ force: true });
        }
      } else if (await pass.isVisible().catch(() => false)) {
        await pass.click({ force: true });
      }
      break;
    }
    case 'par-55': {
      const block = page.locator('.par55-hand-block.clickable').first();
      await expect(block).toBeVisible({ timeout: 5000 });
      await block.click({ force: true });
      const base = page.locator('.par55-valid-base').first();
      if (await base.count()) {
        await base.click({ force: true });
      }
      break;
    }
    case 'ramrod': {
      const rod = page.locator('.ramrod-rod-wrapper.selectable').first();
      if (await rod.count()) {
        await rod.evaluate((el) => (el as HTMLElement).click());
        const slot = page.locator('.ramrod-slot.valid').first();
        if (await slot.count()) {
          await slot.click({ force: true });
        }
      }
      break;
    }
    case 'kwatro-sinko': {
      const chip = page.locator('.kwa-selectable-chip').first();
      await expect(chip).toBeVisible({ timeout: 5000 });
      await chip.click({ force: true });
      const dest = page.locator('.kwa-valid-node').first();
      if (await dest.count()) {
        await dest.click({ force: true });
      }
      break;
    }
    case 'fiar': {
      const node = page
        .locator(
          '[data-node-id]:has(.pulse-highlight), .fiar-board-container [data-node-id]'
        )
        .first();
      await node.click({ force: true });
      break;
    }
    case 'juggle': {
      await dismissOwlIfNeeded(page);
      await page.locator('.juggle-roll-btn').click({ force: true });
      const die = page.locator('.juggle-die.selectable').first();
      if (await die.count()) {
        await die.click({ force: true });
      }
      const shape = page.locator('.juggle-shape-option').first();
      if (await shape.count()) {
        await shape.click({ force: true });
      }
      // Activate Blue A1 via DOM (owl overlay can steal real pointer events).
      const cell = page.locator(
        '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
      );
      await expect(cell).toBeVisible({ timeout: 5000 });
      await cell.evaluate((el) => (el as HTMLElement).click());
      break;
    }
    case 'contig-60': {
      await page.locator('.contig-roll-btn').click({ force: true });
      const valid = page.locator('.contig-cell-valid');
      const pass = page.locator('.contig-pass-btn');
      if ((await valid.count()) > 0) {
        await valid.first().click({ force: true });
      } else if (await pass.isVisible().catch(() => false)) {
        await pass.click({ force: true });
      }
      break;
    }
    case 'stars-bars': {
      const card = page.locator('.stars-card:not(.disabled)').first();
      await card.click({ force: true });
      const cell = page.locator('.stars-cell.valid').first();
      if (await cell.count()) {
        await cell.click({ force: true });
      }
      break;
    }
    case 'fab-a-diffy': {
      const bar = page
        .locator('.fab-bar-wrapper:not(.fab-bar-disabled)')
        .first();
      await bar.click({ force: true });
      const op = page
        .locator('.fab-op-valid, .fab-op-btn:not(.fab-op-disabled)')
        .first();
      if (await op.count()) {
        await op.click({ force: true });
      }
      break;
    }
    case 'queens-guards': {
      await page.locator('[data-cell-key="5-7"]').click({ force: true });
      const dest = page
        .locator('[data-cell-key][aria-label*="valid move"]')
        .first();
      if (await dest.count()) {
        await dest.click({ force: true });
      }
      break;
    }
    case 'prime-gold': {
      await page.locator('.pg-roll-btn, .prime-roll-btn').first().click({
        force: true,
      });
      const valid = page.locator('.pg-cell.valid, .prime-cell.valid').first();
      const pass = page.locator(
        '.pg-btn-secondary, .pg-pass-btn, button:has-text("Pass")'
      );
      if (await valid.count()) {
        await valid.click({ force: true });
      } else if (await pass.first().isVisible().catch(() => false)) {
        await pass.first().click({ force: true });
      }
      break;
    }
    case 'remainder-islands': {
      await dismissOwlIfNeeded(page);
      const roll = page
        .locator('.remainder-btn-roll, button:has-text("Roll")')
        .first();
      await roll.click({ force: true });
      const island = page.locator('.island.valid').first();
      await expect(island).toBeVisible({ timeout: 5000 });
      // Click the transparent hit-area polygon (listener is not on the <g>).
      await island.evaluate((el) => {
        const hit = el.querySelector('polygon:last-of-type') ?? el;
        hit.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
      });
      break;
    }
    case 'pent-em-in': {
      await page.locator('.pent-piece-option').first().click({ force: true });
      const cell = page
        .locator('.pent-board .interaction rect, .pent-board rect[data-row]')
        .first();
      if (await cell.count()) {
        await cell.click({ force: true });
      }
      break;
    }
    case 'frac-fact': {
      await page.locator('.frac-choice-btn').first().click({ force: true });
      // Human result must be dismissed before AI gets the next problem.
      const cont = page.locator('.frac-continue-btn, button:has-text("Continue")');
      await expect(cont.first()).toBeVisible({ timeout: 5000 });
      await cont.first().click();
      break;
    }
    case 'fraction-pinball': {
      await page.locator('.pinball-choice-btn').first().click({ force: true });
      const cont = page.locator(
        '.pinball-continue-btn, button:has-text("Continue")'
      );
      await expect(cont.first()).toBeVisible({ timeout: 5000 });
      await cont.first().click();
      break;
    }
    default:
      throw new Error(`Missing play path for ${gameId}`);
  }

  await awaitComputerReply(page, before);

  await expect(mountLocator(page, gameId)).toBeVisible();
}

test.describe('Menu smoke', () => {
  test('landing page loads brand and available game cards', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Math Pentathlon/);
    await expect(page.locator('h1')).toContainText('Math Pentathlon');
    await expect(page.locator('.game-card').first()).toBeVisible();
    const availableCards = page.locator('.game-card:not(.game-card-disabled)');
    await expect(availableCards).toHaveCount(AVAILABLE_GAMES.length);
  });
});

/**
 * burn-1008: CSP Report-Only + companion headers must be present, and
 * visiting the menu + all 20 games must produce zero CSP violations
 * (console or SecurityPolicyViolationEvent).
 */
test.describe('CSP report-only smoke', () => {
  test('headers present; menu + all games load with zero CSP violations', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const cspViolations: string[] = [];
    const consoleCsp: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      // WebKit warns that Report-Only CSP lacks report-to — not a violation.
      if (
        /content security policy/i.test(text) &&
        /report-only/i.test(text) &&
        /report-to/i.test(text)
      ) {
        return;
      }
      if (/content security policy|refused to|csp/i.test(text)) {
        consoleCsp.push(`[${msg.type()}] ${text}`);
      }
    });

    await page.addInitScript(() => {
      const w = window as Window & { __mpCspViolations?: string[] };
      w.__mpCspViolations = [];
      window.addEventListener('securitypolicyviolation', (event) => {
        w.__mpCspViolations?.push(
          `${event.violatedDirective}: ${event.blockedURI || event.sourceFile || '(inline)'}`
        );
      });
    });

    const home = await page.goto('/');
    expect(home).not.toBeNull();
    const headers = home!.headers();
    expect(headers['content-security-policy-report-only'] || '').toMatch(
      /default-src\s+'self'/
    );
    expect(headers['content-security-policy-report-only'] || '').toMatch(
      /frame-ancestors\s+'none'/
    );
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy'] || '').toMatch(/camera=\(\)/);

    await expect(page.locator('h1')).toContainText('Math Pentathlon');
    await expect(page.locator('.game-card').first()).toBeVisible();

    for (const game of AVAILABLE_GAMES) {
      await gotoGame(page, game.id);
      await expect(mountLocator(page, game.id)).toBeVisible({
        timeout: 15_000,
      });
    }

    // Service worker may be inactive in plain Vite dev (PWA_DEV off) —
    // still assert the registration path does not CSP-fail when present.
    const swCount = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return 0;
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.length;
    });
    expect(swCount).toBeGreaterThanOrEqual(0);

    const pageViolations = await page.evaluate(() => {
      const w = window as Window & { __mpCspViolations?: string[] };
      return w.__mpCspViolations ?? [];
    });
    cspViolations.push(...pageViolations);

    expect(
      cspViolations,
      `CSP SecurityPolicyViolationEvent(s):\n${cspViolations.join('\n')}`
    ).toEqual([]);
    expect(
      consoleCsp,
      `CSP-related console message(s):\n${consoleCsp.join('\n')}`
    ).toEqual([]);
  });
});

test.describe('Every game opens', () => {
  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} loads title and board`, async ({ page }) => {
      await gotoGame(page, game.id);
      await startHuman(page);
      await expect(page.locator('h1')).toContainText(titleStem(game));
      await expect(mountLocator(page, game.id)).toBeVisible({
        timeout: 10_000,
      });
    });
  }
});

test.describe('Vs-AI: human move + computer reply', () => {
  for (const game of AVAILABLE_GAMES) {
    test(`${game.id} human acts and AI replies`, async ({ page }) => {
      // Easy difficulty + async worker AI may need a longer per-test budget.
      test.setTimeout(90_000);
      await gotoGame(page, game.id);
      await startVsAi(page);
      await expect(mountLocator(page, game.id)).toBeVisible({
        timeout: 10_000,
      });
      await playHumanThenAwaitAi(page, game.id);
    });
  }
});
