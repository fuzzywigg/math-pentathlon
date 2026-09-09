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

/** Extra padding around click-cell targets so kids can hit the hole reliably. */
const CLICK_CELL_HIGHLIGHT_PADDING_PX = 24;
const DEFAULT_HIGHLIGHT_PADDING_PX = 8;
/** Minimum side length for the enlarged tutorial hit proxy (touch-friendly). */
const CLICK_CELL_MIN_HIT_PX = 56;

// Tutorial state manager
export class TutorialManager {
  private config: TutorialConfig | null = null;
  private currentStepIndex: number = 0;
  private isActive: boolean = false;
  private eventHandlers: TutorialEventHandler[] = [];
  private overlayElement: HTMLElement | null = null;
  private tooltipElement: HTMLElement | null = null;
  private hitProxyElement: HTMLButtonElement | null = null;
  private tapCueElement: HTMLElement | null = null;

  // Start a tutorial
  start(config: TutorialConfig): void {
    // Drop any leftover overlay (e.g. navigated away mid-tutorial)
    if (this.overlayElement || this.tooltipElement) {
      this.removeOverlay();
    }
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

  /** Reposition highlight / tap helpers after the board re-renders. */
  refreshHighlight(): void {
    if (!this.isActive) return;
    this.showCurrentStep();
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
    this.clearActionTargetHelpers();
    this.overlayElement?.remove();
    this.tooltipElement?.remove();
    this.overlayElement = null;
    this.tooltipElement = null;
  }

  /** Remove enlarged hit proxy, tap cue, and target cell class from the prior step. */
  private clearActionTargetHelpers(): void {
    document.querySelectorAll('.tutorial-tap-target').forEach((el) => {
      el.classList.remove('tutorial-tap-target');
    });
    this.hitProxyElement?.remove();
    this.hitProxyElement = null;
    this.tapCueElement?.remove();
    this.tapCueElement = null;
    const highlightRing = this.overlayElement?.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement | null;
    highlightRing?.classList.remove('tutorial-highlight-ring--action');
  }

  private applyHighlightCutout(
    backdrop: HTMLElement,
    left: number,
    top: number,
    right: number,
    bottom: number
  ): void {
    backdrop.style.clipPath = `polygon(
      0% 0%,
      0% 100%,
      ${left}px 100%,
      ${left}px ${top}px,
      ${right}px ${top}px,
      ${right}px ${bottom}px,
      ${left}px ${bottom}px,
      ${left}px 100%,
      100% 100%,
      100% 0%
    )`;
  }

  /**
   * For click-cell steps: enlarge the cutout + add a stable hit proxy and "Tap here" cue
   * so small board cells (esp. ~390px) are easier to hit.
   */
  private setupClickCellTarget(
    targetEl: HTMLElement,
    highlightLeft: number,
    highlightTop: number,
    highlightWidth: number,
    highlightHeight: number
  ): void {
    if (!this.overlayElement) return;

    targetEl.classList.add('tutorial-tap-target');

    const hitSize = Math.max(highlightWidth, highlightHeight, CLICK_CELL_MIN_HIT_PX);
    const hitLeft = highlightLeft + highlightWidth / 2 - hitSize / 2;
    const hitTop = highlightTop + highlightHeight / 2 - hitSize / 2;

    const hitProxy = document.createElement('button');
    hitProxy.type = 'button';
    hitProxy.className = 'tutorial-hit-proxy';
    hitProxy.setAttribute('aria-label', 'Tap here');
    hitProxy.style.left = `${hitLeft}px`;
    hitProxy.style.top = `${hitTop}px`;
    hitProxy.style.width = `${hitSize}px`;
    hitProxy.style.height = `${hitSize}px`;
    hitProxy.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Forward to the real board cell so game + tutorial handlers stay in sync
      targetEl.click();
    });
    this.overlayElement.appendChild(hitProxy);
    this.hitProxyElement = hitProxy;

