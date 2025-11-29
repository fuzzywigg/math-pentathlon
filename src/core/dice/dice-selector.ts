/**
 * Dice Selector Component
 * Interactive UI for rolling dice and selecting results
 */

import type {
  DiceRollConfig,
  DiceSelectorState,
  DiceHistoryEntry,
  DiceAnimationConfig,
} from './types';
import { DEFAULT_ANIMATION_CONFIG } from './types';
import {
  rollDice,
  rerollDice,
  toggleDiceSelection,
  lockDice,
  unlockDice,
  getSelectedValues,
  getSelectedTotal,
  isValidSelection,
} from './roller';
import { animateDiceRoll, renderDiceRollResult, getDiceStyles } from './dice-ui';

export interface DiceSelectorOptions {
  config: DiceRollConfig;
  container: HTMLElement;
  animationConfig?: DiceAnimationConfig;
  onSelectionChange?: (selectedValues: number[], total: number) => void;
  onRollComplete?: (entry: DiceHistoryEntry) => void;
  onConfirm?: (selectedValues: number[], total: number) => void;
  showTotal?: boolean;
  showRerollButton?: boolean;
  showConfirmButton?: boolean;
  confirmButtonText?: string;
}

/**
 * Dice Selector Component
 * Manages the full dice rolling and selection UI
 */
export class DiceSelector {
  private state: DiceSelectorState;
  private config: DiceRollConfig;
  private container: HTMLElement;
  private animationConfig: DiceAnimationConfig;
  private history: DiceHistoryEntry[] = [];

  private onSelectionChange?: (selectedValues: number[], total: number) => void;
  private onRollComplete?: (entry: DiceHistoryEntry) => void;
  private onConfirm?: (selectedValues: number[], total: number) => void;

  private showTotal: boolean;
  private showRerollButton: boolean;
  private showConfirmButton: boolean;
  private confirmButtonText: string;

  private diceContainer: HTMLElement | null = null;
  private controlsContainer: HTMLElement | null = null;
  private rollButton: HTMLButtonElement | null = null;
  private rerollButton: HTMLButtonElement | null = null;
  private confirmButton: HTMLButtonElement | null = null;
  private selectedDisplay: HTMLElement | null = null;

  constructor(options: DiceSelectorOptions) {
    this.config = options.config;
    this.container = options.container;
    this.animationConfig = options.animationConfig || DEFAULT_ANIMATION_CONFIG;
    this.onSelectionChange = options.onSelectionChange;
    this.onRollComplete = options.onRollComplete;
    this.onConfirm = options.onConfirm;
    this.showTotal = options.showTotal ?? true;
    this.showRerollButton = options.showRerollButton ?? (options.config.allowReroll ?? false);
    this.showConfirmButton = options.showConfirmButton ?? true;
    this.confirmButtonText = options.confirmButtonText ?? 'Confirm Selection';

    this.state = {
      currentRoll: null,
      selectedDice: [],
      lockedDice: [],
      rerollsRemaining: options.config.maxRerolls ?? 0,
      isRolling: false,
    };

    this.injectStyles();
    this.render();
  }

  private injectStyles(): void {
    const styleId = 'dice-selector-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = getDiceStyles() + this.getSelectorStyles();
    document.head.appendChild(style);
  }

