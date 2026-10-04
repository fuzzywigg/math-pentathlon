/**
 * Dynamic import gate for the optional Three.js Kwatro-Sinko board.
 * Lives in the game package so the ui/three chunk stays lazy until the flag is on.
 */
export function loadKwatroSinkoBoard3DModule(): Promise<
  typeof import('../../ui/three/kwatro-sinko-board-3d')
> {
  return import('../../ui/three/kwatro-sinko-board-3d');
}
