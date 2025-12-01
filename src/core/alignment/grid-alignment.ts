// Grid-based N-in-a-row Alignment Detection

import {
  GridPosition,
  CellValue,
  CellGetter,
  Direction,
  AlignmentConfig,
  AlignmentResult,
  AlignmentCheckResult,
  ALL_DIRECTIONS,
} from './types';

/**
 * Check if a position is within grid bounds
 */
export function isInBounds(
  row: number,
  col: number,
  rows: number,
  cols: number
): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

/**
 * Wrap a position for toroidal boards
 */
export function wrapPosition(
  row: number,
  col: number,
  rows: number,
  cols: number
): GridPosition {
  return {
    row: ((row % rows) + rows) % rows,
    col: ((col % cols) + cols) % cols,
  };
}

/**
 * Find alignment starting from a position in a specific direction
 */
export function findAlignmentInDirection(
  startRow: number,
  startCol: number,
  direction: Direction,
  getCell: CellGetter,
  config: AlignmentConfig
): AlignmentResult | null {
  const { rows, cols, targetLength, wrap = false } = config;
  const { dRow, dCol } = direction;

  // Get the starting cell value
  const startValue = getCell(startRow, startCol);

  // Skip empty cells
  if (startValue === null || startValue === undefined) {
    return null;
  }

  // Collect positions with matching values
  const positions: GridPosition[] = [{ row: startRow, col: startCol }];

  // Check forward direction
  let row = startRow + dRow;
  let col = startCol + dCol;

  while (positions.length < targetLength) {
    // Handle bounds
    if (wrap) {
      const wrapped = wrapPosition(row, col, rows, cols);
      row = wrapped.row;
      col = wrapped.col;
    } else if (!isInBounds(row, col, rows, cols)) {
      break;
    }

    const cellValue = getCell(row, col);

    if (cellValue !== startValue) {
      break;
    }

    positions.push({ row, col });
    row += dRow;
    col += dCol;
  }

  // Check if we found enough
  if (positions.length >= targetLength) {
    return {
      value: startValue,
      start: positions[0],
      end: positions[positions.length - 1],
      positions,
      direction,
      length: positions.length,
    };
  }

  return null;
}

/**
 * Find all alignments of target length or more for a specific value
 */
export function findAlignmentsForValue(
  value: CellValue,
  getCell: CellGetter,
  config: AlignmentConfig
): AlignmentResult[] {
  const { rows, cols, directions = ALL_DIRECTIONS } = config;
  const alignments: AlignmentResult[] = [];
  const found = new Set<string>(); // Track found alignments to avoid duplicates

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellValue = getCell(row, col);

      if (cellValue !== value) {
        continue;
      }

      for (const direction of directions) {
        const alignment = findAlignmentInDirection(row, col, direction, getCell, config);

        if (alignment) {
          // Create a unique key for this alignment
          const key = `${direction.name}-${alignment.positions.map(p => `${p.row},${p.col}`).join('-')}`;

          if (!found.has(key)) {
            found.add(key);
            alignments.push(alignment);
          }
        }
      }
    }
  }

  return alignments;
}

/**
 * Find all alignments on the board for any value
 */
export function findAllAlignments(
  getCell: CellGetter,
  config: AlignmentConfig
): AlignmentResult[] {
  const { rows, cols, directions = ALL_DIRECTIONS } = config;
  const alignments: AlignmentResult[] = [];
  const found = new Set<string>();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      for (const direction of directions) {
        const alignment = findAlignmentInDirection(row, col, direction, getCell, config);

        if (alignment) {
          const key = `${direction.name}-${alignment.positions.map(p => `${p.row},${p.col}`).join('-')}`;

          if (!found.has(key)) {
            found.add(key);
            alignments.push(alignment);
          }
        }
      }
    }
  }

  return alignments;
}

/**
 * Check if there's a winner (any alignment of target length)
 */
export function checkForWinner(
  getCell: CellGetter,
  config: AlignmentConfig
): AlignmentCheckResult {
  const alignments = findAllAlignments(getCell, config);

  if (alignments.length === 0) {
    return {
      hasWinner: false,
      winner: null,
      alignments: [],
    };
  }

  // Return the first alignment found (typically the winner)
  return {
    hasWinner: true,
    winner: alignments[0].value,
    alignments,
  };
}

/**
 * Check if a specific move creates a winning alignment
 */
