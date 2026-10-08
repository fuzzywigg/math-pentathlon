/**
 * Unicode die-face helpers shared by Contig / Juggle / Remainder Islands.
 */

const FACES_1_INDEXED = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const;

/**
 * Contig-60 / Juggle: faces[value] with '' at index 0; unknown → String(value).
 * Note: index 0 is '' which is falsy, so `||` yields `"0"` for value 0 —
 * preserved intentionally to match the historical helpers.
 */
export function getDieFaceEmoji(value: number): string {
  return FACES_1_INDEXED[value] || value.toString();
}

/**
 * Remainder Islands: faces[value - 1]; unknown → '?'.
 */
export function getDieFaceEmojiOrQuestion(value: number): string {
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'] as const;
  return faces[value - 1] || '?';
}
