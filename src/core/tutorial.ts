// Tutorial System - Provides step-by-step guidance for learning games

import { setTrustedMarkup } from './dom-security';

export interface TutorialStep {
  id: string;
  title: string;
  message: string;
  // Highlight specific elements (CSS selectors)
  highlightSelector?: string;
  // Position for tooltip: which side of the highlighted element
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  // Required action to proceed (optional - if not set, user clicks "Next")
  requiredAction?:
    | {
        type: 'click';
        selector: string;
      }
    | {
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

type TutorialEventHandler = (event: TutorialEvent) => void;

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
/** Gap between tooltip and highlight / Tap here avoid rect. */
const TOOLTIP_AVOID_GAP_PX = 12;
/** Approx. Tap here cue height (incl. arrow) for avoid-rect. */
const TAP_CUE_AVOID_HEIGHT_PX = 36;

type TooltipSide = Exclude<NonNullable<TutorialStep['position']>, 'center'>;

interface AvoidRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface TooltipBox {
  width: number;
  height: number;
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
  /** Control that started the tutorial (usually #tutorial-btn) for focus restore. */
  private returnFocusEl: HTMLElement | null = null;

  /**
   * Cached tooltip border-box after the last sync measure / ResizeObserver.
   * Invalidated whenever step chrome content is rewritten.
   */
  private cachedTooltipW = 0;
  private cachedTooltipH = 0;
  private tooltipSizeValid = false;
  private tooltipSizeObserver: ResizeObserver | null = null;

  // Start a tutorial
  start(config: TutorialConfig): void {
    // Drop any leftover overlay (e.g. navigated away mid-tutorial)
    if (this.overlayElement || this.tooltipElement) {
      this.removeOverlay();
    }
    this.returnFocusEl =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    this.config = config;
    this.currentStepIndex = 0;
    this.isActive = true;
    this.createOverlay();
    this.showCurrentStep();
    // Move keyboard focus into the tutorial dialog chrome.
    queueMicrotask(() => {
      const next = this.tooltipElement?.querySelector(
        '.tutorial-next-btn, .tutorial-exit-btn'
      ) as HTMLElement | null;
      next?.focus();
    });
  }

  private restoreReturnFocus(): void {
    const trigger = this.returnFocusEl;
    this.returnFocusEl = null;
    if (!trigger) {
      return;
    }
    queueMicrotask(() => {
      if (document.contains(trigger)) {
        trigger.focus();
      }
    });
  }

  // Get current step
  getCurrentStep(): TutorialStep | null {
    if (!this.config || !this.isActive) {
      return null;
    }
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
    if (!this.isActive) {
      return;
    }
    this.showCurrentStep();
  }

  // Move to next step
  nextStep(): void {
    if (!this.config || !this.isActive) {
      return;
    }

    const currentStep = this.getCurrentStep();
    if (currentStep?.onComplete) {
      currentStep.onComplete();
    }

    this.currentStepIndex++;

    if (this.currentStepIndex >= this.config.steps.length) {
      this.complete();
    } else {
      this.showCurrentStep();
      this.emit({
        type: 'step-changed',
        stepIndex: this.currentStepIndex,
        step: this.getCurrentStep()!,
      });
    }
  }

  // Move to previous step
  prevStep(): void {
    if (!this.config || !this.isActive || this.currentStepIndex === 0) {
      return;
    }

    this.currentStepIndex--;
    this.showCurrentStep();
    this.emit({
      type: 'step-changed',
      stepIndex: this.currentStepIndex,
      step: this.getCurrentStep()!,
    });
  }

  // Complete the tutorial
  complete(): void {
    this.isActive = false;
    this.removeOverlay();
    this.emit({ type: 'completed' });
    this.config = null;
    this.restoreReturnFocus();
  }

  // Exit the tutorial early
  exit(): void {
    this.isActive = false;
    this.removeOverlay();
    this.emit({ type: 'exited' });
    this.config = null;
    this.restoreReturnFocus();
  }

  // Handle an action (e.g., cell click) to check if it completes the current step
  handleAction(
    actionType: string,
    data?: { row?: number; col?: number; selector?: string }
  ): boolean {
    const step = this.getCurrentStep();
    if (!step?.requiredAction) {
      return false;
    }

    if (
      step.requiredAction.type === 'click-cell' &&
      actionType === 'click-cell'
    ) {
      if (
        data?.row === step.requiredAction.row &&
        data?.col === step.requiredAction.col
      ) {
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
    this.eventHandlers.forEach((handler) => {
      handler(event);
    });
  }

  private createOverlay(): void {
    // Create overlay container
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'tutorial-overlay';
    const backdrop = document.createElement('div');
    backdrop.className = 'tutorial-backdrop';
    const highlightRing = document.createElement('div');
    highlightRing.className = 'tutorial-highlight-ring';
    this.overlayElement.append(backdrop, highlightRing);

    // Create tooltip
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'tutorial-tooltip';
    this.tooltipElement.setAttribute('role', 'dialog');
    this.tooltipElement.setAttribute('aria-modal', 'true');
    this.tooltipElement.setAttribute(
      'aria-labelledby',
      'tutorial-tooltip-title'
    );
    this.tooltipElement.setAttribute(
      'aria-describedby',
      'tutorial-tooltip-message'
    );

    const header = document.createElement('div');
    header.className = 'tutorial-tooltip-header';
    const counter = document.createElement('span');
    counter.className = 'tutorial-step-counter';
    const exitBtn = document.createElement('button');
    exitBtn.className = 'tutorial-exit-btn';
    exitBtn.type = 'button';
    exitBtn.setAttribute('aria-label', 'Exit tutorial');
    exitBtn.textContent = '\u00d7';
    header.append(counter, exitBtn);

    const title = document.createElement('h2');
    title.id = 'tutorial-tooltip-title';
    title.className = 'tutorial-tooltip-title';

    const message = document.createElement('p');
    message.id = 'tutorial-tooltip-message';
    message.className = 'tutorial-tooltip-message';

    const actions = document.createElement('div');
    actions.className = 'tutorial-tooltip-actions';
    const prevBtn = document.createElement('button');
    prevBtn.className = 'tutorial-prev-btn';
    prevBtn.type = 'button';
    prevBtn.textContent = 'Back';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'tutorial-next-btn';
    nextBtn.type = 'button';
    nextBtn.textContent = 'Next';
    actions.append(prevBtn, nextBtn);

    this.tooltipElement.append(header, title, message, actions);

    document.body.appendChild(this.overlayElement);
    document.body.appendChild(this.tooltipElement);
    this.attachTooltipSizeObserver();

    exitBtn.addEventListener('click', () => {
      this.exit();
    });
    prevBtn.addEventListener('click', () => {
      this.prevStep();
    });
    nextBtn.addEventListener('click', () => {
      const step = this.getCurrentStep();
      // Only allow Next if there's no required action
      if (!step?.requiredAction) {
        this.nextStep();
      }
    });

    // Escape key to exit
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /** Sole highlight-target layout-rect measure — funnel forced geometry reads here. */
  private measureElementRect(el: HTMLElement): DOMRect {
    return el.getBoundingClientRect();
  }

  private invalidateTooltipSize(): void {
    this.tooltipSizeValid = false;
  }

  private attachTooltipSizeObserver(): void {
    this.detachTooltipSizeObserver();
    if (!this.tooltipElement || typeof ResizeObserver === 'undefined') {
      return;
    }
    this.tooltipSizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const box = entry.borderBoxSize?.[0];
      if (box && (box.inlineSize > 0 || box.blockSize > 0)) {
        this.cachedTooltipW = box.inlineSize;
        this.cachedTooltipH = box.blockSize;
        this.tooltipSizeValid = true;
        return;
      }
      if (entry.contentRect.width > 0 || entry.contentRect.height > 0) {
        this.cachedTooltipW = entry.contentRect.width;
        this.cachedTooltipH = entry.contentRect.height;
        this.tooltipSizeValid = true;
      }
    });
    this.tooltipSizeObserver.observe(this.tooltipElement);
  }

  private detachTooltipSizeObserver(): void {
    this.tooltipSizeObserver?.disconnect();
    this.tooltipSizeObserver = null;
    this.invalidateTooltipSize();
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.isActive) {
      return;
    }
    if (e.key === 'Escape') {
      this.exit();
    }
  };

  private removeOverlay(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.clearActionTargetHelpers();
    this.detachTooltipSizeObserver();
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
   * For click-cell steps: enlarge the cutout + add a stable hit proxy
   * so small board cells (esp. ~390px) are easier to hit.
   * Tap here cue is placed later, opposite the resolved tooltip side.
   */
  private setupClickCellTarget(
    targetEl: HTMLElement,
    highlightLeft: number,
    highlightTop: number,
    highlightWidth: number,
    highlightHeight: number
  ): void {
    targetEl.classList.add('tutorial-tap-target');

    const hitSize = Math.max(
      highlightWidth,
      highlightHeight,
      CLICK_CELL_MIN_HIT_PX
    );
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
    // Option 1 (stacking): append as siblings of .tutorial-tooltip on body.
    // Inside .tutorial-overlay (z 9998) their z-index is capped below the tooltip (z 10000).
    document.body.appendChild(hitProxy);
    this.hitProxyElement = hitProxy;
  }

  /**
   * Place Tap here opposite the tooltip so cue + dialog do not stack on the same side.
   * @returns whether the cue was placed above the highlight
   */
  private placeTapCueOppositeTooltip(
    highlightLeft: number,
    highlightTop: number,
    highlightWidth: number,
    highlightHeight: number,
    tooltipSide: NonNullable<TutorialStep['position']>
  ): boolean {
    const cue = document.createElement('div');
    cue.className = 'tutorial-tap-cue';
    cue.textContent = 'Tap here';
    cue.setAttribute('aria-hidden', 'true');
    // Prefer cue on the opposite side of the tooltip so they don't stack
    const preferBelow =
      tooltipSide === 'top' || (tooltipSide !== 'bottom' && highlightTop < 40);
    const cueAbove = !preferBelow;
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
    if (!step || !this.tooltipElement || !this.overlayElement) {
      return;
    }

    this.clearActionTargetHelpers();

    // Update tooltip content
    const titleEl = this.tooltipElement.querySelector(
      '.tutorial-tooltip-title'
    );
    const messageEl = this.tooltipElement.querySelector(
      '.tutorial-tooltip-message'
    );
    const counterEl = this.tooltipElement.querySelector(
      '.tutorial-step-counter'
    );
    const prevBtn = this.tooltipElement.querySelector(
      '.tutorial-prev-btn'
    ) as HTMLButtonElement;
    const nextBtn = this.tooltipElement.querySelector(
      '.tutorial-next-btn'
    ) as HTMLButtonElement;

    // Content rewrite invalidates any prior tooltip size cache.
    this.invalidateTooltipSize();

    if (titleEl) {
      titleEl.textContent = step.title;
    }
    if (messageEl instanceof HTMLElement) {
      // Author-trusted tutorial copy (allowlisted tags, no attributes).
      setTrustedMarkup(messageEl, step.message);
    }
    if (counterEl) {
      counterEl.textContent = `Step ${this.currentStepIndex + 1} of ${this.getTotalSteps()}`;
    }

    // Update button states
    if (prevBtn) {
      prevBtn.disabled = this.currentStepIndex === 0;
      prevBtn.style.visibility =
        this.currentStepIndex === 0 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      const isLastStep = this.currentStepIndex === this.getTotalSteps() - 1;
      const hasRequiredAction = Boolean(step.requiredAction);
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
    const highlightRing = this.overlayElement.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    const backdrop = this.overlayElement.querySelector(
      '.tutorial-backdrop'
    ) as HTMLElement;

    if (step.highlightSelector) {
      const targetEl = document.querySelector(
        step.highlightSelector
      ) as HTMLElement;
      if (targetEl && highlightRing) {
        // WRITE: park tooltip for absolute measure (no geometry reads yet).
        this.parkTooltipForAbsolutePosition();
        // READ BATCH: target rect + tooltip size in one layout pass.
        const rect = this.measureElementRect(targetEl);
        const tipBox = this.measureParkedTooltipSize();

        const isClickCellAction = step.requiredAction?.type === 'click-cell';
        const padding = isClickCellAction
          ? CLICK_CELL_HIGHLIGHT_PADDING_PX
          : DEFAULT_HIGHLIGHT_PADDING_PX;

        const left = rect.left - padding;
        const top = rect.top - padding;
        const width = rect.width + padding * 2;
        const height = rect.height + padding * 2;

        // WRITE BATCH: highlight cutout + tooltip placement (reuse tipBox).
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
        this.applyHighlightCutout(
          backdrop,
          left,
          top,
          left + width,
          top + height
        );

        // Live flip first, then Tap here on the opposite side of the resolved tooltip
        const avoidRect = this.buildAvoidRect(
          left,
          top,
          width,
          height,
          isClickCellAction,
          false
        );
        const resolvedSide = this.positionTooltip(
          rect,
          step.position ?? 'bottom',
          avoidRect,
          tipBox
        );
        if (isClickCellAction) {
          this.placeTapCueOppositeTooltip(
            left,
            top,
            width,
            height,
            resolvedSide
          );
        }
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

  private clearHighlight(
    highlightRing: HTMLElement,
    backdrop: HTMLElement
  ): void {
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
    cueAbove: boolean
  ): AvoidRect {
    let left = highlightLeft;
    let top = highlightTop;
    let right = highlightLeft + highlightWidth;
    let bottom = highlightTop + highlightHeight;

    if (isClickCellAction) {
      const hitSize = Math.max(
        highlightWidth,
        highlightHeight,
        CLICK_CELL_MIN_HIT_PX
      );
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
    tipBox?: TooltipBox
  ): NonNullable<TutorialStep['position']> {
    if (!this.tooltipElement) {
      return position;
    }

    if (position === 'center') {
      this.positionTooltipCenter(tipBox);
      return 'center';
    }

    const margin = 16;
    const { width, height } = tipBox ?? this.parkAndMeasureTooltip();
    const clearRect: AvoidRect = avoidRect ?? {
      left: targetRect.left,
      top: targetRect.top,
      right: targetRect.right,
      bottom: targetRect.bottom,
    };

    // Prefer declared side; if left/right cannot fit beside the target (common @390),
    // force above/below opposite the target before clamp (option 3, minimal).
    let side: TooltipSide = position;
    if (side === 'left' || side === 'right') {
      const { width: vw, offsetLeft } = this.getViewportMetrics();
      const room =
        side === 'left'
          ? clearRect.left - offsetLeft - margin
          : offsetLeft + vw - clearRect.right - margin;
      if (room < width + TOOLTIP_AVOID_GAP_PX) {
        side = this.preferVerticalSide(clearRect, height, margin);
      }
    }

    const placed = this.tryPlaceOnSide(side, clearRect, width, height, margin);
    if (placed) {
      return side;
    }

    // One flip to the other vertical band if preferred still overlaps after clamp
    const flip: TooltipSide =
      side === 'top'
        ? 'bottom'
        : side === 'bottom'
          ? 'top'
          : this.preferVerticalSide(clearRect, height, margin);
    if (this.tryPlaceOnSide(flip, clearRect, width, height, margin)) {
      return flip;
    }

    // Last resort: clamp preferred side (proxy/cue still tappable via option 1 stacking)
    const fallback = this.computeSidePosition(
      position,
      clearRect,
      width,
      height,
      margin
    );
    this.applyClampedTooltipPosition(
      fallback.left,
      fallback.top,
      width,
      height,
      margin
    );
    return position;
  }

  /** More free viewport space above vs below the avoid rect. */
  private preferVerticalSide(
    avoidRect: AvoidRect,
    height: number,
    margin: number
  ): TooltipSide {
    const { height: vh, offsetTop } = this.getViewportMetrics();
    const spaceBelow = offsetTop + vh - avoidRect.bottom - margin;
    const spaceAbove = avoidRect.top - offsetTop - margin;
    if (spaceBelow >= height + TOOLTIP_AVOID_GAP_PX) {
      return 'bottom';
    }
    if (spaceAbove >= height + TOOLTIP_AVOID_GAP_PX) {
      return 'top';
    }
    return spaceBelow >= spaceAbove ? 'bottom' : 'top';
  }

  private tryPlaceOnSide(
    side: TooltipSide,
    avoidRect: AvoidRect,
    width: number,
    height: number,
    margin: number
  ): boolean {
    const raw = this.computeSidePosition(
      side,
      avoidRect,
      width,
      height,
      margin
    );
    const { left, top } = this.clampTooltipCoords(
      raw.left,
      raw.top,
      width,
      height,
      margin
    );
    const box: AvoidRect = {
      left,
      top,
      right: left + width,
      bottom: top + height,
    };
    if (this.rectsOverlap(box, avoidRect, TOOLTIP_AVOID_GAP_PX)) {
      return false;
    }
    this.applyTooltipCoords(left, top);
    return true;
  }

  private computeSidePosition(
    position: TooltipSide,
    anchor: AvoidRect,
    width: number,
    height: number,
    margin: number
  ): { left: number; top: number } {
    const gap = Math.max(margin, TOOLTIP_AVOID_GAP_PX);
    const centerX = anchor.left + (anchor.right - anchor.left) / 2;
    const centerY = anchor.top + (anchor.bottom - anchor.top) / 2;

    switch (position) {
      case 'top':
        return { left: centerX - width / 2, top: anchor.top - height - gap };
      case 'bottom':
        return { left: centerX - width / 2, top: anchor.bottom + gap };
      case 'left':
        return { left: anchor.left - width - gap, top: centerY - height / 2 };
      case 'right':
        return { left: anchor.right + gap, top: centerY - height / 2 };
      default: {
        const _exhaustive: never = position;
        void _exhaustive;
        return { left: centerX - width / 2, top: anchor.bottom + gap };
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

  private positionTooltipCenter(tipBox?: TooltipBox): void {
    if (!this.tooltipElement) {
      return;
    }

    const margin = 16;
    const { width, height } = tipBox ?? this.parkAndMeasureTooltip();
    const {
      width: vw,
      height: vh,
      offsetLeft,
      offsetTop,
    } = this.getViewportMetrics();

    const left = offsetLeft + (vw - width) / 2;
    const top = offsetTop + (vh - height) / 2;
    this.applyClampedTooltipPosition(left, top, width, height, margin);
  }

  /** Park + measure when the caller did not already batch a tipBox. */
  private parkAndMeasureTooltip(): TooltipBox {
    this.parkTooltipForAbsolutePosition();
    return this.measureParkedTooltipSize();
  }

  /**
   * Clear centering transforms / CSS margin and constrain width so size
   * measurements match the box we will place with left/top.
   * Style writes only — pair with {@link measureParkedTooltipSize} in a
   * read batch (or use {@link parkAndMeasureTooltip}).
   */
  private parkTooltipForAbsolutePosition(): void {
    const tooltip = this.tooltipElement;
    if (!tooltip) {
      return;
    }
    const margin = 16;
    const { width: viewportWidth } = this.getViewportMetrics();
    const maxWidth = Math.max(0, viewportWidth - margin * 2);

    tooltip.classList.remove('tutorial-tooltip--compact');
    tooltip.style.transform = 'none';
    tooltip.style.margin = '0';
    tooltip.style.right = 'auto';
    tooltip.style.bottom = 'auto';
    tooltip.style.maxWidth = `${maxWidth}px`;
    tooltip.style.width = '';
    // Park off-layout briefly so prior left/top/50% do not skew measurement
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
  }

  /**
   * Sole tooltip size measure (offsetWidth / offsetHeight). Prefer the
   * ResizeObserver cache when still valid after park styles.
   */
  private measureParkedTooltipSize(): TooltipBox {
    const margin = 16;
    const { width: viewportWidth } = this.getViewportMetrics();
    const maxWidth = Math.max(0, viewportWidth - margin * 2);
    const empty: TooltipBox = { width: 0, height: 0 };

    const tooltip = this.tooltipElement;
    if (!tooltip) {
      return empty;
    }

    if (this.tooltipSizeValid && this.cachedTooltipW > 0) {
      return {
        width: Math.min(this.cachedTooltipW, maxWidth),
        height: this.cachedTooltipH,
      };
    }

    const width = Math.min(tooltip.offsetWidth || maxWidth, maxWidth);
    const height = tooltip.offsetHeight;
    this.cachedTooltipW = width;
    this.cachedTooltipH = height;
    this.tooltipSizeValid = true;
    return { width, height };
  }

  private clampTooltipCoords(
    left: number,
    top: number,
    width: number,
    height: number,
    margin: number
  ): { left: number; top: number } {
    const {
      width: viewportWidth,
      height: viewportHeight,
      offsetLeft,
      offsetTop,
    } = this.getViewportMetrics();

    const minLeft = offsetLeft + margin;
    const minTop = offsetTop + margin;
    // When the tooltip is wider/taller than the viewport, pin to the min edge
    // so text starts on-screen (never negative / mid-word clipped).
    const maxLeft = Math.max(
      minLeft,
      offsetLeft + viewportWidth - width - margin
    );
    const maxTop = Math.max(
      minTop,
      offsetTop + viewportHeight - height - margin
    );

    return {
      left: Math.min(Math.max(left, minLeft), maxLeft),
      top: Math.min(Math.max(top, minTop), maxTop),
    };
  }

  private applyTooltipCoords(left: number, top: number): void {
    if (!this.tooltipElement) {
      return;
    }
    this.tooltipElement.style.left = `${left}px`;
    this.tooltipElement.style.top = `${top}px`;
  }

  private applyClampedTooltipPosition(
    left: number,
    top: number,
    width: number,
    height: number,
    margin: number
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

/**
 * Route / error-boundary cleanup: drop overlay, keydown, and handlers when
 * leaving a game mid-tutorial so leftovers do not leak across mounts.
 */
export function exitTutorialIfActive(): void {
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
}
