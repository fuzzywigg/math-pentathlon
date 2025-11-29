/**
 * Dice History Component
 * Displays a history of dice rolls with their selections
 */

import type { DiceHistoryEntry } from './types';

export interface DiceHistoryOptions {
  container: HTMLElement;
  maxEntries?: number;
  showTimestamp?: boolean;
  showDiceTypes?: boolean;
  collapsible?: boolean;
  startCollapsed?: boolean;
}

/**
 * Dice History Component
 * Maintains and displays a scrollable history of dice rolls
 */
export class DiceHistory {
  private container: HTMLElement;
  private maxEntries: number;
  private showTimestamp: boolean;
  private showDiceTypes: boolean;
  private collapsible: boolean;
  private isCollapsed: boolean;

  private history: DiceHistoryEntry[] = [];

  private historyList: HTMLElement | null = null;

  constructor(options: DiceHistoryOptions) {
    this.container = options.container;
    this.maxEntries = options.maxEntries ?? 20;
    this.showTimestamp = options.showTimestamp ?? false;
    this.showDiceTypes = options.showDiceTypes ?? true;
    this.collapsible = options.collapsible ?? true;
    this.isCollapsed = options.startCollapsed ?? false;

    this.injectStyles();
    this.render();
  }

  private injectStyles(): void {
    const styleId = 'dice-history-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .dice-history {
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      .dice-history-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: #f5f5f5;
        border-bottom: 1px solid #ddd;
        cursor: pointer;
        user-select: none;
      }
      .dice-history-header:hover { background: #eeeeee; }
      .dice-history-title {
        font-weight: 600;
        font-size: 0.9rem;
        color: #333;
      }
      .dice-history-toggle {
        font-size: 12px;
        color: #666;
        transition: transform 0.2s ease;
      }
      .dice-history.collapsed .dice-history-toggle { transform: rotate(-90deg); }
      .dice-history-content {
        max-height: 300px;
        overflow-y: auto;
        transition: max-height 0.3s ease;
      }
      .dice-history.collapsed .dice-history-content {
        max-height: 0;
        overflow: hidden;
      }
      .dice-history-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .dice-history-entry {
        padding: 8px 12px;
        border-bottom: 1px solid #eee;
        font-size: 0.85rem;
      }
      .dice-history-entry:last-child { border-bottom: none; }
      .dice-history-entry:hover { background: #f9f9f9; }
      .dice-history-entry-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }
      .dice-history-entry-number { font-weight: 600; color: #666; }
      .dice-history-entry-time { font-size: 0.75rem; color: #999; }
      .dice-history-entry-dice {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        margin-bottom: 4px;
      }
      .dice-history-die {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }
      .dice-history-die-d4 { background: #e8f5e9; color: #2e7d32; }
      .dice-history-die-d6 { background: #f5f5f5; color: #424242; border: 1px solid #bdbdbd; }
      .dice-history-die-d8 { background: #e3f2fd; color: #1565c0; }
      .dice-history-die-d10 { background: #fff3e0; color: #ef6c00; }
      .dice-history-die-d12 { background: #fce4ec; color: #c2185b; }
      .dice-history-die-d20 { background: #f3e5f5; color: #7b1fa2; }
      .dice-history-die.selected { box-shadow: 0 0 0 2px #4caf50; }
      .dice-history-entry-result {
        display: flex;
        justify-content: space-between;
        color: #666;
      }
      .dice-history-entry-total { font-weight: 600; color: #1976d2; }
      .dice-history-entry-selected { color: #2e7d32; }
      .dice-history-entry-action {
        font-style: italic;
        color: #888;
        font-size: 0.8rem;
        margin-top: 4px;
      }
      .dice-history-empty {
        padding: 20px;
        text-align: center;
        color: #888;
        font-style: italic;
      }
      .dice-history-clear {
        padding: 8px 12px;
        text-align: center;
        border-top: 1px solid #ddd;
      }
      .dice-history-clear-btn {
        font-size: 0.8rem;
        color: #666;
        background: none;
        border: none;
        cursor: pointer;
        text-decoration: underline;
      }
      .dice-history-clear-btn:hover { color: #333; }
    `;
    document.head.appendChild(style);
  }

  private render(): void {
    this.container.innerHTML = '';
    this.container.classList.add('dice-history');

    if (this.isCollapsed) {
      this.container.classList.add('collapsed');
    }

    if (this.collapsible) {
      const header = document.createElement('div');
      header.classList.add('dice-history-header');
      header.addEventListener('click', () => this.toggleCollapse());

      const title = document.createElement('span');
      title.classList.add('dice-history-title');
      title.textContent = `Roll History (${this.history.length})`;
      header.appendChild(title);

      const toggle = document.createElement('span');
      toggle.classList.add('dice-history-toggle');
      toggle.textContent = '\u25BC';
      header.appendChild(toggle);

      this.container.appendChild(header);
    }

    const content = document.createElement('div');
    content.classList.add('dice-history-content');

    if (this.history.length === 0) {
      content.innerHTML = '<div class="dice-history-empty">No rolls yet</div>';
    } else {
      this.historyList = document.createElement('ul');
      this.historyList.classList.add('dice-history-list');

      const reversedHistory = [...this.history].reverse();

      for (let i = 0; i < reversedHistory.length; i++) {
        const entry = reversedHistory[i];
        const entryNumber = this.history.length - i;
        const element = this.renderEntry(entry, entryNumber);
        this.historyList.appendChild(element);
      }

      content.appendChild(this.historyList);

      if (this.history.length > 0) {
        const clearDiv = document.createElement('div');
        clearDiv.classList.add('dice-history-clear');

        const clearBtn = document.createElement('button');
        clearBtn.classList.add('dice-history-clear-btn');
        clearBtn.textContent = 'Clear History';
        clearBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.clear();
        });
        clearDiv.appendChild(clearBtn);

        content.appendChild(clearDiv);
      }
    }

    this.container.appendChild(content);
  }

  private renderEntry(entry: DiceHistoryEntry, number: number): HTMLElement {
    const li = document.createElement('li');
    li.classList.add('dice-history-entry');

    const header = document.createElement('div');
    header.classList.add('dice-history-entry-header');

    const numSpan = document.createElement('span');
    numSpan.classList.add('dice-history-entry-number');
    numSpan.textContent = `#${number}`;
    header.appendChild(numSpan);

    if (this.showTimestamp) {
      const timeSpan = document.createElement('span');
      timeSpan.classList.add('dice-history-entry-time');
      timeSpan.textContent = new Date(entry.rollResult.timestamp).toLocaleTimeString();
      header.appendChild(timeSpan);
    }

    li.appendChild(header);

    const diceDiv = document.createElement('div');
    diceDiv.classList.add('dice-history-entry-dice');

    for (const roll of entry.rollResult.rolls) {
      const dieSpan = document.createElement('span');
      dieSpan.classList.add('dice-history-die', `dice-history-die-${roll.diceType}`);

      if (entry.selectedValues.includes(roll.value)) {
        dieSpan.classList.add('selected');
      }

      if (this.showDiceTypes) {
        dieSpan.title = roll.diceType;
      }

      dieSpan.textContent = String(roll.value);
      diceDiv.appendChild(dieSpan);
    }

    li.appendChild(diceDiv);

    const resultDiv = document.createElement('div');
    resultDiv.classList.add('dice-history-entry-result');

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('dice-history-entry-total');
    totalSpan.textContent = `Total: ${entry.rollResult.total}`;
    resultDiv.appendChild(totalSpan);

    if (entry.selectedValues.length > 0) {
      const selectedSum = entry.selectedValues.reduce((a, b) => a + b, 0);
      const selectedSpan = document.createElement('span');
      selectedSpan.classList.add('dice-history-entry-selected');
      selectedSpan.textContent = `Selected: ${selectedSum}`;
      resultDiv.appendChild(selectedSpan);
    }

    li.appendChild(resultDiv);

    if (entry.action) {
      const actionDiv = document.createElement('div');
      actionDiv.classList.add('dice-history-entry-action');
      actionDiv.textContent = entry.action;
      li.appendChild(actionDiv);
    }

    return li;
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.container.classList.toggle('collapsed', this.isCollapsed);
  }

  addEntry(entry: DiceHistoryEntry): void {
    this.history.push(entry);

    if (this.history.length > this.maxEntries) {
      this.history = this.history.slice(-this.maxEntries);
    }

    this.render();

    if (this.historyList) {
      this.historyList.scrollTop = 0;
    }
  }

  updateLastEntryAction(action: string): void {
    if (this.history.length > 0) {
      this.history[this.history.length - 1].action = action;
      this.render();
    }
  }

  getHistory(): DiceHistoryEntry[] {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
    this.render();
  }

  get count(): number {
    return this.history.length;
  }
}

export function createDiceHistory(options: DiceHistoryOptions): DiceHistory {
  return new DiceHistory(options);
}
