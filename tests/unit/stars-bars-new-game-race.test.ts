/**
 * q-mp-1474: New Game race must wait for AI-thinking chrome (par-55 shape).
 * Hermetic stubbed visibility/status sequences + harness wiring (no Playwright).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AI_THINK_POLL_MS,
  AI_THINK_WAIT_MS,
  COMPUTER_OR_THINKING_RE,
  sampleShowsAiThinking,
  waitForAiThinkingChrome,
  waitForAiThinkingChromeFromSequence,
} from '../../scripts/lib/stars-bars-new-game-race.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/stars-bars-deep-playtest.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/stars-bars-new-game-race.mjs');

describe('sampleShowsAiThinking (q-mp-1474)', () => {
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
    expect(sampleShowsAiThinking(null)).toBe(false);
    expect(COMPUTER_OR_THINKING_RE.test('Thinking…')).toBe(true);
  });
});

describe('waitForAiThinkingChrome stubbed sequences (q-mp-1474)', () => {
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

  it('times out cleanly when AI finished instantly (still allow race)', async () => {
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

describe('stars-bars-deep-playtest harness wiring (q-mp-1474)', () => {
  it('imports waitForAiThinkingChrome and drops fixed 100ms race sleep', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/stars-bars-new-game-race\.mjs['"]/);
    expect(src).toMatch(/waitForAiThinkingChrome/);
    expect(src).toMatch(/probeNewGameRace/);
    expect(src).toMatch(/sawThinkingBefore/);
    // Must not reintroduce fixed 100ms sleep before the thinking sample.
    expect(src).not.toMatch(/await page\.waitForTimeout\(100\);/);
  });

  it('keeps the pure wait helper in scripts/lib', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(libSrc).toMatch(/export async function waitForAiThinkingChrome/);
    expect(libSrc).toMatch(
      /export async function waitForAiThinkingChromeFromSequence/
    );
    expect(libSrc).toMatch(/AI_THINK_WAIT_MS = 3000/);
  });
});