  private getSelectorStyles(): string {
    return `
      .dice-selector {
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }
      .dice-selector-controls {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 16px;
        flex-wrap: wrap;
      }
      .dice-selector-btn {
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.1s ease;
      }
      .dice-selector-btn:hover:not(:disabled) { transform: scale(1.02); }
      .dice-selector-btn:active:not(:disabled) { transform: scale(0.98); }
      .dice-selector-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .dice-selector-btn-roll { background-color: #1976d2; color: white; }
      .dice-selector-btn-roll:hover:not(:disabled) { background-color: #1565c0; }
      .dice-selector-btn-reroll { background-color: #ff9800; color: white; }
      .dice-selector-btn-reroll:hover:not(:disabled) { background-color: #f57c00; }
      .dice-selector-btn-confirm { background-color: #4caf50; color: white; }
      .dice-selector-btn-confirm:hover:not(:disabled) { background-color: #43a047; }
      .dice-selector-selected {
        margin-top: 16px;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 8px;
        font-size: 1.1rem;
      }
      .dice-selector-selected-values { font-weight: bold; color: #1976d2; }
      .dice-selector-selected-total {
        margin-top: 4px;
        font-size: 1.25rem;
        font-weight: bold;
        color: #2e7d32;
      }
      .dice-selector-hint {
        margin-top: 12px;
        font-size: 0.9rem;
        color: #666;
        font-style: italic;
      }
      .dice-selector-empty { padding: 40px; color: #888; font-style: italic; }
    `;
  }

  private render(): void {
    this.container.innerHTML = '';
    this.container.classList.add('dice-selector');

    this.diceContainer = document.createElement('div');
    this.diceContainer.classList.add('dice-selector-dice');

    if (this.state.currentRoll) {
      renderDiceRollResult(
        this.state.currentRoll,
        this.diceContainer,
        (dieId) => this.handleDieClick(dieId)
      );
    } else {
      this.diceContainer.innerHTML = '<div class="dice-selector-empty">Click Roll to start</div>';
    }

    this.container.appendChild(this.diceContainer);

    if (this.showTotal && this.state.currentRoll) {
      this.selectedDisplay = document.createElement('div');
      this.selectedDisplay.classList.add('dice-selector-selected');
      this.updateSelectedDisplay();
      this.container.appendChild(this.selectedDisplay);
    }

    if (this.state.currentRoll && !this.state.isRolling) {
      const hint = document.createElement('div');
      hint.classList.add('dice-selector-hint');
      if (this.config.minSelectable || this.config.maxSelectable) {
        const min = this.config.minSelectable ?? 0;
        const max = this.config.maxSelectable ?? this.state.currentRoll.rolls.length;
        hint.textContent = `Select ${min === max ? min : `${min}-${max}`} dice`;
      } else {
        hint.textContent = 'Click dice to select/deselect';
      }
      this.container.appendChild(hint);
    }

    this.controlsContainer = document.createElement('div');
    this.controlsContainer.classList.add('dice-selector-controls');

    this.rollButton = document.createElement('button');
    this.rollButton.classList.add('dice-selector-btn', 'dice-selector-btn-roll');
    this.rollButton.textContent = this.state.currentRoll ? 'Roll Again' : 'Roll';
    this.rollButton.disabled = this.state.isRolling;
    this.rollButton.addEventListener('click', () => this.roll());
    this.controlsContainer.appendChild(this.rollButton);

    if (this.showRerollButton && this.state.currentRoll) {
      this.rerollButton = document.createElement('button');
      this.rerollButton.classList.add('dice-selector-btn', 'dice-selector-btn-reroll');
      this.rerollButton.textContent = `Reroll (${this.state.rerollsRemaining} left)`;
      this.rerollButton.disabled =
        this.state.isRolling ||
        this.state.rerollsRemaining <= 0 ||
        this.state.selectedDice.length === 0;
      this.rerollButton.addEventListener('click', () => this.reroll());
      this.controlsContainer.appendChild(this.rerollButton);
    }

    if (this.showConfirmButton && this.state.currentRoll) {
      this.confirmButton = document.createElement('button');
      this.confirmButton.classList.add('dice-selector-btn', 'dice-selector-btn-confirm');
      this.confirmButton.textContent = this.confirmButtonText;
      this.confirmButton.disabled =
        this.state.isRolling || !isValidSelection(this.state.currentRoll, this.config);
      this.confirmButton.addEventListener('click', () => this.confirm());
      this.controlsContainer.appendChild(this.confirmButton);
    }

    this.container.appendChild(this.controlsContainer);
  }

