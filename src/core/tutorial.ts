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
/** Gap kept between tooltip and the highlight / tap cue (px). */
const TOOLTIP_AVOID_GAP_PX = 12;
/** Approximate height of the "Tap here" cue including arrow (for avoid rect). */
const TAP_CUE_AVOID_HEIGHT_PX = 36;
/** Prefer compact tooltip when the viewport is this narrow or less. */
const COMPACT_TOOLTIP_VIEWPORT_PX = 480;

type TooltipSide = Exclude<NonNullable<TutorialStep['position']>, 'center'>;

interface AvoidRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

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
   * @returns whether the Tap here cue was placed above the highlight
   */
  private setupClickCellTarget(
    targetEl: HTMLElement,
    highlightLeft: number,
    highlightTop: number,
    highlightWidth: number,
    highlightHeight: number
  ): boolean {
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
    // Append to body (not overlay) so z-index stacks above the tooltip sibling
    document.body.appendChild(hitProxy);
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
    document.body.appendChild(cue);
    this.tapCueElement = cue;
    return cueAbove;
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

        let cueAbove = false;
        if (isClickCellAction) {
          highlightRing.classList.add('tutorial-highlight-ring--action');
          cueAbove = this.setupClickCellTarget(targetEl, left, top, width, height);
        }

        // Update backdrop clip path to cut out the (possibly enlarged) highlight area
        this.applyHighlightCutout(backdrop, left, top, left + width, top + height);

        // Keep tooltip clear of highlight cutout (+ Tap here cue / hit proxy for click-cell)
        const avoidRect = this.buildAvoidRect(left, top, width, height, isClickCellAction, cueAbove);
        this.positionTooltip(rect, step.position ?? 'bottom', avoidRect);
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

  /**
   * Rect the tooltip must not cover: highlight cutout, and for click-cell also
   * the Tap here cue band + enlarged hit proxy footprint.
   */
  private buildAvoidRect(
    highlightLeft: number,
    highlightTop: number,
    highlightWidth: number,
    highlightHeight: number,
    isClickCellAction: boolean,
    cueAbove: boolean,
  ): AvoidRect {
    let left = highlightLeft;
    let top = highlightTop;
    let right = highlightLeft + highlightWidth;
    let bottom = highlightTop + highlightHeight;

    if (isClickCellAction) {
      const hitSize = Math.max(highlightWidth, highlightHeight, CLICK_CELL_MIN_HIT_PX);
      const hitLeft = highlightLeft + highlightWidth / 2 - hitSize / 2;
      const hitTop = highlightTop + highlightHeight / 2 - hitSize / 2;
      left = Math.min(left, hitLeft);
      top = Math.min(top, hitTop);
      right = Math.max(right, hitLeft + hitSize);
      bottom = Math.max(bottom, hitTop + hitSize);

      if (cueAbove) {
        top -= TAP_CUE_AVOID_HEIGHT_PX;
      } else {
        bottom += TAP_CUE_AVOID_HEIGHT_PX;
      }
    }

    return { left, top, right, bottom };
  }

  private positionTooltip(
    targetRect: DOMRect,
    position: NonNullable<TutorialStep['position']>,
    avoidRect?: AvoidRect,
  ): void {
    if (!this.tooltipElement) return;

    if (position === 'center') {
      this.positionTooltipCenter();
      return;
    }

    const margin = 16;
    const { width: viewportWidth } = this.getViewportMetrics();
    const preferCompact = viewportWidth <= COMPACT_TOOLTIP_VIEWPORT_PX;
    const clearRect: AvoidRect = avoidRect ?? {
      left: targetRect.left,
      top: targetRect.top,
      right: targetRect.right,
      bottom: targetRect.bottom,
    };

    // Try preferred size first; if every side overlaps the target, compact and retry
    const tryPlace = (compact: boolean): boolean => {
      const { width, height } = this.prepareTooltipForAbsolutePosition(compact);
      return this.placeTooltipAvoidingTarget(position, width, height, margin, clearRect);
    };

    if (tryPlace(preferCompact)) return;
    if (!preferCompact && tryPlace(true)) return;

    // Last resort: keep preferred side clamped in-viewport (may still overlap on tiny screens)
    const { width, height } = this.prepareTooltipForAbsolutePosition(preferCompact);
    const fallback = this.computeSidePosition(position, clearRect, width, height, margin);
    this.applyClampedTooltipPosition(fallback.left, fallback.top, width, height, margin);
  }

  /**
   * Try preferred side first, then flip to other sides until the tooltip stays
   * in-viewport and clear of the highlight / Tap here avoid rect.
   */
  private placeTooltipAvoidingTarget(
    preferred: TooltipSide,
    width: number,
    height: number,
    margin: number,
    avoidRect: AvoidRect,
  ): boolean {
    const sides = this.orderedTooltipSides(preferred, avoidRect, width, height, margin);

    for (const side of sides) {
      const raw = this.computeSidePosition(side, avoidRect, width, height, margin);
      const { left, top } = this.clampTooltipCoords(raw.left, raw.top, width, height, margin);
      const tooltipBox: AvoidRect = {
        left,
        top,
        right: left + width,
        bottom: top + height,
      };

      if (!this.rectsOverlap(tooltipBox, avoidRect, TOOLTIP_AVOID_GAP_PX)) {
        this.applyTooltipCoords(left, top);
        return true;
      }
    }

    // No side fully clears the target after clamp — try parking in the largest
    // free band above or below the avoid rect (common on ~390px phones).
    const parked = this.parkTooltipInFreeBand(avoidRect, width, height, margin);
    if (parked) {
      this.applyTooltipCoords(parked.left, parked.top);
      return true;
    }

    return false;
  }

  /**
   * Place the tooltip fully above or below the avoid rect (horizontally centered
   * in the viewport), choosing the band with more free space.
   */
  private parkTooltipInFreeBand(
    avoidRect: AvoidRect,
    width: number,
    height: number,
    margin: number,
  ): { left: number; top: number } | null {
    const { width: vw, height: vh, offsetLeft, offsetTop } = this.getViewportMetrics();
    const gap = TOOLTIP_AVOID_GAP_PX;
    const centerLeft = offsetLeft + (vw - width) / 2;

    const belowTop = avoidRect.bottom + gap;
    const aboveTop = avoidRect.top - height - gap;
    const spaceBelow = offsetTop + vh - margin - belowTop;
    const spaceAbove = aboveTop - (offsetTop + margin);

    const candidates: { left: number; top: number; space: number }[] = [];
    if (spaceBelow >= height) {
      candidates.push({ left: centerLeft, top: belowTop, space: spaceBelow });
    }
    if (spaceAbove >= height) {
      candidates.push({ left: centerLeft, top: aboveTop, space: spaceAbove });
    }
    if (candidates.length === 0) return null;

    candidates.sort((a, b) => b.space - a.space);
    const best = candidates[0]!;
    return this.clampTooltipCoords(best.left, best.top, width, height, margin);
  }

  /** Preferred side first, then sides with the most free viewport space. */
  private orderedTooltipSides(
    preferred: TooltipSide,
    avoidRect: AvoidRect,
    width: number,
    height: number,
    margin: number,
  ): TooltipSide[] {
    const { width: vw, height: vh, offsetLeft, offsetTop } = this.getViewportMetrics();

    const space: Record<TooltipSide, number> = {
      top: avoidRect.top - offsetTop - margin,
      bottom: offsetTop + vh - avoidRect.bottom - margin,
      left: avoidRect.left - offsetLeft - margin,
      right: offsetLeft + vw - avoidRect.right - margin,
    };

    // Only count a side as viable if the tooltip could roughly fit there
    const fits: Record<TooltipSide, boolean> = {
      top: space.top >= height + TOOLTIP_AVOID_GAP_PX,
      bottom: space.bottom >= height + TOOLTIP_AVOID_GAP_PX,
      left: space.left >= width + TOOLTIP_AVOID_GAP_PX,
      right: space.right >= width + TOOLTIP_AVOID_GAP_PX,
    };

    const rest: TooltipSide[] = (['bottom', 'top', 'right', 'left'] as TooltipSide[])
      .filter((s) => s !== preferred)
      .sort((a, b) => {
        const score = (s: TooltipSide) => (fits[s] ? 1_000_000 : 0) + space[s];
        return score(b) - score(a);
      });

    return [preferred, ...rest];
  }

  private computeSidePosition(
    position: TooltipSide,
    anchor: AvoidRect,
    width: number,
    height: number,
    margin: number,
  ): { left: number; top: number } {
    const gap = Math.max(margin, TOOLTIP_AVOID_GAP_PX);
    const anchorWidth = anchor.right - anchor.left;
    const anchorHeight = anchor.bottom - anchor.top;
    const centerX = anchor.left + anchorWidth / 2;
    const centerY = anchor.top + anchorHeight / 2;

    switch (position) {
      case 'top':
        return {
          left: centerX - width / 2,
          top: anchor.top - height - gap,
        };
      case 'bottom':
        return {
          left: centerX - width / 2,
          top: anchor.bottom + gap,
        };
      case 'left':
        return {
          left: anchor.left - width - gap,
          top: centerY - height / 2,
        };
      case 'right':
        return {
          left: anchor.right + gap,
          top: centerY - height / 2,
        };
      default: {
        const _exhaustive: never = position;
        void _exhaustive;
        return {
          left: centerX - width / 2,
          top: anchor.bottom + gap,
        };
      }
    }
  }

  private rectsOverlap(a: AvoidRect, b: AvoidRect, gap: number): boolean {
    return !(
      a.right + gap <= b.left ||
      a.left >= b.right + gap ||
      a.bottom + gap <= b.top ||
      a.top >= b.bottom + gap
    );
  }

  private positionTooltipCenter(): void {
    if (!this.tooltipElement) return;

    const margin = 16;
    const { width: viewportWidth } = this.getViewportMetrics();
    const compact = viewportWidth <= COMPACT_TOOLTIP_VIEWPORT_PX;
    const { width, height } = this.prepareTooltipForAbsolutePosition(compact);
    const { width: vw, height: vh, offsetLeft, offsetTop } = this.getViewportMetrics();

    const left = offsetLeft + (vw - width) / 2;
    const top = offsetTop + (vh - height) / 2;
    this.applyClampedTooltipPosition(left, top, width, height, margin);
  }

  /**
   * Clear centering transforms / CSS margin and constrain width so size
   * measurements match the box we will place with left/top.
   */
  private prepareTooltipForAbsolutePosition(compact = false): { width: number; height: number } {
    const tooltip = this.tooltipElement!;
    const margin = 16;
    const { width: viewportWidth } = this.getViewportMetrics();
    const maxWidth = Math.max(0, viewportWidth - margin * 2);

    tooltip.classList.toggle('tutorial-tooltip--compact', compact);
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

  private clampTooltipCoords(
    left: number,
    top: number,
    width: number,
    height: number,
    margin: number,
  ): { left: number; top: number } {
    const { width: viewportWidth, height: viewportHeight, offsetLeft, offsetTop } =
      this.getViewportMetrics();

    const minLeft = offsetLeft + margin;
    const minTop = offsetTop + margin;
    // When the tooltip is wider/taller than the viewport, pin to the min edge
    // so text starts on-screen (never negative / mid-word clipped).
    const maxLeft = Math.max(minLeft, offsetLeft + viewportWidth - width - margin);
    const maxTop = Math.max(minTop, offsetTop + viewportHeight - height - margin);

    return {
      left: Math.min(Math.max(left, minLeft), maxLeft),
      top: Math.min(Math.max(top, minTop), maxTop),
    };
  }

  private applyTooltipCoords(left: number, top: number): void {
    if (!this.tooltipElement) return;
    this.tooltipElement.style.left = `${left}px`;
    this.tooltipElement.style.top = `${top}px`;
  }

  private applyClampedTooltipPosition(
    left: number,
    top: number,
    width: number,
    height: number,
    margin: number,
  ): void {
    const clamped = this.clampTooltipCoords(left, top, width, height, margin);
    this.applyTooltipCoords(clamped.left, clamped.top);
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
