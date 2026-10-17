/**
 * Hermetic coverage for fab-a-diffy deep harness honesty:
 *   q-mp-1484 tip-real AI seat (no missing `.status-ai-thinking`)
 *   q-mp-1485 `ok` requires real end — progress alone does not pass
 * No Playwright launch. Stays on unit-shared (jsdom) so vitest.config
 * nodePureFiles need not change for this harness-only ticket.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  FAB_STATUS_AI_THINKING_SELECTOR,
  FAB_TIP_EMITS_STATUS_AI_THINKING,
  evaluateFabDeepGameOk,
  isFabAiSeatFromStatus,
  isFabExplicitEndStatus,
  isFabHumanSeatFromStatus,
} from '../playtest/fab-a-diffy-env.mjs';

const FAB_PLAYTEST = resolve(
  process.cwd(),
  'tests/playtest/fab-a-diffy-deep.mjs'
);

function readHarness(): string {
  return readFileSync(FAB_PLAYTEST, 'utf8');
}

describe('q-mp-1484 tip-real AI seat — no missing status-ai-thinking', () => {
  it('documents that tip does not emit status-ai-thinking chrome', () => {
    expect(FAB_TIP_EMITS_STATUS_AI_THINKING).toBe(false);
    expect(FAB_STATUS_AI_THINKING_SELECTOR).toBe(
      '.fab-status.status-ai-thinking'
    );
  });

  it('detects AI seat from tip-real player2 class / Red turn text', () => {
    expect(
      isFabAiSeatFromStatus({
        className: 'fab-status player2',
        text: "🔴 Red's turn - Select first fraction bar",
      })
    ).toBe(true);
    expect(
      isFabAiSeatFromStatus({
        className: 'fab-status player1',
        text: "🔵 Blue's turn - Select first fraction bar",
      })
    ).toBe(false);
    expect(
      isFabAiSeatFromStatus({
        className: 'fab-status player2',
        text: '🔴 Red wins!',
      })
    ).toBe(false);
    expect(
      isFabAiSeatFromStatus({
        className: 'fab-status',
        text: "Computer's turn - Choose an operation",
      })
    ).toBe(true);
  });

  it('detects human seat / end from tip-real player1 / Blue / wins', () => {
    expect(
      isFabHumanSeatFromStatus({
        className: 'fab-status player1',
        text: "🔵 Blue's turn - Select first fraction bar",
      })
    ).toBe(true);
    expect(
      isFabHumanSeatFromStatus({
        className: 'fab-status player2',
        text: "🔴 Red's turn - Select first fraction bar",
      })
    ).toBe(false);
    expect(
      isFabHumanSeatFromStatus({
        className: 'fab-status player1',
        text: '🔵 Blue wins!',
      })
    ).toBe(true);
  });

  it('harness wires tip-real waits — no live .status-ai-thinking / waitNotThinking', () => {
    const src = readHarness();
    expect(src).toMatch(/waitForHumanSeatOrEnd/);
    expect(src).toMatch(/waitAfterHumanPly/);
    expect(src).toMatch(/isFabAiSeatFromStatus/);
    expect(src).toMatch(/FAB_TIP_EMITS_STATUS_AI_THINKING/);
    expect(src).toMatch(/evaluateFabDeepGameOk/);
    // Dead product-chrome selectors must not drive wait / lock / stall.
    expect(src).not.toMatch(/waitNotThinking/);
    expect(src).not.toMatch(
      /\.locator\(\s*['"]\.fab-status\.status-ai-thinking['"]\s*\)/
    );
    expect(src).not.toMatch(
      /querySelector\(\s*['"]\.fab-status\.status-ai-thinking['"]\s*\)/
    );
  });
});

describe('q-mp-1485 ok requires real end — no soft-pass on progress', () => {
  it('explicit end status helper', () => {
    expect(isFabExplicitEndStatus('🔵 Blue wins!')).toBe(true);
    expect(isFabExplicitEndStatus('🔴 Red wins!')).toBe(true);
    expect(
      isFabExplicitEndStatus("🔵 Blue's turn - Select first fraction bar")
    ).toBe(false);
    expect(isFabExplicitEndStatus('')).toBe(false);
    expect(isFabExplicitEndStatus(null)).toBe(false);
  });

  it('incomplete progress-only games are not ok', () => {
    // Measured baseline: history=3, claims=2, winnerVisible=false → was soft-ok.
    const soft = evaluateFabDeepGameOk({
      stalls: 0,
      pageErrors: [],
      consoleErrors: [],
      winnerVisible: false,
      status: "🔵 Blue's turn - Select first fraction bar",
      history: 3,
      claims: 2,
      passes: 0,
    });
    expect(soft.ok).toBe(false);
    expect(soft.incomplete).toBe(true);
    expect(soft.ended).toBe(false);
  });

  it('zero-progress incomplete stays not ok', () => {
    const zero = evaluateFabDeepGameOk({
      stalls: 0,
      pageErrors: [],
      consoleErrors: [],
      winnerVisible: false,
      status: "🔵 Blue's turn - Select first fraction bar",
      history: 0,
      claims: 0,
      passes: 0,
    });
    expect(zero.ok).toBe(false);
    expect(zero.incomplete).toBe(true);
  });

  it('winner banner or explicit end status → ok when clean', () => {
    expect(
      evaluateFabDeepGameOk({
        stalls: 0,
        pageErrors: [],
        consoleErrors: [],
        winnerVisible: true,
        status: '🔵 Blue wins!',
        history: 5,
        claims: 3,
        passes: 1,
      })
    ).toEqual({ ok: true, incomplete: false, ended: true });

    expect(
      evaluateFabDeepGameOk({
        stalls: 0,
        pageErrors: [],
        consoleErrors: [],
        winnerVisible: false,
        status: '🔴 Red wins!',
        history: 4,
        claims: 2,
        passes: 2,
      })
    ).toEqual({ ok: true, incomplete: false, ended: true });
  });

  it('stalls / pageErrors / lock-stall console errors keep ok false', () => {
    expect(
      evaluateFabDeepGameOk({
        stalls: 1,
        pageErrors: [],
        consoleErrors: [],
        winnerVisible: true,
        status: '🔵 Blue wins!',
      }).ok
    ).toBe(false);

    expect(
      evaluateFabDeepGameOk({
        stalls: 0,
        pageErrors: ['boom'],
        consoleErrors: [],
        winnerVisible: true,
        status: '🔵 Blue wins!',
      }).ok
    ).toBe(false);

    expect(
      evaluateFabDeepGameOk({
        stalls: 0,
        pageErrors: [],
        consoleErrors: ['AI think stall (>30s)'],
        winnerVisible: true,
        status: '🔵 Blue wins!',
      }).ok
    ).toBe(false);

    expect(
      evaluateFabDeepGameOk({
        stalls: 0,
        pageErrors: [],
        consoleErrors: ['AI-seat lock failed: selectable bars while thinking'],
        winnerVisible: true,
        status: '🔵 Blue wins!',
      }).ok
    ).toBe(false);
  });

  it('harness uses evaluateFabDeepGameOk — no progress-only soft-ok predicate', () => {
    const src = readHarness();
    expect(src).toMatch(/evaluateFabDeepGameOk\s*\(/);
    expect(src).toMatch(/incomplete:\s*verdict\.incomplete/);
    expect(src).toMatch(/ok:\s*verdict\.ok/);
    // Old soft-ok: winnerVisible || history > 0 || claims + passes > 0
    expect(src).not.toMatch(
      /winnerVisible\s*\|\|\s*history\s*>\s*0\s*\|\|\s*claims\s*\+\s*passes\s*>\s*0/
    );
  });
});
