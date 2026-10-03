/**
 * Dynamic import gate for the optional Three.js Pent'Em In board.
 * Lives in the game package so the ui/three chunk stays lazy until the flag is on.
 */
export function loadPentEmInBoard3DModule(): Promise<
  typeof import('../../ui/three/pent-em-in-board-3d')
> {
  return import('../../ui/three/pent-em-in-board-3d');
}
