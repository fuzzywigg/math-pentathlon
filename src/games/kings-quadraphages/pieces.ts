// Piece types
export type PieceType = 'king' | 'quadraphage';

// Player identifiers
export type PlayerOwner = 'player1' | 'player2';

// A piece on the board
export interface Piece {
  type: PieceType;
  owner: PlayerOwner;
}

// Initial Quadraphage supply for each player
export const INITIAL_QUADRAPHAGE_COUNT = 30;

// Create a new Quadraphage piece for a player
export function createQuadraphage(owner: PlayerOwner): Piece {
  return {
    type: 'quadraphage',
    owner,
  };
}

// Create a King piece for a player
export function createKing(owner: PlayerOwner): Piece {
  return {
    type: 'king',
    owner,
  };
}
