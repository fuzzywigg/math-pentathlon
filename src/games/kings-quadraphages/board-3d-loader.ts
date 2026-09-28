/**
 * Dynamic import gate for the optional Three.js Kings board.
 * Lives in the game package so the ui/three chunk stays lazy until the flag is on.
 */
export function loadKingsBoard3DModule(): Promise<
  typeof import('../../ui/three/kings-board-3d')
> {
  return import('../../ui/three/kings-board-3d');
}
