/**
 * Alignment System
 * Reusable alignment and connection detection for grid-based games
 *
 * Used by: Fiar, Kwatro-Sinko, Contig 60, Prime Gold
 * Also improves: Kings & Quadraphages (win detection)
 */

// Types
export type {
  Position,
  Direction,
  FullDirection,
  AlignmentConfig,
  AlignmentResult,
  AlignmentSearchResult,
  ContiguousConfig,
  ContiguousRegion,
  CellMatcher,
  GridAccessor,
  GridDimensions,
  HighlightStyle,
} from './types';

export {
  DIRECTION_VECTORS,
  FULL_DIRECTION_VECTORS,
  CARDINAL_DIRECTIONS,
  ALL_DIRECTIONS,
  DEFAULT_ALIGNMENT_CONFIG,
  DEFAULT_CONTIGUOUS_CONFIG,
  DEFAULT_HIGHLIGHT_STYLES,
} from './types';

// Grid alignment (N-in-a-row)
export {
  isInBounds,
  normalizePosition,
  getLinePositions,
  checkLineAlignment,
  findAlignmentAt,
  findAllAlignments,
  hasAlignment,
  findAlignmentsThrough,
  countMaxAligned,
  createArrayAccessor,
  getArrayDimensions,
} from './grid-alignment';

// Contiguous regions (flood-fill)
export {
  getNeighbors,
  findRegionAt,
  findAllRegions,
  findLargestRegion,
  findRegionsOfValue,
  areConnected,
  getRegionSize,
  isIsolated,
  findRegionBoundary,
  countRegions,
  getRegionStats,
} from './contiguous';

// Highlight UI
export {
  getHighlightClassName,
  generateHighlightCSS,
  injectHighlightStyles,
  highlightCells,
  removeHighlight,
  removeAllHighlights,
  clearAllHighlights,
  highlightAlignment,
  highlightRegion,
  flashHighlight,
  animateHighlight,
  createHighlightOverlay,
  createAlignmentLine,
} from './highlight-ui';