    const cue = document.createElement('div');
    cue.className = 'tutorial-tap-cue';
    cue.textContent = 'Tap here';
    cue.setAttribute('aria-hidden', 'true');
    const cueAbove = highlightTop >= 40;
    cue.style.left = `${highlightLeft + highlightWidth / 2}px`;
    if (cueAbove) {
      cue.style.top = `${highlightTop - 8}px`;
      cue.classList.add('tutorial-tap-cue--above');
    } else {
      cue.style.top = `${highlightTop + highlightHeight + 8}px`;
      cue.classList.add('tutorial-tap-cue--below');
    }
    this.overlayElement.appendChild(cue);
    this.tapCueElement = cue;
  }

  private showCurrentStep(): void {
    const step = this.getCurrentStep();
    if (!step || !this.tooltipElement || !this.overlayElement) return;

    this.clearActionTargetHelpers();

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
        const isClickCellAction = step.requiredAction?.type === 'click-cell';
        const padding = isClickCellAction
          ? CLICK_CELL_HIGHLIGHT_PADDING_PX
          : DEFAULT_HIGHLIGHT_PADDING_PX;

        const left = rect.left - padding;
        const top = rect.top - padding;
        const width = rect.width + padding * 2;
        const height = rect.height + padding * 2;

        highlightRing.style.display = 'block';
        highlightRing.style.left = `${left}px`;
        highlightRing.style.top = `${top}px`;
        highlightRing.style.width = `${width}px`;
        highlightRing.style.height = `${height}px`;

        if (isClickCellAction) {
          highlightRing.classList.add('tutorial-highlight-ring--action');
          this.setupClickCellTarget(targetEl, left, top, width, height);
        }

        // Update backdrop clip path to cut out the (possibly enlarged) highlight area
        this.applyHighlightCutout(backdrop, left, top, left + width, top + height);

        // Position tooltip relative to highlight
        this.positionTooltip(rect, step.position ?? 'bottom');
      } else if (highlightRing) {
        // Selector set but target not in DOM yet — clear stale ring from prior step
        this.clearHighlight(highlightRing, backdrop);
      }
    } else {
      // No highlight - center tooltip
      this.clearHighlight(highlightRing, backdrop);
    }

    // Call onShow callback
    if (step.onShow) {
      step.onShow();
    }
  }

  private clearHighlight(highlightRing: HTMLElement, backdrop: HTMLElement): void {
    highlightRing.style.display = 'none';
    highlightRing.classList.remove('tutorial-highlight-ring--action');
    backdrop.style.clipPath = 'none';
    this.positionTooltipCenter();
  }

  private positionTooltip(
    targetRect: DOMRect,
    position: NonNullable<TutorialStep['position']>,
  ): void {
    if (!this.tooltipElement) return;

    if (position === 'center') {
      this.positionTooltipCenter();
      return;
    }

    const { width, height } = this.prepareTooltipForAbsolutePosition();
    const margin = 16;

    let left: number;
    let top: number;

    switch (position) {
      case 'top':
        left = targetRect.left + (targetRect.width - width) / 2;
        top = targetRect.top - height - margin;
        break;
      case 'bottom':
        left = targetRect.left + (targetRect.width - width) / 2;
        top = targetRect.bottom + margin;
        break;
      case 'left':
        left = targetRect.left - width - margin;
        top = targetRect.top + (targetRect.height - height) / 2;
        break;
      case 'right':
        left = targetRect.right + margin;
        top = targetRect.top + (targetRect.height - height) / 2;
        break;
      default: {
        const _exhaustive: never = position;
        void _exhaustive;
        this.positionTooltipCenter();
        return;
      }
    }

    this.applyClampedTooltipPosition(left, top, width, height, margin);
  }

  private positionTooltipCenter(): void {
    if (!this.tooltipElement) return;

    const margin = 16;
    const { width, height } = this.prepareTooltipForAbsolutePosition();
    const { width: viewportWidth, height: viewportHeight, offsetLeft, offsetTop } =
      this.getViewportMetrics();

    const left = offsetLeft + (viewportWidth - width) / 2;
    const top = offsetTop + (viewportHeight - height) / 2;
    this.applyClampedTooltipPosition(left, top, width, height, margin);
  }

  /**
   * Clear centering transforms / CSS margin and constrain width so size
   * measurements match the box we will place with left/top.
   */
  private prepareTooltipForAbsolutePosition(): { width: number; height: number } {
    const tooltip = this.tooltipElement!;
    const margin = 16;
    const { width: viewportWidth } = this.getViewportMetrics();
    const maxWidth = Math.max(0, viewportWidth - margin * 2);

    tooltip.style.transform = 'none';
    tooltip.style.margin = '0';
    tooltip.style.right = 'auto';
    tooltip.style.bottom = 'auto';
    tooltip.style.maxWidth = `${maxWidth}px`;
    tooltip.style.width = '';
    // Park off-layout briefly so prior left/top/50% do not skew measurement
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';

    const width = Math.min(tooltip.offsetWidth || maxWidth, maxWidth);
    const height = tooltip.offsetHeight;
    return { width, height };
  }

  private applyClampedTooltipPosition(
    left: number,
    top: number,
    width: number,
    height: number,
    margin: number,
  ): void {
    if (!this.tooltipElement) return;

    const tooltip = this.tooltipElement;
    const { width: viewportWidth, height: viewportHeight, offsetLeft, offsetTop } =
      this.getViewportMetrics();

    const minLeft = offsetLeft + margin;
    const minTop = offsetTop + margin;
    // When the tooltip is wider/taller than the viewport, pin to the min edge
    // so text starts on-screen (never negative / mid-word clipped).
    const maxLeft = Math.max(minLeft, offsetLeft + viewportWidth - width - margin);
    const maxTop = Math.max(minTop, offsetTop + viewportHeight - height - margin);

    const clampedLeft = Math.min(Math.max(left, minLeft), maxLeft);
    const clampedTop = Math.min(Math.max(top, minTop), maxTop);

    tooltip.style.left = `${clampedLeft}px`;
    tooltip.style.top = `${clampedTop}px`;
  }

  private getViewportMetrics(): {
    width: number;
    height: number;
    offsetLeft: number;
    offsetTop: number;
  } {
    const vv = window.visualViewport;
    if (vv) {
      return {
        width: vv.width,
        height: vv.height,
        offsetLeft: vv.offsetLeft,
        offsetTop: vv.offsetTop,
      };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      offsetLeft: 0,
      offsetTop: 0,
    };
  }
}

// Singleton instance
export const tutorialManager = new TutorialManager();
