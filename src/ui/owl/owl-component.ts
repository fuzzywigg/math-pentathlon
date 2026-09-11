// Owl UI Component - Visual representation of Ollie the Owl

import {
  owlSystem,
  OwlDisplayState,
  inspectDropSpeech,
  integrate,
  clampToViewport,
  isAtRest,
} from '../../core/owl';
import { storage } from '../../core/storage';

/** Pixels of movement before a pointer gesture counts as a drag (not a tap). */
const DRAG_THRESHOLD_PX = 6;

export class OwlComponent {
  private container: HTMLElement | null = null;
  private unsubscribe: (() => void) | null = null;
  private isMinimized = false;

  /** Active pointer-drag state (Cycle-2 A + B drop-inspect on real drag). */
  private isDragging = false;
  private didDrag = false;
  private dragPointerId: number | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private dragStartX = 0;
  private dragStartY = 0;

  /** Last drag-frame top-left for Δ → velocity (coast after drop). */
  private lastPosX = 0;
  private lastPosY = 0;
  private velocityX = 0;
  private velocityY = 0;
  private coastRaf: number | null = null;

  // Initialize the Owl UI
  init(): void {
    this.createContainer();
    this.subscribeToState();
  }

  // Create the main container
  private createContainer(): void {
    // Remove existing if present
    this.destroy();

    this.container = document.createElement('div');
    this.container.id = 'ollie-owl';
    this.container.className = 'owl-container';
    this.container.innerHTML = this.getTemplate();

    document.body.appendChild(this.container);

    // Wire up event handlers
    this.attachEventHandlers();
  }

