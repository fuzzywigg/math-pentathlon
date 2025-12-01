// Attribute Logic System Demo Page
// Interactive demo for testing attribute matching, filtering, and set validation

import { navigate } from '../core/router';
import {
  AttributePiece,
  AttributeDefinition,
  BASIC_ATTRIBUTES,
  SET_GAME_ATTRIBUTES,
  generateAllPieces,
  createPiece,
} from '../core/attributes/types';
import {
  filterPieces,
  countMatchingAttributes,
  getMatchingAttributes,
  getDifferingAttributes,
  isValidSetGameSet,
  createMathPiece,
} from '../core/attributes/logic';
import {
  renderAttributePiece,
  renderSetCard,
  createPieceGrid,
  injectAttributeStyles,
} from '../core/attributes/attribute-ui';

export function renderAttributeDemo(container: HTMLElement): void {
  injectAttributeStyles();

  container.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to home">← Back</button>
      <h1>Attribute Logic Demo</h1>
    </header>

    <div class="demo-container">
      <div class="demo-section">
        <h2>Attribute Pieces</h2>
        <p>Click pieces to select them and see their attributes</p>

        <div class="attribute-set-selector">
          <button class="set-btn selected" data-set="basic">Basic (Shape/Color/Size)</button>
          <button class="set-btn" data-set="math">Math Properties</button>
        </div>

        <div id="piece-grid"></div>
        <div id="selected-info" class="selected-info"></div>
      </div>

      <div class="demo-section">
        <h2>SET Game Cards</h2>
        <p>Select 3 cards to check if they form a valid SET</p>

        <div id="set-grid"></div>
        <div id="set-result" class="set-result"></div>
        <div id="valid-sets-info" class="valid-sets-info"></div>
      </div>

      <div class="demo-section">
        <h2>Piece Comparison</h2>
        <p>Select two pieces to compare their attributes</p>

        <div class="comparison-area">
          <div id="compare-piece-1" class="compare-slot">
            <span class="placeholder">Piece 1</span>
          </div>
          <div class="comparison-results" id="comparison-results">
            <span class="placeholder">Select pieces to compare</span>
          </div>
          <div id="compare-piece-2" class="compare-slot">
            <span class="placeholder">Piece 2</span>
          </div>
        </div>

        <div id="compare-grid"></div>
      </div>

      <div class="demo-section">
        <h2>Attribute Filtering</h2>
        <p>Filter pieces by attribute values</p>

        <div class="filter-controls" id="filter-controls"></div>
        <div id="filtered-grid"></div>
        <div id="filter-count" class="filter-count"></div>
      </div>
    </div>

    <style>
      .demo-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 1rem;
      }

      .demo-section {
        background: #f9f9f9;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .demo-section h2 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .demo-section p {
        color: #666;
        margin: 0 0 1rem 0;
      }

      .attribute-set-selector {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .set-btn {
        padding: 0.5rem 1rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
      }

      .set-btn:hover {
        border-color: #2196f3;
      }

      .set-btn.selected {
        background: #2196f3;
        border-color: #2196f3;
        color: white;
      }

      .selected-info,
      .set-result,
      .valid-sets-info,
      .filter-count {
        margin-top: 1rem;
        padding: 0.75rem;
        background: white;
        border-radius: 6px;
        font-size: 0.9rem;
      }

      .set-result.valid {
        background: #e8f5e9;
        color: #2e7d32;
        font-weight: bold;
      }

      .set-result.invalid {
        background: #ffebee;
        color: #c62828;
      }

      .comparison-area {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
      }

      .compare-slot {
        width: 100px;
        height: 100px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .compare-slot.filled {
        border-style: solid;
        border-color: #2196f3;
      }

      .comparison-results {
        flex: 1;
        max-width: 300px;
        padding: 0.75rem;
        background: #f5f5f5;
        border-radius: 6px;
        text-align: center;
      }

      .comparison-results .placeholder {
        color: #999;
        font-style: italic;
      }

      .match-list,
      .diff-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      .attr-tag {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
      }

      .attr-tag.match {
        background: #e8f5e9;
        color: #2e7d32;
      }

      .attr-tag.diff {
        background: #fff3e0;
        color: #ef6c00;
      }

      .filter-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .filter-group label {
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }

      .filter-group select {
        padding: 0.5rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
      }

      .placeholder {
        color: #999;
        font-style: italic;
      }
    </style>
  `;

  // Wire up back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigate('/'));
  }

  // Initialize sections
  initAttributePiecesSection();
  initSetGameSection();
  initComparisonSection();
  initFilterSection();
}

function initAttributePiecesSection(): void {
  const gridContainer = document.getElementById('piece-grid');
  const infoContainer = document.getElementById('selected-info');
  const setBtns = document.querySelectorAll('.attribute-set-selector .set-btn');

  let currentDefs: AttributeDefinition[] = BASIC_ATTRIBUTES;
  let allPieces: AttributePiece[] = [];
  let selectedPiece: AttributePiece | null = null;

  function generatePieces(): void {
    if (currentDefs === BASIC_ATTRIBUTES) {
      allPieces = generateAllPieces(BASIC_ATTRIBUTES);
    } else {
      // Math pieces
      allPieces = Array.from({ length: 20 }, (_, i) => createMathPiece(i + 1));
    }
  }

  function render(): void {
    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    const selectedIds = selectedPiece ? new Set([selectedPiece.id]) : new Set<string>();

    const grid = createPieceGrid(
      allPieces.slice(0, 15),
      currentDefs,
      (piece) => {
        selectedPiece = piece;
        render();
        showInfo();
      },
      selectedIds,
      { pieceSize: 60, shape: 'card' }
    );

    gridContainer.appendChild(grid);
  }

  function showInfo(): void {
    if (!infoContainer || !selectedPiece) {
      if (infoContainer) {
        infoContainer.innerHTML = '<span class="placeholder">Click a piece to see its attributes</span>';
      }
      return;
    }

    const attrs = Object.entries(selectedPiece.attributes)
      .map(([k, v]) => `<strong>${k}:</strong> ${v}`)
      .join(' | ');

    infoContainer.innerHTML = `<strong>Piece ${selectedPiece.id}</strong><br>${attrs}`;
  }

  setBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');

      const setName = (btn as HTMLElement).dataset.set;
      if (setName === 'math') {
        currentDefs = [
          { name: 'number', displayName: 'Number', possibleValues: [] },
          { name: 'isPrime', displayName: 'Prime', possibleValues: [true, false] },
          { name: 'isEven', displayName: 'Even', possibleValues: [true, false] },
        ];
      } else {
        currentDefs = BASIC_ATTRIBUTES;
      }

      selectedPiece = null;
      generatePieces();
      render();
      showInfo();
    });
  });

  generatePieces();
  render();
}

function initSetGameSection(): void {
  const gridContainer = document.getElementById('set-grid');
  const resultContainer = document.getElementById('set-result');
  const validSetsContainer = document.getElementById('valid-sets-info');

  // Generate a subset of SET cards
  const setCards: AttributePiece[] = [];
  const shapes = ['diamond', 'oval', 'squiggle'];
  const colors = ['red', 'green', 'purple'];
  const shadings = ['solid', 'striped', 'empty'];

  // Generate 12 random cards
  for (let i = 0; i < 12; i++) {
    setCards.push(createPiece(`set-${i}`, {
      number: (i % 3) + 1,
      shape: shapes[Math.floor(i / 4) % 3],
      color: colors[i % 3],
      shading: shadings[Math.floor(i / 3) % 3],
    }));
  }

  const selectedCards = new Set<string>();

  function render(): void {
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 8px;
    `;

    for (const card of setCards) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        cursor: pointer;
        padding: 4px;
        border: 3px solid ${selectedCards.has(card.id) ? '#2196f3' : 'transparent'};
        border-radius: 8px;
        transition: all 0.2s;
      `;

      wrapper.addEventListener('click', () => {
        if (selectedCards.has(card.id)) {
          selectedCards.delete(card.id);
        } else if (selectedCards.size < 3) {
          selectedCards.add(card.id);
        }
        render();
        checkSet();
      });

      const svg = renderSetCard(card, 70);
      wrapper.appendChild(svg);
      grid.appendChild(wrapper);
    }

    gridContainer.appendChild(grid);
  }

  function checkSet(): void {
    if (!resultContainer) return;

    if (selectedCards.size < 3) {
      resultContainer.innerHTML = `Select ${3 - selectedCards.size} more card(s)`;
      resultContainer.className = 'set-result';
      return;
    }

    const selected = setCards.filter((c) => selectedCards.has(c.id));
    const isValid = isValidSetGameSet(selected, SET_GAME_ATTRIBUTES);

    if (isValid) {
      resultContainer.innerHTML = '✓ Valid SET!';
      resultContainer.className = 'set-result valid';
    } else {
      // Show why it's not valid
      let reason = '';
      for (const attr of SET_GAME_ATTRIBUTES) {
        const values = selected.map((p) => p.attributes[attr.name]);
        const allSame = values.every((v) => v === values[0]);
        const allDiff = new Set(values).size === 3;
        if (!allSame && !allDiff) {
          reason = `${attr.displayName}: not all same, not all different`;
          break;
        }
      }
      resultContainer.innerHTML = `✗ Not a valid SET (${reason})`;
      resultContainer.className = 'set-result invalid';
    }
  }

  // Show valid sets count
  if (validSetsContainer) {
    // This is simplified - real SET uses "all same OR all different"
    validSetsContainer.innerHTML = `<strong>Tip:</strong> A valid SET requires each attribute to be either ALL the same or ALL different across the 3 cards.`;
  }

  render();
}

function initComparisonSection(): void {
  const gridContainer = document.getElementById('compare-grid');
  const slot1 = document.getElementById('compare-piece-1');
  const slot2 = document.getElementById('compare-piece-2');
  const resultsContainer = document.getElementById('comparison-results');

  const pieces = generateAllPieces(BASIC_ATTRIBUTES).slice(0, 12);
  let piece1: AttributePiece | null = null;
  let piece2: AttributePiece | null = null;

  function render(): void {
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    const grid = createPieceGrid(
      pieces,
      BASIC_ATTRIBUTES,
      (piece) => {
        if (!piece1) {
          piece1 = piece;
        } else if (!piece2) {
          piece2 = piece;
        } else {
          piece1 = piece;
          piece2 = null;
        }
        updateSlots();
        updateComparison();
      },
      new Set([piece1?.id, piece2?.id].filter(Boolean) as string[]),
      { pieceSize: 50, shape: 'circle' }
    );

    gridContainer.appendChild(grid);
  }

  function updateSlots(): void {
    if (slot1) {
      slot1.innerHTML = '';
      if (piece1) {
        slot1.classList.add('filled');
        const svg = renderAttributePiece(piece1, BASIC_ATTRIBUTES, { pieceSize: 80, shape: 'circle' });
        slot1.appendChild(svg);
      } else {
        slot1.classList.remove('filled');
        slot1.innerHTML = '<span class="placeholder">Piece 1</span>';
      }
    }

    if (slot2) {
      slot2.innerHTML = '';
      if (piece2) {
        slot2.classList.add('filled');
        const svg = renderAttributePiece(piece2, BASIC_ATTRIBUTES, { pieceSize: 80, shape: 'circle' });
        slot2.appendChild(svg);
      } else {
        slot2.classList.remove('filled');
        slot2.innerHTML = '<span class="placeholder">Piece 2</span>';
      }
    }
  }

  function updateComparison(): void {
    if (!resultsContainer) return;

    if (!piece1 || !piece2) {
      resultsContainer.innerHTML = '<span class="placeholder">Select two pieces to compare</span>';
      return;
    }

    const matching = getMatchingAttributes(piece1, piece2);
    const differing = getDifferingAttributes(piece1, piece2);
    const matchCount = countMatchingAttributes(piece1, piece2);

    resultsContainer.innerHTML = `
      <div><strong>Match Score:</strong> ${matchCount}/${Object.keys(piece1.attributes).length}</div>
      <div class="match-list">
        <strong>Same:</strong>
        ${matching.map((a) => `<span class="attr-tag match">${a}</span>`).join(' ')}
      </div>
      <div class="diff-list">
        <strong>Different:</strong>
        ${differing.map((a) => `<span class="attr-tag diff">${a}</span>`).join(' ')}
      </div>
    `;
  }

  render();
  updateSlots();
}

function initFilterSection(): void {
  const controlsContainer = document.getElementById('filter-controls');
  const gridContainer = document.getElementById('filtered-grid');
  const countContainer = document.getElementById('filter-count');

  const allPieces = generateAllPieces(BASIC_ATTRIBUTES);
  const filters: Record<string, string> = {};

  function renderControls(): void {
    if (!controlsContainer) return;

    controlsContainer.innerHTML = '';

    for (const attr of BASIC_ATTRIBUTES) {
      const group = document.createElement('div');
      group.className = 'filter-group';

      const label = document.createElement('label');
      label.textContent = attr.displayName || attr.name;
      group.appendChild(label);

      const select = document.createElement('select');
      select.innerHTML = `<option value="">Any</option>`;
      for (const value of attr.possibleValues) {
        select.innerHTML += `<option value="${value}">${value}</option>`;
      }

      select.value = filters[attr.name] || '';
      select.addEventListener('change', () => {
        filters[attr.name] = select.value;
        renderFiltered();
      });

      group.appendChild(select);
      controlsContainer.appendChild(group);
    }
  }

  function renderFiltered(): void {
    if (!gridContainer || !countContainer) return;

    // Build filter condition
    let filtered = allPieces;

    for (const [attrName, value] of Object.entries(filters)) {
      if (value) {
        filtered = filterPieces(filtered, {
          attribute: attrName,
          operator: 'equals',
          value: value,
        });
      }
    }

    gridContainer.innerHTML = '';
    const grid = createPieceGrid(
      filtered,
      BASIC_ATTRIBUTES,
      () => {},
      new Set(),
      { pieceSize: 50, shape: 'square' }
    );
    gridContainer.appendChild(grid);

    countContainer.innerHTML = `<strong>Showing:</strong> ${filtered.length} of ${allPieces.length} pieces`;
  }

  renderControls();
  renderFiltered();
}
