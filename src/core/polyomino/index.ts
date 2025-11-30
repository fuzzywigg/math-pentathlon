/**
 * Polyomino System
 * Reusable polyomino shapes, transformations, and placement logic
 *
 * Used by: Pent'em In, Rectangle Rush, possibly other tiling games
 */

// Types
export type {
  Cell,
  PolyominoOrder,
  Polyomino,
  TransformedPolyomino,
  PolyominoPlacement,
  PolyominoBounds,
  PolyominoStyle,
} from './types';

export {
  POLYOMINO_NAMES,
  POLYOMINO_COLORS,
  DEFAULT_POLYOMINO_STYLE,
  TETROMINOES,
  PENTOMINOES,
  getPolyominoesByOrder,
  getPolyominoById,
} from './types';

// Transformations
export {
  getBounds,
  normalizeCells,
  sortCells,
  canonicalizeCells,
  rotateCells90CW,
  rotateCells90CCW,
  rotateCells180,
  rotateCells,
  flipCellsHorizontal,
  flipCellsVertical,
  transformCells,
  rotatePolyomino,
  flipPolyomino,
  getTransformedPolyomino,
  getAllTransformations,
  cellsToKey,
  areCellsEquivalent,
  arePolyominoesEquivalent,
  getSymmetryCount,
  translateCells,
  getAbsoluteCells,
  isCellInBounds,
  areCellsInBounds,
} from './transformations';

// Placement
export type { GridCell, PolyominoGrid } from './placement';

export {
  createGrid,
  isCellOccupied,
  isValidPlacement,
  placePolyomino,
  removePolyomino,
  getAllValidPositions,
  getAllValidPlacements,
  checkPerfectCoverage,
  getPlacementCells,
  doPlacementsOverlap,
  getAdjacentCells,
  getPlacementCenter,
  snapToNearestValid,
} from './placement';

// UI
export {
  renderPolyomino,
  renderPolyominoSVG,
  renderGrid,
  renderPlacementPreview,
  renderPolyominoPalette,
  createDraggablePolyomino,
  highlightCells,
  getPolyominoStyles,
  injectPolyominoStyles,
} from './polyomino-ui';
