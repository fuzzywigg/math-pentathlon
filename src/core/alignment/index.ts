// Alignment Detection System - Main Export

export * from './types';
export * from './grid-alignment';
export * from './contiguous';
export * from './highlight-ui';

// Compatibility shim: exports the ergonomic test-facing API.
// These wrap the internal API with object-based signatures and
// add small utility functions (getRegionStats, isIsolated, etc.)
// that don't exist in the core modules.
//
// Names that conflict with the core exports are intentionally
// re-exported from compat (named exports win over wildcard exports
// when listed explicitly), so import order here matters:
// compat must come LAST so its wrappers shadow the internal versions
// for any names that differ in signature.
export type {
  Dimensions,
  WrapOptions,
  LineAlignmentResult,
  AlignmentOptions,
  AlignmentCheckResult,
  ConnectivityOptions,
  RegionStats,
} from './compat';

export {
  // Constants (renamed / shadowed)
  DIRECTION_VECTORS,
  CARDINAL_DIRECTIONS,
  ALL_DIRECTIONS_8 as ALL_DIRECTIONS,   // shadow: 8 directions, not 4
  // isInBounds ergonomic wrapper (shadows internal row,col,rows,cols signature)
  isInBounds,
  // Dimension helpers
  getArrayDimensions,
  createArrayAccessor,
  // Position utilities
  normalizePosition,
  // Line helpers
  getLinePositions,
  checkLineAlignment,
  // Alignment queries (ergonomic wrappers)
  findAlignmentAt,
  findAlignmentsThrough,
  countMaxAligned,
  // Contiguous region wrappers (ergonomic)
  getRegionSize,
  isIsolated,
  getRegionStats,
  // Functions that shadow internal exports (different signatures)
  getNeighbors,
  findRegionAt,
  findAllRegions,
  findLargestRegion,
  areConnected,
  hasAlignment,
  findAllAlignments,
  countRegions,
} from './compat';
