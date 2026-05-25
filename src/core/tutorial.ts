// Tutorial System - Provides step-by-step guidance for learning games

export interface TutorialStep {
  id: string;
  title: string;
  message: string;
  // Highlight specific elements (CSS selectors)
  highlightSelector?: string;
  // Position for tooltip: which side of the highlighted element
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  // Required action to proceed (optional - if not set, user clicks "Next")
  requiredAction?: {
    type: 'click';
    selector: string;
  } | {
    type: 'click-cell';
    row: number;
    col: number;
  };
  // Callback when step is shown
  onShow?: () => void;
  // Callback when step is completed
  onComplete?: () => void;
}

export interface TutorialConfig {
  id: string;
  name: string;
  steps: TutorialStep[];
}

export type TutorialEventHandler = (event: TutorialEvent) => void;

export interface TutorialEvent {
  type: 'step-changed' | 'completed' | 'exited';
  stepIndex?: number;
  step?: TutorialStep;
}

// Tutorial state manager
export class TutorialManager {
  private config: TutorialConfig | null = null;
  private currentStepIndex: number = 0;
  private isActive: boolean = false;
  private eventHandlers: TutorialEventHandler[] = [];
  private overlayElement: HTMLElement | null = null;
  private tooltipElement: HTMLElement | null = null;

  // Start a tutorial
  start(config: TutorialConfig): void {
    this.config = config;
    this.currentStepIndex = 0;
    this.isActive = true;
    this.createOverlay();
    this.showCurrentStep();
  }

  // Get current step
  getCurrentStep(): TutorialStep | null {
    if (!this.config || !this.isActive) return null;
    return this.config.steps[this.currentStepIndex] || null;
  }

  // Get current step index
  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  // Get total steps
  getTotalSteps(): number {
    return this.config?.steps.length || 0;
  }

  // Check if tutorial is active
  getIsActive(): boolean {
    return this.isActive;
  }

  // Move to next step
  nextStep(): void {
    if (!this.config || !this.isActive) return;

    const currentStep = this.getCurrentStep();
    if (currentStep?.onComplete) {
      currentStep.onComplete();
    }

    this.currentStepIndex++;

    if (this.currentStepIndex >= this.config.steps.length) {
      this.complete();
    } else {
      this.showCurrentStep();
      this.emit({ type: 'step-changed', stepIndex: this.currentStepIndex, step: this.getCurrentStep()! });
    }
  }

  // Move to previous step
  prevStep(): void {
    if (!this.config || !this.isActive || this.currentStepIndex === 0) return;

    this.currentStepIndex--;
    this.showCurrentStep();
    this.emit({ type: 'step-changed', stepIndex: this.currentStepIndex, step: this.getCurrentStep()! });
  }

  // Complete the tutorial
  complete(): void {
    this.isActive = false;
    this.removeOverlay();
    this.emit({ type: 'completed' });
    this.config = null;
  }

  // Exit the tutorial early
  exit(): void {
    this.isActive = false;
    this.removeOverlay();
    this.emit({ type: 'exited' });
    this.config = null;
  }

  // Handle an action (e.g., cell click) to check if it completes the current step
  handleAction(actionType: string, data?: { row?: number; col?: number; selector?: string }): boolean {
    const step = this.getCurrentStep();
    if (!step?.requiredAction) return false;

    if (step.requiredAction.type === 'click-cell' && actionType === 'click-cell') {
      if (data?.row === step.requiredAction.row && data?.col === step.requiredAction.col) {
        this.nextStep();
        return true;
      }
    } else if (step.requiredAction.type === 'click' && actionType === 'click') {
      if (data?.selector === step.requiredAction.selector) {
        this.nextStep();
        return true;
      }
    }

    return false;
  }

  // Subscribe to events
  on(handler: TutorialEventHandler): () => void {
    this.eventHandlers.push(handler);
    return () => {
      this.eventHandlers = this.eventHandlers.filter((h) => h !== handler);
    };
  }

  private emit(event: TutorialEvent): void {
    this.eventHandlers.forEach((handler) => handler(event));
  }

