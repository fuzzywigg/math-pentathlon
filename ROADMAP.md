# Math Pentathlon Development Roadmap

## Strategic Analysis: Shared Mechanics & Reusable Systems

Based on analysis of the 15 remaining games, this document identifies **"Big Toads"** - foundational systems that should be built first because they're reused across multiple games.

---

## Game Mechanics Matrix

| Game | Grid Type | Dice | Pieces | Alignment | Blocking | Fractions | Polyominoes |
|------|-----------|------|--------|-----------|----------|-----------|-------------|
| **Division II** |
| Fiar | Network/Path | - | Chips | **Yes** | **Yes** | - | - |
| Sum Dominoes | Custom | **Yes** | Dominoes | - | - | - | - |
| Par 55 | Pentagon | - | Attribute Blocks | - | - | - | - |
| Ramrod | Metric Grid | - | Cuisenaire Rods | - | - | - | - |
| Kwatro-Sinko | Network/Path | - | Numbered Chips | **Yes** | - | - | - |
| **Division III** |
| Juggle | 9x9 Grid | **Yes** | - | - | - | - | **Yes** |
| Contig 60 | Numbered Grid | **Yes** | Chips | **Yes** | - | - | - |
| Stars & Bars | Grid | - | Attribute Cards | - | - | - | - |
| Fab-a-Diffy | Custom | - | Fraction Bars | - | - | **Yes** | - |
| Queens & Guards | Hexagonal | - | Pawns/Chips | - | **Yes** | - | - |
| **Division IV** |
| Prime Gold | Spiral Grid | **Yes** | Chips | **Yes** | - | - | - |
| Remainder Islands | Hex-Triangle | **Yes** | Pawns/Chips | - | **Yes** | - | - |
| Pent'em In | 13x9 Grid | - | - | - | **Yes** | **Yes** | **Yes** |
| Frac Fact | Custom | - | Fraction Bars | - | - | **Yes** | - |
| Fraction Pinball | Pinball Board | - | Pawns/Chips | - | **Yes** | **Yes** | - |

---

## Big Toad #1: Dice System 🎲
**Used by:** Sum Dominoes, Juggle, Contig 60, Prime Gold, Remainder Islands (5 games)

### Requirements:
- Standard 6-sided dice
- Polyhedral dice (d4, d8, d10, d12, d20)
- Multiple dice rolls with visual animation
- Dice result combination/selection UI
- Roll history

### Implementation:
```
src/core/dice/
├── types.ts          # DiceType, RollResult
├── roller.ts         # Random roll logic
├── dice-ui.ts        # SVG dice rendering with animation
└── dice-selector.ts  # UI for selecting/combining results
```

### Priority: **HIGH** - Enables 5 games

---

## Big Toad #2: Alignment/Connection Detection 🔗
**Used by:** Fiar, Kwatro-Sinko, Contig 60, Prime Gold (4 games)
**Already have:** Basic alignment in Kings & Quadraphages (win detection)

### Requirements:
- N-in-a-row detection (configurable: 4, 5, etc.)
- Horizontal, vertical, diagonal detection
- Path/network connectivity (not just grid)
- Contiguous region detection
- Visual highlighting of winning lines

### Implementation:
```
src/core/alignment/
├── types.ts          # AlignmentConfig, Direction
├── grid-alignment.ts # Standard grid N-in-a-row
├── path-alignment.ts # Network/graph connectivity
├── contiguous.ts     # Flood-fill contiguous detection
└── highlight-ui.ts   # Visual feedback for alignments
```

### Priority: **HIGH** - Enables 4 games, improves existing

---

## Big Toad #3: Fraction/Decimal System 🔢
**Used by:** Fab-a-Diffy, Frac Fact, Fraction Pinball, Pent'em In (4 games)

### Requirements:
- Fraction representation (numerator/denominator)
- Visual fraction bars (Cuisenaire-style)
- Fraction arithmetic (add, subtract, multiply, divide)
- Fraction equivalence detection
- Fraction-to-decimal conversion
- Decimal arithmetic with precision handling

