import { describe, it, expect } from 'vitest';
import {
  createQuadraphage,
  createKing,
  INITIAL_QUADRAPHAGE_COUNT,
} from '../../src/games/kings-quadraphages/pieces';

describe('Pieces', () => {
  describe('INITIAL_QUADRAPHAGE_COUNT', () => {
    it('is 30', () => {
      expect(INITIAL_QUADRAPHAGE_COUNT).toBe(30);
    });
  });

  describe('createQuadraphage', () => {
    it('creates a quadraphage for player1', () => {
      const quad = createQuadraphage('player1');

      expect(quad.type).toBe('quadraphage');
      expect(quad.owner).toBe('player1');
    });

    it('creates a quadraphage for player2', () => {
      const quad = createQuadraphage('player2');

      expect(quad.type).toBe('quadraphage');
      expect(quad.owner).toBe('player2');
    });
  });

  describe('createKing', () => {
    it('creates a king for player1', () => {
      const king = createKing('player1');

      expect(king.type).toBe('king');
      expect(king.owner).toBe('player1');
    });

    it('creates a king for player2', () => {
      const king = createKing('player2');

      expect(king.type).toBe('king');
      expect(king.owner).toBe('player2');
    });
  });
});