  private createOverlay(): void {
    // Create overlay container
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'tutorial-overlay';
    this.overlayElement.innerHTML = `
      <div class="tutorial-backdrop"></div>
      <div class="tutorial-highlight-ring"></div>
    `;

    // Create tooltip
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'tutorial-tooltip';
    this.tooltipElement.innerHTML = `
      <div class="tutorial-tooltip-header">
        <span class="tutorial-step-counter"></span>
        <button class="tutorial-exit-btn" aria-label="Exit tutorial">&times;</button>
      </div>
      <h3 class="tutorial-tooltip-title"></h3>
      <p class="tutorial-tooltip-message"></p>
      <div class="tutorial-tooltip-actions">
        <button class="tutorial-prev-btn">Back</button>
        <button class="tutorial-next-btn">Next</button>
      </div>
    `;

    document.body.appendChild(this.overlayElement);
    document.body.appendChild(this.tooltipElement);

    // Wire up buttons
    const exitBtn = this.tooltipElement.querySelector('.tutorial-exit-btn');
    const prevBtn = this.tooltipElement.querySelector('.tutorial-prev-btn');
    const nextBtn = this.tooltipElement.querySelector('.tutorial-next-btn');

    exitBtn?.addEventListener('click', () => this.exit());
    prevBtn?.addEventListener('click', () => this.prevStep());
    nextBtn?.addEventListener('click', () => {
      const step = this.getCurrentStep();
      // Only allow Next if there's no required action
      if (!step?.requiredAction) {
        this.nextStep();
      }
    });

    // Escape key to exit
    document.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.isActive) return;
    if (e.key === 'Escape') {
      this.exit();
    }
  };

  private removeOverlay(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.overlayElement?.remove();
    this.tooltipElement?.remove();
    this.overlayElement = null;
    this.tooltipElement = null;
  }

  private showCurrentStep(): void {
    const step = this.getCurrentStep();
    if (!step || !this.tooltipElement || !this.overlayElement) return;

    // Update tooltip content
    const titleEl = this.tooltipElement.querySelector('.tutorial-tooltip-title');
    const messageEl = this.tooltipElement.querySelector('.tutorial-tooltip-message');
    const counterEl = this.tooltipElement.querySelector('.tutorial-step-counter');
    const prevBtn = this.tooltipElement.querySelector('.tutorial-prev-btn') as HTMLButtonElement;
    const nextBtn = this.tooltipElement.querySelector('.tutorial-next-btn') as HTMLButtonElement;

    if (titleEl) titleEl.textContent = step.title;
    if (messageEl) messageEl.innerHTML = step.message;
    if (counterEl) counterEl.textContent = `Step ${this.currentStepIndex + 1} of ${this.getTotalSteps()}`;

    // Update button states
    if (prevBtn) {
      prevBtn.disabled = this.currentStepIndex === 0;
      prevBtn.style.visibility = this.currentStepIndex === 0 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      const isLastStep = this.currentStepIndex === this.getTotalSteps() - 1;
      const hasRequiredAction = !!step.requiredAction;
      nextBtn.textContent = isLastStep ? 'Finish' : 'Next';
      nextBtn.disabled = hasRequiredAction;

      if (hasRequiredAction) {
        nextBtn.textContent = 'Complete the action above';
        nextBtn.classList.add('tutorial-btn-waiting');
      } else {
        nextBtn.classList.remove('tutorial-btn-waiting');
      }
    }

    // Position highlight ring
    const highlightRing = this.overlayElement.querySelector('.tutorial-highlight-ring') as HTMLElement;
    const backdrop = this.overlayElement.querySelector('.tutorial-backdrop') as HTMLElement;

    if (step.highlightSelector) {
      const targetEl = document.querySelector(step.highlightSelector) as HTMLElement;
      if (targetEl && highlightRing) {
        const rect = targetEl.getBoundingClientRect();
        const padding = 8;

        highlightRing.style.display = 'block';
        highlightRing.style.left = `${rect.left - padding}px`;
        highlightRing.style.top = `${rect.top - padding}px`;
        highlightRing.style.width = `${rect.width + padding * 2}px`;
        highlightRing.style.height = `${rect.height + padding * 2}px`;

        // Update backdrop clip path to cut out the highlight area
        backdrop.style.clipPath = `polygon(
          0% 0%,
          0% 100%,
          ${rect.left - padding}px 100%,
          ${rect.left - padding}px ${rect.top - padding}px,
          ${rect.right + padding}px ${rect.top - padding}px,
          ${rect.right + padding}px ${rect.bottom + padding}px,
          ${rect.left - padding}px ${rect.bottom + padding}px,
          ${rect.left - padding}px 100%,
          100% 100%,
          100% 0%
        )`;

        // Position tooltip relative to highlight
        this.positionTooltip(rect, step.position || 'bottom');
      }
    } else {
      // No highlight - center tooltip
      highlightRing.style.display = 'none';
      backdrop.style.clipPath = 'none';
      this.positionTooltipCenter();
    }

    // Call onShow callback
    if (step.onShow) {
      step.onShow();
    }
  }

  private positionTooltip(targetRect: DOMRect, position: string): void {
    if (!this.tooltipElement) return;

    const tooltip = this.tooltipElement;
    const tooltipRect = tooltip.getBoundingClientRect();
    const margin = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left: number;
    let top: number;

    switch (position) {
      case 'top':
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        top = targetRect.top - tooltipRect.height - margin;
        break;
      case 'bottom':
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        top = targetRect.bottom + margin;
        break;
      case 'left':
        left = targetRect.left - tooltipRect.width - margin;
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        left = targetRect.right + margin;
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        break;
      default:
        this.positionTooltipCenter();
        return;
    }

    // Keep tooltip within viewport
    left = Math.max(margin, Math.min(left, viewportWidth - tooltipRect.width - margin));
    top = Math.max(margin, Math.min(top, viewportHeight - tooltipRect.height - margin));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  private positionTooltipCenter(): void {
    if (!this.tooltipElement) return;

    const tooltip = this.tooltipElement;
    tooltip.style.left = '50%';
    tooltip.style.top = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
  }
}

// Singleton instance
export const tutorialManager = new TutorialManager();