### Implementation:
```
src/core/fractions/
├── types.ts          # Fraction, FractionBar
├── arithmetic.ts     # Operations, simplification, LCD
├── conversion.ts     # Fraction ↔ Decimal
├── equivalence.ts    # Equivalence checking
├── fraction-bar-ui.ts # Visual fraction bar rendering
└── fraction-input.ts # UI for fraction entry
```

### Priority: **HIGH** - Enables 4 games, math-heavy

---

## Big Toad #4: Polyomino System 🧩
**Used by:** Juggle, Pent'em In (2 games directly, useful for others)
**Related:** Hex-a-Gone already has block patterns

### Requirements:
- All pentomino shapes (12 unique)
- All polyominoes 1-5 squares
- Rotation (90°, 180°, 270°)
- Reflection (flip)
- Drag-and-drop placement
- Collision detection on grid
- Valid placement highlighting

### Implementation:
```
src/core/polyominoes/
├── types.ts          # Polyomino, Shape, Transform
├── shapes.ts         # All polyomino definitions
├── transforms.ts     # Rotation, reflection logic
├── placement.ts      # Grid placement validation
├── polyomino-ui.ts   # SVG rendering with drag-drop
└── palette-ui.ts     # Piece selection palette
```

### Priority: **MEDIUM** - Enables 2 games, complex but contained

---

## Big Toad #5: Attribute Logic System 🏷️
**Used by:** Par 55, Stars & Bars (2 games)

### Requirements:
- Multi-attribute pieces (shape, color, size, thickness)
- Attribute comparison (same/different in 1, 2, 3, 4 ways)
- Set/pattern matching
- Visual attribute blocks rendering

### Implementation:
```
src/core/attributes/
├── types.ts          # Attribute, AttributeSet, Piece
├── comparison.ts     # N-way difference detection
├── matching.ts       # Pattern/set matching
└── attribute-ui.ts   # Visual block rendering
```

### Priority: **MEDIUM** - Enables 2 games

---

## Big Toad #6: Network/Graph Board System 🕸️
**Used by:** Fiar, Kwatro-Sinko, Remainder Islands (3 games)
**Different from:** Regular grids - these are node/edge graphs

### Requirements:
- Node-based board (circles connected by paths)
- Edge traversal rules
- Path finding (valid moves along edges)
- Network visualization (SVG)

### Implementation:
```
src/core/network/
├── types.ts          # Node, Edge, Graph
├── graph.ts          # Graph data structure
├── pathfinding.ts    # Valid move calculation
├── network-ui.ts     # SVG node/edge rendering
└── boards/           # Predefined board layouts
    ├── fiar-board.ts
    └── kwatro-board.ts
```

### Priority: **MEDIUM** - Enables 3 games, new paradigm

---

## Big Toad #7: Number Sentence Builder 🧮
**Used by:** Contig 60, Prime Gold (2 games)

### Requirements:
- Operand selection from dice/cards
- Operator selection (+, -, ×, ÷, ^, !)
- Expression building UI
- Expression evaluation
- Order of operations
- Target number matching

### Implementation:
```
src/core/expressions/
├── types.ts          # Expression, Operator, Token
├── parser.ts         # Expression parsing
├── evaluator.ts      # Safe evaluation
├── builder-ui.ts     # Drag-drop expression builder
└── validator.ts      # Check valid expressions
```

### Priority: **MEDIUM** - Enables 2 games

---

## Big Toad #8: Hexagonal Grid System ⬡
**Used by:** Queens & Guards, Remainder Islands (2 games)
**Already have:** Hex game (connection-based), Hex-a-Gone (pattern matching)

### Requirements:
- Hexagonal tessellation rendering (already have)
- Hex coordinate systems (cube, axial, offset)
- Hex neighbor calculation
- Hex pathfinding
- Triangular subdivision (for Remainder Islands)

