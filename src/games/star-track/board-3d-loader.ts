/**
 * Dynamic import gate for the optional Three.js Star Track board.
 * Lives in the game package so the ui/three chunk stays lazy until the flag is on.
 */
export function loadStarTrackBoard3DModule(): Promise<
  typeof import('../../ui/three/star-track-board-3d')
> {
  return import('../../ui/three/star-track-board-3d');
}
