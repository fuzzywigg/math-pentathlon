/**
 * q-mp-1491: console-sweep settle must honor sum-dominoes `.sd-computer-thinking`
 * (and tip-real thinking class / computer|thinking status). Hermetic stub
 * sequences + harness wiring — no Playwright / product edits.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  COMPUTER_OR_THINKING_RE,
  SETTLE_HIDDEN_MS,
  SETTLE_POLL_MS,
  SETTLE_THINKING_SELECTOR,
  SETTLE_VISIBLE_MS,
  sampleShowsSettleThinking,
  settleThinkingFromSequence,
  settleThinkingWait,
} from '../../scripts/lib/console-sweep-settle.mjs';

const HARNESS = resolve(process.cwd(), 'scripts/console-sweep.mjs');
const LIB = resolve(process.cwd(), 'scripts/lib/console-sweep-settle.mjs');

describe('sampleShowsSettleThinking (q-mp-1491)', () => {
  it('accepts tip-real chrome flag or computer|thinking status', () => {
    expect(sampleShowsSettleThinking({ thinking: true, status: '' })).toBe(
      true
    );
    expect(
      sampleShowsSettleThinking({
        thinking: false,
        status: 'Computer is thinking…',
      })
    ).toBe(true);
    expect(
      sampleShowsSettleThinking({ thinking: false, status: 'Your turn — Roll' })
    ).toBe(false);
    expect(sampleShowsSettleThinking(null)).toBe(false);
  });

  it('COMPUTER_OR_THINKING_RE matches live sum-dominoes status copy', () => {
    expect(COMPUTER_OR_THINKING_RE.test('Computer is thinking…')).toBe(true);
    expect(COMPUTER_OR_THINKING_RE.test('Your turn — select a domino')).toBe(
      false
    );
  });
});

describe('settleThinkingFromSequence stubbed sequences (q-mp-1491)', () => {
  it('sees sum-dominoes-style chrome then clears (not status-ai-thinking-only)', async () => {
    // Historic bug: settle waited only `.status-ai-thinking`; sd chrome was ignored.
    const result = await settleThinkingFromSequence([
      { thinking: false, status: 'Your turn — Roll' },
      { thinking: true, status: 'Computer is thinking…' }, // .sd-computer-thinking
      { thinking: true, status: 'Computer is thinking…' },
      { thinking: false, status: 'Your turn — Roll' },
    ]);
    expect(result.sawThinking).toBe(true);
    expect(result.cleared).toBe(true);
    expect(result.visibleTimedOut).toBe(false);
    expect(result.hiddenTimedOut).toBe(false);
  });

  it('accepts computer|thinking status without chrome class', async () => {
    const result = await settleThinkingFromSequence([
      { thinking: false, status: '' },
      { thinking: false, status: 'Computer is thinking…' },
      { thinking: false, status: 'Your turn' },
    ]);
    expect(result.sawThinking).toBe(true);
    expect(result.cleared).toBe(true);
  });

  it('soft-timeouts when a game never flashes thinking chrome', async () => {
    const result = await settleThinkingFromSequence(
      [
        { thinking: false, status: 'Your turn' },
        { thinking: false, status: 'Your turn' },
      ],
      {
        visibleMs: SETTLE_POLL_MS * 2,
        hiddenMs: SETTLE_POLL_MS * 2,
        pollMs: SETTLE_POLL_MS,
      }
    );
    expect(result.sawThinking).toBe(false);
    expect(result.visibleTimedOut).toBe(true);
    // After visible timeout, samples are empty→false thinking → clears immediately.
    expect(result.cleared).toBe(true);
  });

  it('hidden soft-timeout when thinking never clears', async () => {
    const result = await settleThinkingFromSequence(
      [
        { thinking: true, status: 'Computer is thinking…' },
        { thinking: true, status: 'Computer is thinking…' },
        { thinking: true, status: 'Computer is thinking…' },
        { thinking: true, status: 'Computer is thinking…' },
      ],
      {
        visibleMs: SETTLE_POLL_MS * 4,
        hiddenMs: SETTLE_POLL_MS * 2,
        pollMs: SETTLE_POLL_MS,
      }
    );
    expect(result.sawThinking).toBe(true);
    expect(result.cleared).toBe(false);
    expect(result.hiddenTimedOut).toBe(true);
  });

  it('uses injectable sleep/now for a hermetic two-phase poll', async () => {
    const sleeps: number[] = [];
    let t = 0;
    let calls = 0;
    const result = await settleThinkingWait({
      sample: () => {
        calls += 1;
        if (calls < 3) return { thinking: false, status: '' };
        if (calls < 5)
          return { thinking: true, status: 'Computer is thinking…' };
        return { thinking: false, status: 'Your turn' };
      },
      sleep: async (ms) => {
        sleeps.push(ms);
        t += ms;
      },
      now: () => t,
      visibleMs: SETTLE_VISIBLE_MS,
      hiddenMs: SETTLE_HIDDEN_MS,
      pollMs: SETTLE_POLL_MS,
    });
    expect(result.sawThinking).toBe(true);
    expect(result.cleared).toBe(true);
    expect(sleeps.length).toBeGreaterThanOrEqual(1);
    expect(sleeps.every((ms) => ms === SETTLE_POLL_MS)).toBe(true);
  });
});

describe('console-sweep harness wiring (q-mp-1491)', () => {
  it('settleAfterMove waits on tip-real thinking selector incl. sd-computer-thinking', () => {
    const src = readFileSync(HARNESS, 'utf8');
    expect(src).toMatch(/from ['"]\.\/lib\/console-sweep-settle\.mjs['"]/);
    expect(src).toMatch(/SETTLE_THINKING_SELECTOR/);
    expect(src).toMatch(/settleAfterMove/);
    expect(src).toMatch(/sd-computer-thinking/);
    expect(src).toMatch(/status-ai-thinking/);
    expect(src).toMatch(/COMPUTER_OR_THINKING_RE/);
    // Must not reintroduce status-ai-thinking-only settle locator.
    expect(src).not.toMatch(/\.locator\(\s*['"]\.status-ai-thinking['"]\s*\)/);
    // sum-dominoes case still present and still calls settle after moves.
    expect(src).toMatch(/case ['"]sum-dominoes['"]/);
    expect(src).toMatch(/await settleAfterMove\(page\)/);
  });

  it('lib exports tip-real selector covering sd + shared chrome', () => {
    const libSrc = readFileSync(LIB, 'utf8');
    expect(SETTLE_THINKING_SELECTOR).toContain('.status-ai-thinking');
    expect(SETTLE_THINKING_SELECTOR).toContain('.sd-computer-thinking');
    expect(SETTLE_THINKING_SELECTOR).toContain('.pg-computer-thinking');
    expect(libSrc).toMatch(/export async function settleThinkingFromSequence/);
    expect(SETTLE_VISIBLE_MS).toBe(500);
    expect(SETTLE_HIDDEN_MS).toBe(8_000);
  });
});
