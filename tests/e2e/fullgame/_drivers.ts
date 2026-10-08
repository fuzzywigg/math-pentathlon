/**
 * Per-game UI drivers for HvH full-game e2e (clicks only).
 */
import type { Page } from '@playwright/test';
import { clickDom, dismissOwl, readStatusText } from './_helpers';

export type GameDriver = {
  id: string;
  title: string;
  mount: string;
  gameOver: string;
  /** Attempt one legal turn for whichever seat is active. */
  playLegal: (page: Page) => Promise<boolean>;
  /** Attempt an illegal action; should not advance the game. */
  tryIllegal: (page: Page) => Promise<void>;
  maxTurns: number;
};

async function sleep(page: Page, ms: number): Promise<void> {
  await page.waitForTimeout(ms);
}

async function clickFirst(page: Page, selector: string): Promise<boolean> {
  return clickDom(page, selector, 0);
}

async function passIfVisible(page: Page, selector: string): Promise<boolean> {
  const loc = page.locator(selector).first();
  if (await loc.isVisible().catch(() => false)) {
    await loc.click({ force: true });
    return true;
  }
  return false;
}

const drivers: GameDriver[] = [
  {
    id: 'kings-quadraphages',
    title: 'Kings & Quadraphages',
    mount: '.board.kings-board .cell',
    gameOver: '.status-winner, .status-turn',
    maxTurns: 120,
    playLegal: async (page) => {
      const status = await readStatusText(page);
      if (/win|tie|game over/i.test(status)) return false;
      // Active seat king: p1 or p2 depending on status.
      const p2 = /\bPlayer 2\b|\bRed\b/i.test(status);
      const kingSel = p2 ? '.cell-king.cell-p2' : '.cell-king.cell-p1';
      if (!(await page.locator('.cell-selected').count())) {
        await clickFirst(page, kingSel);
        await sleep(page, 30);
      }
      if (await clickFirst(page, '.cell-valid-move')) {
        await sleep(page, 30);
        if (await clickFirst(page, '.cell-valid-placement')) return true;
      }
      // Clear selection and retry other seat wording
      await clickFirst(page, kingSel);
      return false;
    },
    tryIllegal: async (page) => {
      // Occupied/far cell without selection — should not place.
      await clickDom(page, '.cell[data-row="0"][data-col="0"]', 0);
    },
  },
  {
    id: 'hex',
    title: 'Hex',
    mount: 'svg.hex-board',
    gameOver: '.status-winner',
    maxTurns: 130,
    playLegal: async (page) => {
      return page.evaluate(() => {
        const empties = [
          ...document.querySelectorAll('.hex-cell-group'),
        ].filter((g) => g.querySelector('.hex-cell-empty'));
        if (!empties.length) return false;
        // Prefer center-ish for shorter connecting games under greedy play.
        empties.sort((a, b) => {
          const ar = +a.getAttribute('data-row')!;
          const ac = +a.getAttribute('data-col')!;
          const br = +b.getAttribute('data-row')!;
          const bc = +b.getAttribute('data-col')!;
          return Math.abs(ac - 5) + Math.abs(ar - 5) - (Math.abs(bc - 5) + Math.abs(br - 5));
        });
        empties[0]?.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
        return true;
      });
    },
    tryIllegal: async (page) => {
      // Click an occupied cell if any; else click board chrome.
      await page.evaluate(() => {
        const filled = [...document.querySelectorAll('.hex-cell-group')].find(
          (g) => !g.querySelector('.hex-cell-empty')
        );
        (filled ?? document.querySelector('svg.hex-board'))?.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
      });
    },
  },
  {
    id: 'star-track',
    title: 'Star Track',
    mount: '.star-track-board',
    gameOver: '.star-track-winner, .status-winner',
    maxTurns: 40,
    playLegal: async (page) => {
      if (await passIfVisible(page, '.star-track-draw-btn')) {
        await sleep(page, 40);
      }
      return clickFirst(page, '.star-track-chain-btn');
    },
    tryIllegal: async (page) => {
      // Chain click without draw / when disabled.
      await clickDom(page, '.star-track-board', 0);
    },
  },
  {
    id: 'hex-a-gone',
    title: 'Hex-a-Gone!',
    mount: 'svg.hex-a-gone-board, .hex-a-gone-wrapper',
    gameOver: '.hex-a-gone-winner, .status-winner',
    maxTurns: 160,
    playLegal: async (page) => {
      return page.evaluate(() => {
        const click = (el: Element | null | undefined) =>
          el?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        const bank = document.querySelector(
          '.hex-a-gone-block-btn:not(.empty)'
        );
        if (!bank) return false;
        click(bank);
        const confirm = document.querySelector(
          '.hex-a-gone-confirm-btn:not([disabled])'
        );
        click(confirm);
        const valid = document.querySelector('.hex-a-gone-cell-valid');
        if (valid) {
          click(valid);
          return true;
        }
        const any = document.querySelector(
          '.hex-a-gone-cell[data-q], .hex-a-gone-board [data-q]'
        );
        click(any);
        return !!any;
      });
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.hex-a-gone-block-btn.empty');
    },
  },
  {
    id: 'calla',
    title: 'Calla',
    mount: '.calla-wrapper, .calla-board',
    gameOver: '.status-winner',
    maxTurns: 100,
    playLegal: async (page) => clickFirst(page, '.calla-pit-valid'),
    tryIllegal: async (page) => {
      // Opponent / non-valid pit
      await page.evaluate(() => {
        const bad = [...document.querySelectorAll('.calla-pit')].find(
          (p) => !p.classList.contains('calla-pit-valid')
        );
        bad?.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
      });
    },
  },
  {
    id: 'sum-dominoes',
    title: 'Sum Dominoes & Dice',
    mount: '.sd-board',
    gameOver: '.sd-winner-banner, .sd-status',
    maxTurns: 80,
    playLegal: async (page) => {
      await dismissOwl(page);
      if (await passIfVisible(page, '.sd-roll-btn:not([disabled])')) {
        await sleep(page, 50);
      }
      if (await clickFirst(page, '.sd-hand-domino-playable')) {
        await sleep(page, 40);
        if (await clickFirst(page, '.sd-cell-valid')) return true;
      }
      if (await passIfVisible(page, '.sd-pass-btn')) return true;
      return false;
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.sd-cell:not(.sd-cell-valid)');
    },
  },
  {
    id: 'par-55',
    title: 'Par 55',
    mount: '.par55-board',
    gameOver: '.par55-winner-banner',
    maxTurns: 60,
    playLegal: async (page) => {
      if (await clickFirst(page, '.par55-hand-block.clickable')) {
        await sleep(page, 40);
        if (await clickFirst(page, '.par55-valid-base, .par55-base-hit')) {
          return true;
        }
      }
      return passIfVisible(page, '.par55-controls .par55-btn');
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.par55-base:not(.par55-valid-base)');
    },
  },
  {
    id: 'ramrod',
    title: 'Ramrod',
    mount: '.ramrod-board',
    gameOver: '.ramrod-winner-banner',
    maxTurns: 80,
    playLegal: async (page) => {
      if (await page.locator('.ramrod-deadlock-hint').count()) return false;
      return page.evaluate(() => {
        const click = (el: Element | null | undefined) =>
          el?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        const pass = [...document.querySelectorAll('.ramrod-btn-secondary')].find(
          (b) => b.textContent?.includes('Pass Turn')
        );
        if (pass) {
          click(pass);
          return true;
        }
        const rods = [
          ...document.querySelectorAll('.ramrod-rod-wrapper.selectable'),
        ];
        for (const rod of rods) {
          click(rod);
          const valids = [...document.querySelectorAll('.ramrod-slot.valid')];
          if (valids.length) {
            click(valids[0]);
            return true;
          }
          const clear = [
            ...document.querySelectorAll('.ramrod-btn-secondary'),
          ].find((b) => b.textContent?.includes('Clear Selection'));
          click(clear);
        }
        return false;
      });
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.ramrod-slot:not(.valid)');
    },
  },
  {
    id: 'kwatro-sinko',
    title: 'Kwatro-Sinko',
    mount: '.kwa-board',
    gameOver: '.kwa-winner-banner',
    maxTurns: 80,
    playLegal: async (page) => {
      if (await clickFirst(page, '.kwa-selectable-chip')) {
        await sleep(page, 40);
        if (await clickFirst(page, '.kwa-valid-node')) return true;
        await passIfVisible(page, '.kwa-btn-secondary');
      }
      return false;
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '[data-node-id]:not(.kwa-valid-node)');
    },
  },
  {
    id: 'fiar',
    title: 'FIAR',
    mount: '.fiar-board-container',
    gameOver: '.fiar-winner-banner',
    maxTurns: 80,
    playLegal: async (page) => {
      // Chip kind picker if present
      await clickFirst(page, '.fiar-chip-kind-picker button, .fiar-chip-kind button');
      if (await clickFirst(page, '.pulse-highlight')) return true;
      // Movement: select own chip then green node
      const moved = await page.evaluate(() => {
        const click = (el: Element | null | undefined) =>
          el?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        const chip = document.querySelector(
          '.fiar-board-container [data-owner], .chip-p1, .chip-p2, .fiar-chip'
        );
        click(chip);
        const dest = document.querySelector(
          '.fiar-board-container .pulse-highlight, .fiar-valid-node, [data-node-id].valid'
        );
        if (dest) {
          click(dest);
          return true;
        }
        const node = document.querySelector(
          '.fiar-board-container [data-node-id]'
        );
        click(node);
        return !!node;
      });
      return moved;
    },
    tryIllegal: async (page) => {
      await clickDom(page, '.fiar-board-container', 0);
    },
  },
  {
    id: 'juggle',
    title: 'Juggle',
    mount: '.juggle-board',
    gameOver: '.juggle-winner-banner',
    maxTurns: 200,
    playLegal: async (page) => {
      await dismissOwl(page);
      await passIfVisible(page, '.juggle-roll-btn:not([disabled])');
      await sleep(page, 40);
      await clickFirst(page, '.juggle-die.selectable');
      await sleep(page, 30);
      await clickFirst(page, '.juggle-shape-option');
      await sleep(page, 30);
      // Prefer valid cell on active board
      if (await clickFirst(page, '.juggle-cell-valid')) return true;
      return page.evaluate(() => {
        const cell = document.querySelector(
          '.juggle-board.player1 .juggle-cell, .juggle-board.player2 .juggle-cell'
        );
        cell?.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
        return !!cell;
      });
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.juggle-cell:not(.juggle-cell-valid)');
    },
  },
  {
    id: 'contig-60',
    title: 'Contig 60',
    mount: '.contig-board',
    gameOver: '.contig-winner-banner, .game-winner-banner',
    maxTurns: 120,
    playLegal: async (page) => {
      await passIfVisible(page, '.contig-roll-btn:not([disabled])');
      await sleep(page, 50);
      if (await clickFirst(page, '.contig-cell-valid')) return true;
      if (await clickFirst(page, '.contig-expr-option')) {
        await sleep(page, 30);
        if (await clickFirst(page, '.contig-cell-valid')) return true;
      }
      return passIfVisible(page, '.contig-pass-btn');
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.contig-cell:not(.contig-cell-valid)');
    },
  },
  {
    id: 'stars-bars',
    title: 'Stars & Bars',
    mount: '.stars-board',
    gameOver: '.stars-winner-banner',
    maxTurns: 80,
    playLegal: async (page) => {
      if (await clickFirst(page, '.stars-card:not(.disabled)')) {
        await sleep(page, 40);
        if (await clickFirst(page, '.stars-cell.valid')) return true;
      }
      return passIfVisible(page, '.stars-pass-btn');
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.stars-card.disabled');
    },
  },
  {
    id: 'fab-a-diffy',
    title: 'Fab-a-Diffy',
    mount: '.fab-bar-pool, .fab-answer-board',
    gameOver: '.fab-winner-banner',
    maxTurns: 60,
    playLegal: async (page) => {
      if (await passIfVisible(page, '.fab-btn-secondary:has-text("Pass Turn")')) {
        return true;
      }
      return page.evaluate(() => {
        const click = (el: Element | null | undefined) =>
          el?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        const clear = [...document.querySelectorAll('.fab-btn-secondary')].find(
          (b) => b.textContent?.includes('Clear Selection')
        );
        click(clear);
        const bars = [
          ...document.querySelectorAll(
            '.fab-bar-wrapper:not(.fab-bar-disabled)'
          ),
        ];
        for (let i = 0; i < Math.min(bars.length, 6); i++) {
          for (let j = 0; j < Math.min(bars.length, 6); j++) {
            if (i === j) continue;
            click(clear);
            click(bars[i]);
            click(bars[j]);
            const op = document.querySelector('.fab-op-valid');
            if (!op) continue;
            click(op);
            const ans = document.querySelector('.fab-answer-matchable');
            if (ans) {
              click(ans);
              return true;
            }
          }
        }
        const pass = [...document.querySelectorAll('.fab-btn-secondary')].find(
          (b) => b.textContent?.includes('Pass Turn')
        );
        if (pass) {
          click(pass);
          return true;
        }
        return false;
      });
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.fab-bar-wrapper.fab-bar-disabled');
    },
  },
  {
    id: 'queens-guards',
    title: 'Queens & Guards',
    mount: '.qg-board-container svg.qg-board',
    gameOver: '.qg-winner-banner',
    maxTurns: 100,
    playLegal: async (page) => {
      return page.evaluate(() => {
        const click = (el: Element | null | undefined) =>
          el?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        const status = (
          document.querySelector('.qg-status')?.textContent || ''
        ).toLowerCase();
        const seat = status.includes('red') ? 'Red' : 'Blue';
        const pieces = [
          ...document.querySelectorAll(
            `.qg-board-container svg g[aria-label*="${seat}"]`
          ),
        ];
        for (const p of pieces) {
          click(p);
          const dest = document.querySelector(
            '.qg-board-container svg g[aria-label*="valid move"]'
          );
          if (dest) {
            click(dest);
            return true;
          }
        }
        return false;
      });
    },
    tryIllegal: async (page) => {
      await page.evaluate(() => {
        const status = (
          document.querySelector('.qg-status')?.textContent || ''
        ).toLowerCase();
        const wrong = status.includes('red') ? 'Blue' : 'Red';
        const piece = document.querySelector(
          `.qg-board-container svg g[aria-label*="${wrong}"]`
        );
        piece?.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
      });
    },
  },
  {
    id: 'prime-gold',
    title: 'Prime Gold',
    mount: '.pg-board, .prime-board',
    gameOver: '.pg-winner-banner',
    maxTurns: 80,
    playLegal: async (page) => {
      await passIfVisible(page, '.pg-roll-btn:not([disabled]), .prime-roll-btn:not([disabled])');
      await sleep(page, 50);
      if (await clickFirst(page, '.pg-cell.valid, .prime-cell.valid')) return true;
      return passIfVisible(
        page,
        '.pg-pass-btn, .pg-btn-secondary, button:has-text("Pass")'
      );
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.pg-cell:not(.valid), .prime-cell:not(.valid)');
    },
  },
  {
    id: 'remainder-islands',
    title: 'Remainder Islands',
    mount: '.remainder-board',
    gameOver: '.remainder-winner-banner',
    maxTurns: 80,
    playLegal: async (page) => {
      await dismissOwl(page);
      await passIfVisible(
        page,
        '.remainder-btn-roll:not([disabled]), button:has-text("Roll")'
      );
      await sleep(page, 50);
      return page.evaluate(() => {
        const island = document.querySelector('.island.valid');
        if (!island) return false;
        const hit = island.querySelector('polygon:last-of-type') ?? island;
        hit.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
        return true;
      });
    },
    tryIllegal: async (page) => {
      await page.evaluate(() => {
        const bad = [...document.querySelectorAll('.island')].find(
          (i) => !i.classList.contains('valid')
        );
        const hit = bad?.querySelector('polygon:last-of-type') ?? bad;
        hit?.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
      });
    },
  },
  {
    id: 'pent-em-in',
    title: "Pent'Em In",
    mount: '.pent-board',
    gameOver: '.pent-winner-banner',
    maxTurns: 60,
    playLegal: async (page) => {
      await clickFirst(page, '.pent-piece-option:not(.disabled)');
      await sleep(page, 40);
      if (await clickFirst(page, '.pent-cell-valid')) return true;
      return page.evaluate(() => {
        const cell = document.querySelector(
          '.pent-board .interaction rect, .pent-board rect[data-row], .pent-cell-valid'
        );
        cell?.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
        return !!cell;
      });
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.pent-piece-option.disabled');
    },
  },
  {
    id: 'frac-fact',
    title: 'Frac Fact',
    mount: '.frac-problem, .frac-choice-btn, .frac-game-container',
    gameOver: '.frac-winner-banner',
    maxTurns: 40,
    playLegal: async (page) => {
      if (await passIfVisible(page, '.frac-continue-btn')) return true;
      if (await clickFirst(page, '.frac-choice-btn:not([disabled])')) {
        await sleep(page, 40);
        await passIfVisible(page, '.frac-continue-btn');
        return true;
      }
      return false;
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.frac-choice-btn[disabled]');
    },
  },
  {
    id: 'fraction-pinball',
    title: 'Fraction Pinball',
    mount: '.pinball-game-container, .pinball-choice-btn',
    gameOver: '.pinball-game-over, .pinball-winner-banner',
    maxTurns: 40,
    playLegal: async (page) => {
      if (await passIfVisible(page, '.pinball-continue-btn')) return true;
      if (await clickFirst(page, '.pinball-choice-btn:not([disabled])')) {
        await sleep(page, 40);
        await passIfVisible(page, '.pinball-continue-btn');
        return true;
      }
      return false;
    },
    tryIllegal: async (page) => {
      await clickFirst(page, '.pinball-choice-btn[disabled]');
    },
  },
];

export const FULLGAME_DRIVERS: Record<string, GameDriver> = Object.fromEntries(
  drivers.map((d) => [d.id, d])
);

export const FULLGAME_IDS = drivers.map((d) => d.id);

export function getDriver(gameId: string): GameDriver {
  const d = FULLGAME_DRIVERS[gameId];
  if (!d) throw new Error(`No fullgame driver for ${gameId}`);
  return d;
}
