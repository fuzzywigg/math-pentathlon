/**
 * Dynamic import gate for the optional Three.js Queens & Guards board.
 * Lives in the game package so the ui/three chunk stays lazy until the flag is on.
 */
export function loadQueensGuardsBoard3DModule(): Promise<
  typeof import('../../ui/three/queens-guards-board-3d')
> {
  return import('../../ui/three/queens-guards-board-3d');
}
