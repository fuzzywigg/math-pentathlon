import { describe, expect, it } from 'vitest';
import {
  getDieFaceEmoji,
  getDieFaceEmojiOrQuestion,
} from '../../src/ui/die-faces';

describe('mutation-ui2 die-faces mapping', () => {
  it('maps 1..6 to six distinct non-empty glyphs', () => {
    const faces = [1, 2, 3, 4, 5, 6].map((v) => getDieFaceEmoji(v));
    expect(new Set(faces).size).toBe(6);
    for (const f of faces) {
      expect(typeof f).toBe('string');
      expect(f.length).toBeGreaterThan(0);
    }
  });

  it('falls back to decimal string for out-of-range (incl. historic 0)', () => {
    // Index 0 is '' (falsy) so || yields "0" — intentional contract.
    expect(getDieFaceEmoji(0)).toBe('0');
    expect(getDieFaceEmoji(7)).toBe('7');
    expect(getDieFaceEmoji(-1)).toBe('-1');
  });

  it('1-indexed remainder helper uses value-1 and "?" fallback', () => {
    const a = getDieFaceEmojiOrQuestion(1);
    const b = getDieFaceEmojiOrQuestion(6);
    expect(a).not.toBe(b);
    expect(a).toBe(getDieFaceEmoji(1));
    expect(b).toBe(getDieFaceEmoji(6));
    expect(getDieFaceEmojiOrQuestion(0)).toBe('?');
    expect(getDieFaceEmojiOrQuestion(7)).toBe('?');
    // value-1 must not become value+1
    expect(getDieFaceEmojiOrQuestion(2)).toBe(getDieFaceEmoji(2));
    expect(getDieFaceEmojiOrQuestion(2)).not.toBe(getDieFaceEmoji(1));
    expect(getDieFaceEmojiOrQuestion(2)).not.toBe(getDieFaceEmoji(3));
  });
});
