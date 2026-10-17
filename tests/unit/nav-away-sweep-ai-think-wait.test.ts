/**
 * q-mp-1482: nav-away mid-AI leave must wait for thinking chrome (not 100ms sleep).
 * Hermetic stubbed visibility/status sequences + harness wiring (no Playwright).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AI_THINK_POLL_MS,
  AI_THINK_WAIT_MS,
  sampleShowsAiThinking,
  waitForAiThinkingChrome,
  waitForAiThinkingChromeFromSequence,
} from '../../scripts/lib/stars-bars-new-game-race.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/nav-away-sweep.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/stars-bars-new-game-race.mjs');

describe('nav-away sampleShowsAiThinking reuse (q-mp-1482)', () => {
  it('accepts .status-ai-thinking chrome or computer|thinking status', () => {
    expect(sampleShowsAiThinking({ thinking: true, status: '' })).toBe(true);
    expect(
      sampleShowsAiThinking({
        thinking: false,
        status: 'Computer is thinking...',
      })
    ).toBe(true);
    expect(
      sampleShowsAiThinking({ thinking: false, status: 'Your turn — Select' })
    ).toBe(false);
  });
});

describe('nav-away waitForAiThinkingChrome stubbed sequences (q-mp-1482)', () => {
  it('sees thinking after delayed chrome (not a single 100ms sample)', async () => {
    // Historic race: one sample after 100ms often missed the flash.
    const result = await waitForAiThinkingChromeFromSequence([
      { thinking: false, status: 'Your turn — Select' },
      { thinking: false, status: 'Your turn — Select' },
      { thinking: true, status: 'Computer is thinking...' },
    ]);
    expect(result).toEqual({ sawThinking: true, reason: 'thinking' });
  });

  it('accepts computer|thinking status without chrome class', async () => {
    const result = await waitForAiThinkingChromeFromSequence([
      { thinking: false, status: '' },
      { thinking: false, status: 'Computer is thinking...' },
    ]);
    expect(result.sawThinking).toBe(true);
    expect(result.reason).toBe('thinking');
  });

  it('short-circuits when the game already ended', async () => {
    const result = await waitForAiThinkingChromeFromSequence(
      [{ thinking: false, status: 'You win!' }],
      { isEnded: (st) => /win/i.test(st) }
    );
    expect(result).toEqual({ sawThinking: false, reason: 'ended' });
  });

  it('times out cleanly when AI finished instantly (still allow leave)', async () => {
    const result = await waitForAiThinkingChromeFromSequence(
      [
        { thinking: false, status: 'Your turn — Select' },
        { thinking: false, status: 'Your turn — Select' },
      ],
      { deadlineMs: AI_THINK_POLL_MS * 2, pollMs: AI_THINK_POLL_MS }
    );
    expect(result).toEqual({ sawThinking: false, reason: 'timeout' });
  });

  it('uses injectable sleep/now for a hermetic poll loop', async () => {
    const sleeps: number[] = [];
    let t = 0;
    let calls = 0;
    const result = await waitForAiThinkingChrome({
      sample: () => {
        calls += 1;
        return calls >= 3
          ? { thinking: true, status: 'Computer is thinking...' }
          : { thinking: false, status: '' };
      },
      sleep: async (ms) => {
        sleeps.push(ms);
        t += ms;
      },
      now: () => t,
      deadlineMs: AI_THINK_WAIT_MS,
      pollMs: AI_THINK_POLL_MS,
    });
    expect(result.sawThinking).toBe(true);
    expect(sleeps.length).toBeGreaterThanOrEqual(1);
    expect(sleeps.every((ms) => ms === AI_THINK_POLL_MS)).toBe(true);
  });
});

describe('nav-away-sweep harness wiring (q-mp-1482)', () => {
  it('imports waitForAiThinkingChrome and drops fixed 100ms race sleep', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/stars-bars-new-game-race\.mjs['"]/);
    expect(src).toMatch(/waitForAiThinkingChrome/);
    // q-mp-1493: tip-real chrome via shared SETTLE_THINKING_SELECTOR (incl.
    // .status-ai-thinking / .sd-computer-thinking), not a locator-only sample.
    expect(src).toMatch(/SETTLE_THINKING_SELECTOR/);
    // Must not reintroduce fixed 100ms sleep before leave.
    expect(src).not.toMatch(/await page\.waitForTimeout\(100\);/);
    expect(src).not.toMatch(/waitForTimeout\(100\).*mid-AI/);
  });

  it('keeps the shared wait helper in scripts/lib (1474 reuse)', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/export async function waitForAiThinkingChrome/);
    expect(libSrc).toMatch(
      /export async function waitForAiThinkingChromeFromSequence/
    );
    expect(libSrc).toMatch(/AI_THINK_WAIT_MS = 3000/);
  });
});
