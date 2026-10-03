/**
 * Dynamic import gate for the optional Three.js Prime Gold board.
 * Lives in the game package so the ui/three chunk stays lazy until the flag is on.
 */
export function loadPrimeGoldBoard3DModule(): Promise<
  typeof import('../../ui/three/prime-gold-board-3d')
> {
  return import('../../ui/three/prime-gold-board-3d');
}
