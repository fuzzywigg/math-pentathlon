/**
 * Wave 59 leftover after #272 — Pinball main shell helpTitle + mode chrome.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Wave 59 pinball — main help title', () => {
  it('locks How to Play Fraction Pinball and mode chrome in main.ts', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8');
    expect(src).toContain("helpTitle: 'How to Play Fraction Pinball'");
    expect(src).toContain("modeRadioName: 'pinball-mode'");
    expect(src).toContain("vsHumanDescription: 'Take turns converting'");
    expect(src).toContain("vsAiDescription: 'Challenge the computer'");
  });
});