### Enhancement needed:
```
src/core/hex/
├── coordinates.ts    # Coordinate conversion utilities
├── neighbors.ts      # Neighbor calculation
├── pathfinding.ts    # Hex-based movement
└── hex-triangle.ts   # Triangular subdivision
```

### Priority: **LOW** - Mostly exists, minor extensions

---

## Implementation Order (Recommended)

### Phase 1: Foundation Systems
1. **Dice System** - Quick win, enables many games
2. **Alignment Detection** - Generalizes existing code
3. **Fraction System** - Math-heavy, high educational value

### Phase 2: Spatial Systems
4. **Polyomino System** - Complex but self-contained
5. **Network/Graph Boards** - New paradigm needed

### Phase 3: Specialized Systems
6. **Attribute Logic** - Niche but straightforward
7. **Number Sentence Builder** - UI-heavy
8. **Hex Extensions** - Incremental improvement

---

## Game Implementation Order

After building Big Toads, games can be tackled in this order:

### Tier 1: Low Complexity (1-2 Big Toads needed)
| Game | Depends On | Complexity |
|------|------------|------------|
| Fiar | Alignment, Network | ⭐⭐ |
| Kwatro-Sinko | Alignment, Network | ⭐⭐ |
| Queens & Guards | Hex (exists) | ⭐⭐ |

### Tier 2: Medium Complexity (2-3 Big Toads needed)
| Game | Depends On | Complexity |
|------|------------|------------|
| Contig 60 | Dice, Alignment, Expressions | ⭐⭐⭐ |
| Prime Gold | Dice, Alignment, Expressions | ⭐⭐⭐ |
| Juggle | Dice, Polyominoes | ⭐⭐⭐ |
| Fab-a-Diffy | Fractions | ⭐⭐⭐ |
| Sum Dominoes | Dice | ⭐⭐⭐ |

### Tier 3: High Complexity (Multiple systems + unique mechanics)
| Game | Depends On | Complexity |
|------|------------|------------|
| Pent'em In | Polyominoes, Fractions | ⭐⭐⭐⭐ |
| Frac Fact | Fractions | ⭐⭐⭐⭐ |
| Fraction Pinball | Fractions, unique physics | ⭐⭐⭐⭐ |
| Remainder Islands | Dice, Hex, Network | ⭐⭐⭐⭐ |
| Stars & Bars | Attributes | ⭐⭐⭐⭐ |
| Par 55 | Attributes, unique board | ⭐⭐⭐⭐ |
| Ramrod | Unique (Cuisenaire) | ⭐⭐⭐⭐⭐ |

---

## Existing Assets to Leverage

From our 6 completed games, we already have:

| Asset | Source Game | Reusable For |
|-------|-------------|--------------|
| Square grid rendering | Kings & Quadraphages | Juggle, Pent'em In, Contig 60 |
| Hex grid rendering | Hex, Hex-a-Gone | Queens & Guards, Remainder Islands |
| Turn management | All games | All games |
| AI opponent framework | Kings & Quadraphages | All games |
| Tutorial system | Kings & Quadraphages | All games |
| Move history | Kings & Quadraphages | All games |
| Win detection | Multiple | Alignment games |
| Piece dragging | Star Track | Polyomino games |

---

## Summary

**Build These First (Big Toads):**
1. 🎲 Dice System (5 games)
2. 🔗 Alignment Detection (4 games)
3. 🔢 Fraction System (4 games)
4. 🧩 Polyomino System (2 games)
5. 🕸️ Network/Graph Boards (3 games)

**Then Build Games In Order:**
1. Fiar → Kwatro-Sinko → Queens & Guards (leverage existing + new network system)
2. Contig 60 → Prime Gold (dice + alignment + expressions)
3. Juggle → Pent'em In (polyominoes)
4. Fab-a-Diffy → Frac Fact → Fraction Pinball (fractions)
5. Sum Dominoes, Stars & Bars, Par 55, Ramrod, Remainder Islands (unique/complex)

This approach maximizes code reuse and builds momentum with quick wins before tackling complex games.
