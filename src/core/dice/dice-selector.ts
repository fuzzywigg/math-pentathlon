// Dice Selector - UI for selecting and combining dice results

import { DiceConfig, DieRoll, RollResult, DiceSet, COMMON_DICE_SETS } from './types';
import { rollDice, toggleDieSelection, getSelectedSum, markDiceUsed, getAllPossibleSums } from './roller';
import { renderRollResult, animateRoll, getDiceStyles } from './dice-ui';

export interface DiceSelectorOptions {
  /** Dice set to use */
  diceSet?: DiceSet;
  /** Custom dice configuration */
  customDice?: DiceConfig[];
  /** Allow selecting multiple dice */
  multiSelect?: boolean;
  /** Show possible sums */
  showPossibleSums?: boolean;
  /** Show roll button */
  showRollButton?: boolean;
  /** Auto-roll on mount */
  autoRoll?: boolean;
  /** Die size in pixels */
  dieSize?: number;
  /** Callback when dice are selected/deselected */
  onSelectionChange?: (selectedDice: DieRoll[], sum: number) => void;
  /** Callback when roll is complete */
  onRollComplete?: (result: RollResult) => void;
  /** Callback when selection is confirmed */
  onConfirm?: (selectedDice: DieRoll[], sum: number) => void;
}

export class DiceSelector {
  private container: HTMLElement;
  private options: Required<DiceSelectorOptions>;
  private currentResult: RollResult | null = null;
  private isRolling: boolean = false;

  constructor(container: HTMLElement, options: DiceSelectorOptions = {}) {
    this.container = container;
    this.options = {
      diceSet: options.diceSet || COMMON_DICE_SETS.standard,
      customDice: options.customDice || [],
      multiSelect: options.multiSelect ?? true,
      showPossibleSums: options.showPossibleSums ?? false,
      showRollButton: options.showRollButton ?? true,
      autoRoll: options.autoRoll ?? false,
      dieSize: options.dieSize ?? 60,
      onSelectionChange: options.onSelectionChange || (() => {}),
      onRollComplete: options.onRollComplete || (() => {}),
      onConfirm: options.onConfirm || (() => {}),
    };

    this.injectStyles();
    this.render();

    if (this.options.autoRoll) {
      this.roll();
    }
  }

