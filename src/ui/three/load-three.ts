/**
 * Isolated dynamic import of three so unit tests can spy/mock it and so the
 * main/game chunks never statically pull Three.js into the initial graph.
 */
export type ThreeModule = typeof import('three');

export function loadThree(): Promise<ThreeModule> {
  return import('three');
}