  private updateSelectedDisplay(): void {
    if (!this.selectedDisplay || !this.state.currentRoll) return;
    const selectedValues = getSelectedValues(this.state.currentRoll);
    const total = getSelectedTotal(this.state.currentRoll);
    if (selectedValues.length === 0) {
      this.selectedDisplay.innerHTML = '<div>No dice selected</div>';
    } else {
      this.selectedDisplay.innerHTML = `
        <div>Selected: <span class="dice-selector-selected-values">${selectedValues.join(', ')}</span></div>
        <div class="dice-selector-selected-total">Total: ${total}</div>
      `;
    }
  }

  private handleDieClick(dieId: string): void {
    if (this.state.isRolling || !this.state.currentRoll) return;
    const newRoll = toggleDiceSelection(this.state.currentRoll, dieId);
    this.state.currentRoll = newRoll;
    const roll = newRoll.rolls.find((r) => r.id === dieId);
    if (roll?.isSelected) {
      this.state.selectedDice.push(dieId);
    } else {
      this.state.selectedDice = this.state.selectedDice.filter((id) => id !== dieId);
    }
    this.render();
    if (this.onSelectionChange) {
      this.onSelectionChange(getSelectedValues(newRoll), getSelectedTotal(newRoll));
    }
  }

  async roll(): Promise<void> {
    this.state.isRolling = true;
    this.state.selectedDice = [];
    this.state.lockedDice = [];
    this.state.rerollsRemaining = this.config.maxRerolls ?? 0;
    this.render();
    const result = rollDice(this.config);
    this.state.currentRoll = result;
    if (this.diceContainer) {
      await animateDiceRoll(
        this.diceContainer,
        result,
        this.animationConfig,
        (dieId) => this.handleDieClick(dieId)
      );
    }
    this.state.isRolling = false;
    this.render();
    const entry: DiceHistoryEntry = { rollResult: result, selectedValues: [] };
    this.history.push(entry);
    if (this.onRollComplete) {
      this.onRollComplete(entry);
    }
  }

  async reroll(): Promise<void> {
    if (!this.state.currentRoll || this.state.rerollsRemaining <= 0) return;
    this.state.isRolling = true;
    this.state.rerollsRemaining--;
    this.render();
    const result = rerollDice(this.state.currentRoll, this.state.selectedDice);
    this.state.currentRoll = result;
    this.state.selectedDice = [];
    if (this.diceContainer) {
      await animateDiceRoll(
        this.diceContainer,
        result,
        this.animationConfig,
        (dieId) => this.handleDieClick(dieId)
      );
    }
    this.state.isRolling = false;
    this.render();
  }

  confirm(): void {
    if (!this.state.currentRoll || !isValidSelection(this.state.currentRoll, this.config)) return;
    const selectedValues = getSelectedValues(this.state.currentRoll);
    const total = getSelectedTotal(this.state.currentRoll);
    if (this.history.length > 0) {
      this.history[this.history.length - 1].selectedValues = selectedValues;
    }
    if (this.onConfirm) {
      this.onConfirm(selectedValues, total);
    }
  }

  getState(): DiceSelectorState {
    return { ...this.state };
  }

  getHistory(): DiceHistoryEntry[] {
    return [...this.history];
  }

  reset(): void {
    this.state = {
      currentRoll: null,
      selectedDice: [],
      lockedDice: [],
      rerollsRemaining: this.config.maxRerolls ?? 0,
      isRolling: false,
    };
    this.history = [];
    this.render();
  }

  lockSelectedDice(): void {
    if (!this.state.currentRoll) return;
    this.state.currentRoll = lockDice(this.state.currentRoll, this.state.selectedDice);
    this.state.lockedDice = [...this.state.lockedDice, ...this.state.selectedDice];
    this.state.selectedDice = [];
    this.render();
  }

  unlockAllDice(): void {
    if (!this.state.currentRoll) return;
    this.state.currentRoll = unlockDice(this.state.currentRoll, this.state.lockedDice);
    this.state.lockedDice = [];
    this.render();
  }
}

export function createDiceSelector(options: DiceSelectorOptions): DiceSelector {
  return new DiceSelector(options);
}
