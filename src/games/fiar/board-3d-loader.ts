/**
 * Dynamic import gate for the optional Three.js FIAR board.
 * Lives in the game package so the ui/three chunk stays lazy until the flag is on.
 */
export function loadFiarBoard3DModule(): Promise<
  typeof import('../../ui/three/fiar-board-3d')
> {
  return import('../../ui/three/fiar-board-3d');
}