  // Get the HTML template
  private getTemplate(): string {
    return `
      <div class="owl-wrapper">
        <!-- Minimized state (just the owl icon) -->
        <button class="owl-minimized" aria-label="Open Ollie the Owl" title="Say hi to Ollie!">
          <span class="owl-mini-icon">🦉</span>
          <span class="owl-notification-dot"></span>
        </button>

        <!-- Expanded state -->
        <div class="owl-expanded">
          <!-- Owl character -->
          <div class="owl-character">
            <div class="owl-body">
              <div class="owl-face">
                <div class="owl-eyes">
                  <div class="owl-eye owl-eye-left">
                    <div class="owl-pupil"></div>
                  </div>
                  <div class="owl-eye owl-eye-right">
                    <div class="owl-pupil"></div>
                  </div>
                </div>
                <div class="owl-beak"></div>
              </div>
              <div class="owl-wings">
                <div class="owl-wing owl-wing-left"></div>
                <div class="owl-wing owl-wing-right"></div>
              </div>
              <div class="owl-feet">
                <div class="owl-foot owl-foot-left"></div>
                <div class="owl-foot owl-foot-right"></div>
              </div>
            </div>
          </div>

          <!-- Speech bubble -->
          <div class="owl-bubble">
            <div class="owl-bubble-content">
              <p class="owl-message"></p>
            </div>
            <button class="owl-bubble-dismiss" aria-label="Dismiss message">&times;</button>
            <div class="owl-bubble-tail"></div>
          </div>

          <!-- Controls -->
          <div class="owl-controls">
            <button class="owl-minimize-btn" aria-label="Minimize Ollie" title="Minimize">
              <span>−</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Attach event handlers
  private attachEventHandlers(): void {
    if (!this.container) return;

    // Minimize button
    const minimizeBtn = this.container.querySelector('.owl-minimize-btn');
    minimizeBtn?.addEventListener('click', () => this.minimize());

    // Minimized owl button (to expand) — skip expand if this was a drag
    const minimizedBtn = this.container.querySelector('.owl-minimized');
    minimizedBtn?.addEventListener('click', (e) => {
      if (this.didDrag) {
        e.preventDefault();
        e.stopPropagation();
        this.didDrag = false;
        return;
      }
      this.expand();
    });

    // Dismiss message button
    const dismissBtn = this.container.querySelector('.owl-bubble-dismiss');
    dismissBtn?.addEventListener('click', () => owlSystem.dismissMessage());

    // Click on owl character for interaction — skip if this was a drag
    const character = this.container.querySelector('.owl-character');
    character?.addEventListener('click', (e) => {
      if (this.didDrag) {
        e.preventDefault();
        e.stopPropagation();
        this.didDrag = false;
        return;
      }
      this.onOwlClick();
    });

    // Pointer drag (touch + mouse) with capture; stay after real drag, dock on cancel/tap
    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerup', this.onPointerUp);
    this.container.addEventListener('pointercancel', this.onPointerCancel);
    this.container.addEventListener('lostpointercapture', this.onPointerUp);

    // Eye tracking (fun feature)
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  /** True when the event target is a drag handle (body / mini icon), not chrome. */
  private isDragHandle(target: EventTarget | null): boolean {
    if (!(target instanceof Element) || !this.container) return false;
    if (target.closest('.owl-bubble') || target.closest('.owl-controls')) return false;
    return Boolean(target.closest('.owl-character') || target.closest('.owl-minimized'));
  }

  private onPointerDown = (e: PointerEvent): void => {
    if (!this.container) return;
    // Primary button / touch / pen only
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!this.isDragHandle(e.target)) return;

    this.stopCoast();

    const rect = this.container.getBoundingClientRect();
    this.dragOffsetX = e.clientX - rect.left;
    this.dragOffsetY = e.clientY - rect.top;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.isDragging = true;
    this.didDrag = false;
    this.dragPointerId = e.pointerId;
    this.velocityX = 0;
    this.velocityY = 0;
    this.lastPosX = rect.left;
    this.lastPosY = rect.top;

    // Lock visual top-left before switching transform-origin (dock uses top-right)
    // so scale(0.85) does not jump when .owl-dragging applies.
    this.container.style.left = `${rect.left}px`;
    this.container.style.top = `${rect.top}px`;
    this.container.style.right = 'auto';
    this.container.style.bottom = 'auto';
    this.container.classList.remove('owl-resting');
    this.container.classList.add('owl-dragging');

    try {
      this.container.setPointerCapture(e.pointerId);
    } catch {
      // Capture can throw if the pointer is already gone; drag still works via bubbling.
    }
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.container || !this.isDragging) return;
    if (this.dragPointerId !== null && e.pointerId !== this.dragPointerId) return;

    const dx = e.clientX - this.dragStartX;
    const dy = e.clientY - this.dragStartY;
    if (!this.didDrag && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;

    this.didDrag = true;
    e.preventDefault();

    const x = e.clientX - this.dragOffsetX;
    const y = e.clientY - this.dragOffsetY;

    this.velocityX = x - this.lastPosX;
    this.velocityY = y - this.lastPosY;
    this.lastPosX = x;
    this.lastPosY = y;

    // Follow pointer with fixed left/top; release CSS dock (right/bottom)
    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
    this.container.style.right = 'auto';
    this.container.style.bottom = 'auto';
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.container || !this.isDragging) return;
    if (this.dragPointerId !== null && e.pointerId !== this.dragPointerId) return;

    const wasRealDrag = this.didDrag;

    this.isDragging = false;
    this.dragPointerId = null;

    try {
      if (this.container.hasPointerCapture?.(e.pointerId)) {
        this.container.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore — pointer may already be released
    }

    this.container.classList.remove('owl-dragging');

    // Cycle-2 B: after a real drag, hit-test under the owl and soft-tutor narrate
    if (wasRealDrag) {
      this.inspectDropAt(e.clientX, e.clientY);
      // Stay where dropped: keep inline left/top and coast with friction
      this.container.classList.add('owl-resting');
      this.startCoast();
      return;
    }

    // Tap (no real drag): clear the temporary lock and return to CSS dock
    this.snapBackToDock();
  };

  /** Cancelled gesture: return to dock (even after a real drag). */
  private onPointerCancel = (e: PointerEvent): void => {
    if (!this.container || !this.isDragging) return;
    if (this.dragPointerId !== null && e.pointerId !== this.dragPointerId) return;

    this.isDragging = false;
    this.dragPointerId = null;
    this.velocityX = 0;
    this.velocityY = 0;
    this.stopCoast();

    try {
      if (this.container.hasPointerCapture?.(e.pointerId)) {
        this.container.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    this.container.classList.remove('owl-dragging');
    this.snapBackToDock();
  };

  /**
   * Hit-test under the finger without the owl blocking (pointer-events none equivalent).
   * Must not leave pointer-events:none during capture — that releases capture (Pointer Events).
   */
  private inspectDropAt(clientX: number, clientY: number): void {
    if (!this.container) return;

    const prev = this.container.style.pointerEvents;
    this.container.style.pointerEvents = 'none';
    let under: Element | null = null;
    try {
      // jsdom may lack elementFromPoint; browsers always have it
      under =
        typeof document.elementFromPoint === 'function'
          ? document.elementFromPoint(clientX, clientY)
          : null;
    } finally {
      this.container.style.pointerEvents = prev;
    }

    const speech = inspectDropSpeech(under instanceof Element ? under : null);
    owlSystem.speakNow(speech, 'thinking');
  }

  /** Clear inline position so CSS dock (top-right mobile / bottom-right desktop) wins. */
  snapBackToDock(): void {
    if (!this.container) return;
    this.stopCoast();
    this.velocityX = 0;
    this.velocityY = 0;
    this.container.classList.remove('owl-resting');
    this.container.style.left = '';
    this.container.style.top = '';
    this.container.style.right = '';
    this.container.style.bottom = '';
  }

  private stopCoast(): void {
    if (this.coastRaf !== null) {
      cancelAnimationFrame(this.coastRaf);
      this.coastRaf = null;
    }
  }

  /** Friction coast after drop until rest; clamp to viewport (no bounce). */
  private startCoast(): void {
    if (!this.container) return;
    this.stopCoast();

    // Soft-cap release speed so a single large pointermove does not slingshot.
    const maxV = 28;
    this.velocityX = Math.max(-maxV, Math.min(maxV, this.velocityX));
    this.velocityY = Math.max(-maxV, Math.min(maxV, this.velocityY));

    const boxW = (): number => this.container?.getBoundingClientRect().width || 64;
    const boxH = (): number => this.container?.getBoundingClientRect().height || 64;
    const vw = (): number => window.innerWidth || 390;
    const vh = (): number => window.innerHeight || 844;

    // Clamp drop position into viewport before coasting
    {
      const x = parseFloat(this.container.style.left) || 0;
      const y = parseFloat(this.container.style.top) || 0;
      const clamped = clampToViewport(x, y, boxW(), boxH(), vw(), vh());
      this.container.style.left = `${clamped.x}px`;
      this.container.style.top = `${clamped.y}px`;
    }

    const tick = (): void => {
      if (!this.container) {
        this.coastRaf = null;
        return;
      }

      const x = parseFloat(this.container.style.left) || 0;
      const y = parseFloat(this.container.style.top) || 0;
      const next = integrate({ x, y, vx: this.velocityX, vy: this.velocityY });
      const clamped = clampToViewport(next.x, next.y, boxW(), boxH(), vw(), vh());

      // Soft stop on edges (clamp only — no bounce invent)
      if (clamped.x !== next.x) this.velocityX = 0;
      else this.velocityX = next.vx;
      if (clamped.y !== next.y) this.velocityY = 0;
      else this.velocityY = next.vy;

      this.container.style.left = `${clamped.x}px`;
      this.container.style.top = `${clamped.y}px`;

      if (isAtRest(this.velocityX, this.velocityY)) {
        this.velocityX = 0;
        this.velocityY = 0;
        this.coastRaf = null;
        return;
      }

      this.coastRaf = requestAnimationFrame(tick);
    };

    if (isAtRest(this.velocityX, this.velocityY)) {
      this.velocityX = 0;
      this.velocityY = 0;
      return;
    }

    this.coastRaf = requestAnimationFrame(tick);
  }

  /** Whether Ollie is mid-drag (for tests / drop-inspect). */
  getIsDragging(): boolean {
    return this.isDragging;
  }

  /** Expose whether the last gesture crossed the drag threshold (for tests). */
  getDidDrag(): boolean {
    return this.didDrag;
  }

  // Subscribe to owl state changes
  private subscribeToState(): void {
    this.unsubscribe = owlSystem.onStateChange((state) => this.updateUI(state));
  }

  // Update UI based on state
  private updateUI(state: OwlDisplayState): void {
    if (!this.container) return;

    const settings = storage.getSettings();
    if (!settings.owlEnabled) {
      this.container.classList.add('owl-hidden');
      return;
    }

    // Visibility
    this.container.classList.toggle('owl-hidden', !state.isVisible);

    // Mood classes
    const moods = ['happy', 'encouraging', 'celebrating', 'thinking', 'sleepy', 'proud'];
    moods.forEach((mood) => {
      this.container!.classList.toggle(`owl-mood-${mood}`, state.mood === mood);
    });

    // Animation state
    this.container.classList.toggle('owl-animating', state.isAnimating);

    // Message display
    const bubble = this.container.querySelector('.owl-bubble') as HTMLElement;
    const messageEl = this.container.querySelector('.owl-message') as HTMLElement;

    if (state.message) {
      messageEl.textContent = state.message.text;
      bubble.classList.add('owl-bubble-visible');
      this.container.classList.add('owl-has-message');

      // Show notification dot if minimized
      const notificationDot = this.container.querySelector('.owl-notification-dot') as HTMLElement;
      if (this.isMinimized && notificationDot) {
        notificationDot.classList.add('visible');
      }
    } else {
      bubble.classList.remove('owl-bubble-visible');
      this.container.classList.remove('owl-has-message');
    }
  }

  // Minimize the owl
  minimize(): void {
    if (!this.container) return;
    this.isMinimized = true;
    this.container.classList.add('owl-minimized-state');
  }

  // Expand the owl
  expand(): void {
    if (!this.container) return;
    this.isMinimized = false;
    this.container.classList.remove('owl-minimized-state');

    // Clear notification dot
    const notificationDot = this.container.querySelector('.owl-notification-dot');
    notificationDot?.classList.remove('visible');
  }

  // Handle click on owl
  private onOwlClick(): void {
    // Trigger a playful animation
    if (!this.container) return;

    this.container.classList.add('owl-clicked');
    setTimeout(() => {
      this.container?.classList.remove('owl-clicked');
    }, 500);
  }

  // Eye tracking for fun
  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.container || this.isMinimized || this.isDragging) return;

    const pupils = this.container.querySelectorAll('.owl-pupil');
    const owlRect = this.container.getBoundingClientRect();
    const owlCenterX = owlRect.left + owlRect.width / 2;
    const owlCenterY = owlRect.top + owlRect.height / 2;

    const angle = Math.atan2(e.clientY - owlCenterY, e.clientX - owlCenterX);
    const distance = Math.min(3, Math.hypot(e.clientX - owlCenterX, e.clientY - owlCenterY) / 100);

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    pupils.forEach((pupil) => {
      (pupil as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  // Clean up
  destroy(): void {
    this.stopCoast();

    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    document.removeEventListener('mousemove', this.handleMouseMove);

    if (this.container) {
      this.container.removeEventListener('pointerdown', this.onPointerDown);
      this.container.removeEventListener('pointermove', this.onPointerMove);
      this.container.removeEventListener('pointerup', this.onPointerUp);
      this.container.removeEventListener('pointercancel', this.onPointerCancel);
      this.container.removeEventListener('lostpointercapture', this.onPointerUp);
      this.container.remove();
      this.container = null;
    }

    this.isDragging = false;
    this.didDrag = false;
    this.dragPointerId = null;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  // Check if owl is currently visible
  isVisible(): boolean {
    return this.container?.classList.contains('owl-hidden') === false;
  }

  /** Expose root element for tests. */
  getElement(): HTMLElement | null {
    return this.container;
  }
}

// Singleton instance
export const owlComponent = new OwlComponent();