export function checkMoveForWin(
  row: number,
  col: number,
  value: CellValue,
  getCell: CellGetter,
  config: AlignmentConfig
): AlignmentCheckResult {
  const { directions = ALL_DIRECTIONS } = config;
  const alignments: AlignmentResult[] = [];

  // Create a getter that includes the hypothetical move
  const getWithMove: CellGetter = (r, c) => {
    if (r === row && c === col) {
      return value;
    }
    return getCell(r, c);
  };

  for (const direction of directions) {
    // Check both directions from the move position
    const alignment = findAlignmentFromCenter(row, col, direction, getWithMove, config);

    if (alignment && alignment.length >= config.targetLength) {
      alignments.push(alignment);
    }
  }

  return {
    hasWinner: alignments.length > 0,
    winner: alignments.length > 0 ? value : null,
    alignments,
  };
}

/**
 * Find alignment extending in both directions from a center position
 */
export function findAlignmentFromCenter(
  centerRow: number,
  centerCol: number,
  direction: Direction,
  getCell: CellGetter,
  config: AlignmentConfig
): AlignmentResult | null {
  const { rows, cols, targetLength, wrap = false } = config;
  const { dRow, dCol } = direction;

  const centerValue = getCell(centerRow, centerCol);

  if (centerValue === null || centerValue === undefined) {
    return null;
  }

  const positions: GridPosition[] = [{ row: centerRow, col: centerCol }];

  // Extend in positive direction
  let row = centerRow + dRow;
  let col = centerCol + dCol;

  while (true) {
    if (wrap) {
      const wrapped = wrapPosition(row, col, rows, cols);
      row = wrapped.row;
      col = wrapped.col;
    } else if (!isInBounds(row, col, rows, cols)) {
      break;
    }

    if (getCell(row, col) !== centerValue) {
      break;
    }

    positions.push({ row, col });
    row += dRow;
    col += dCol;
  }

  // Extend in negative direction
  row = centerRow - dRow;
  col = centerCol - dCol;

  while (true) {
    if (wrap) {
      const wrapped = wrapPosition(row, col, rows, cols);
      row = wrapped.row;
      col = wrapped.col;
    } else if (!isInBounds(row, col, rows, cols)) {
      break;
    }

    if (getCell(row, col) !== centerValue) {
      break;
    }

    positions.unshift({ row, col });
    row -= dRow;
    col -= dCol;
  }

  if (positions.length >= targetLength) {
    // Sort positions for consistent ordering
    positions.sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

    return {
      value: centerValue,
      start: positions[0],
      end: positions[positions.length - 1],
      positions,
      direction,
      length: positions.length,
    };
  }

  return null;
}

/**
 * Count how many pieces a player has in each direction from a position
 * Useful for AI evaluation
 */
export function countAlignmentPotential(
  row: number,
  col: number,
  value: CellValue,
  getCell: CellGetter,
  config: AlignmentConfig
): Map<string, { count: number; blocked: boolean }> {
  const { rows, cols, directions = ALL_DIRECTIONS, wrap = false } = config;
  const result = new Map<string, { count: number; blocked: boolean }>();

  for (const direction of directions) {
    const { dRow, dCol, name } = direction;
    let count = 1; // Count the center position
    let blockedPositive = false;
    let blockedNegative = false;

    // Check positive direction
    let r = row + dRow;
    let c = col + dCol;

    while (true) {
      if (wrap) {
        const wrapped = wrapPosition(r, c, rows, cols);
        r = wrapped.row;
        c = wrapped.col;
      } else if (!isInBounds(r, c, rows, cols)) {
        blockedPositive = true;
        break;
      }

      const cellValue = getCell(r, c);

      if (cellValue === value) {
        count++;
      } else if (cellValue === null || cellValue === undefined) {
        break; // Open space
      } else {
        blockedPositive = true; // Blocked by opponent
        break;
      }

      r += dRow;
      c += dCol;
    }

    // Check negative direction
    r = row - dRow;
    c = col - dCol;

    while (true) {
      if (wrap) {
        const wrapped = wrapPosition(r, c, rows, cols);
        r = wrapped.row;
        c = wrapped.col;
      } else if (!isInBounds(r, c, rows, cols)) {
        blockedNegative = true;
        break;
      }

      const cellValue = getCell(r, c);

      if (cellValue === value) {
        count++;
      } else if (cellValue === null || cellValue === undefined) {
        break; // Open space
      } else {
        blockedNegative = true;
        break;
      }

      r -= dRow;
      c -= dCol;
    }

    result.set(name, {
      count,
      blocked: blockedPositive && blockedNegative,
    });
  }

  return result;
}

/**
 * Helper: Create a cell getter from a 2D array
 */
export function createArrayGetter<T extends CellValue>(board: T[][]): CellGetter<T> {
  return (row, col) => {
    if (row >= 0 && row < board.length && col >= 0 && col < board[row].length) {
      return board[row][col];
    }
    return null as T;
  };
}