  private injectStyles(): void {
    const styleId = 'dice-selector-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = getDiceStyles() + `
        .dice-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .dice-selector-header {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        .dice-result-area {
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dice-selector-controls {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .dice-btn {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dice-btn-primary {
          background: #1976d2;
          color: white;
        }

        .dice-btn-primary:hover:not(:disabled) {
          background: #1565c0;
          transform: translateY(-2px);
        }

        .dice-btn-success {
          background: #4caf50;
          color: white;
        }

        .dice-btn-success:hover:not(:disabled) {
          background: #43a047;
          transform: translateY(-2px);
        }

        .dice-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .dice-selection-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #e3f2fd;
          border-radius: 8px;
          min-width: 120px;
        }

        .dice-selection-label {
          font-size: 0.85rem;
          color: #666;
        }

        .dice-selection-sum {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1976d2;
        }

        .possible-sums {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          max-width: 300px;
        }

        .possible-sum {
          padding: 0.25rem 0.5rem;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #666;
        }

        .possible-sum.achievable {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .dice-placeholder {
          color: #999;
          font-style: italic;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private getDiceConfigs(): DiceConfig[] {
    if (this.options.customDice.length > 0) {
      return this.options.customDice;
    }
    return this.options.diceSet.dice;
  }

  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'dice-selector';

    // Header
    const header = document.createElement('div');
    header.className = 'dice-selector-header';
    header.textContent = this.options.diceSet.name;
    this.container.appendChild(header);

    // Result area
    const resultArea = document.createElement('div');
    resultArea.className = 'dice-result-area';
    resultArea.id = 'dice-result-area';

    if (this.currentResult) {
      renderRollResult(this.currentResult, resultArea, {
        dieSize: this.options.dieSize,
        showTotal: false,
        selectable: true,
        onDieClick: (die) => this.handleDieClick(die),
      });
    } else {
      resultArea.innerHTML = '<span class="dice-placeholder">Click Roll to begin</span>';
    }

    this.container.appendChild(resultArea);

    // Selection info
    if (this.currentResult) {
      const selectionInfo = document.createElement('div');
      selectionInfo.className = 'dice-selection-info';

      const selectedSum = getSelectedSum(this.currentResult);
      const selectedCount = this.currentResult.dice.filter(d => d.selected).length;

      selectionInfo.innerHTML = `
        <span class="dice-selection-label">${selectedCount} dice selected</span>
        <span class="dice-selection-sum">${selectedSum}</span>
      `;
      this.container.appendChild(selectionInfo);

      // Possible sums
      if (this.options.showPossibleSums) {
        const possibleSums = getAllPossibleSums(this.currentResult);
        const sumsContainer = document.createElement('div');
        sumsContainer.className = 'possible-sums';

        for (const sum of possibleSums) {
          const sumEl = document.createElement('span');
          sumEl.className = `possible-sum ${sum === selectedSum ? 'achievable' : ''}`;
          sumEl.textContent = String(sum);
          sumsContainer.appendChild(sumEl);
        }

        this.container.appendChild(sumsContainer);
      }
    }

    // Controls
    const controls = document.createElement('div');
    controls.className = 'dice-selector-controls';

    if (this.options.showRollButton) {
      const rollBtn = document.createElement('button');
      rollBtn.className = 'dice-btn dice-btn-primary';
      rollBtn.textContent = this.currentResult ? 'Roll Again' : 'Roll';
      rollBtn.disabled = this.isRolling;
      rollBtn.addEventListener('click', () => this.roll());
      controls.appendChild(rollBtn);
    }

    if (this.currentResult) {
      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'dice-btn dice-btn-success';
      confirmBtn.textContent = 'Confirm';
      confirmBtn.disabled = this.isRolling || this.currentResult.dice.filter(d => d.selected).length === 0;
      confirmBtn.addEventListener('click', () => this.confirm());
      controls.appendChild(confirmBtn);
    }

    this.container.appendChild(controls);
  }

  private handleDieClick(die: DieRoll): void {
    if (!this.currentResult || this.isRolling || die.used) return;

    if (!this.options.multiSelect) {
      // Single select mode - deselect all others first
      this.currentResult = {
        ...this.currentResult,
        dice: this.currentResult.dice.map(d => ({
          ...d,
          selected: d.id === die.id ? !d.selected : false,
        })),
      };
    } else {
      this.currentResult = toggleDieSelection(this.currentResult, die.id);
    }

    this.render();

    const selectedDice = this.currentResult.dice.filter(d => d.selected);
    const selectedSum = getSelectedSum(this.currentResult);
    this.options.onSelectionChange(selectedDice, selectedSum);
  }

  /** Roll the dice */
  public roll(): void {
    if (this.isRolling) return;

    this.isRolling = true;
    const configs = this.getDiceConfigs();
    const result = rollDice(configs);

    const resultArea = this.container.querySelector('#dice-result-area') as HTMLElement;
    if (resultArea) {
      animateRoll(resultArea, result, {
        duration: 800,
        dieSize: this.options.dieSize,
        onComplete: () => {
          this.currentResult = result;
          this.isRolling = false;
          this.render();
          this.options.onRollComplete(result);
        },
      });
    }
  }

  /** Confirm current selection */
  public confirm(): void {
    if (!this.currentResult) return;

    const selectedDice = this.currentResult.dice.filter(d => d.selected);
    const selectedSum = getSelectedSum(this.currentResult);

    if (selectedDice.length > 0) {
      this.options.onConfirm(selectedDice, selectedSum);

      // Mark selected dice as used
      const selectedIds = selectedDice.map(d => d.id);
      this.currentResult = markDiceUsed(this.currentResult, selectedIds);
      this.render();
    }
  }

  /** Get current roll result */
  public getResult(): RollResult | null {
    return this.currentResult;
  }

  /** Get selected dice */
  public getSelectedDice(): DieRoll[] {
    if (!this.currentResult) return [];
    return this.currentResult.dice.filter(d => d.selected);
  }

  /** Get sum of selected dice */
  public getSelectedSum(): number {
    if (!this.currentResult) return 0;
    return getSelectedSum(this.currentResult);
  }

  /** Reset the selector */
  public reset(): void {
    this.currentResult = null;
    this.isRolling = false;
    this.render();
  }

  /** Set a new dice set */
  public setDiceSet(diceSet: DiceSet): void {
    this.options.diceSet = diceSet;
    this.reset();
  }

  /** Destroy the selector */
  public destroy(): void {
    this.container.innerHTML = '';
  }
}

/** Create a simple roll button that returns result via callback */
export function createRollButton(
  container: HTMLElement,
  diceSet: DiceSet,
  onRoll: (result: RollResult) => void
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'dice-btn dice-btn-primary';
  btn.textContent = `Roll ${diceSet.name}`;

  btn.addEventListener('click', () => {
    const result = rollDice(diceSet.dice);
    onRoll(result);
  });

  container.appendChild(btn);
  return btn;
}
