/**
 * Wave 59 leftover after #272 — Frac Fact main shell helpTitle + mode chrome.
 * Distinct from registry catalog. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Wave 59 frac — main help title', () => {
  it('locks How to Play Frac Fact and mode chrome in main.ts', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8');
    expect(src).toContain("helpTitle: 'How to Play Frac Fact'");
    expect(src).toContain("modeRadioName: 'frac-mode'");
    expect(src).toContain("vsHumanDescription: 'Take turns solving problems'");
    expect(src).toContain("vsAiDescription: 'Compete against the computer'");
    expect(src).toContain('<h4>Problem Difficulty</h4>');
  });
});
