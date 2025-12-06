// Owl UI Component - Visual representation of Ollie the Owl

import { owlSystem, OwlDisplayState } from '../../core/owl';
import { storage } from '../../core/storage';

export class OwlComponent {
  private container: HTMLElement | null = null;
  private unsubscribe: (() => void) | null = null;
  private isMinimized = false;

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

    // Minimized owl button (to expand)
    const minimizedBtn = this.container.querySelector('.owl-minimized');
    minimizedBtn?.addEventListener('click', () => this.expand());

    // Dismiss message button
    const dismissBtn = this.container.querySelector('.owl-bubble-dismiss');
    dismissBtn?.addEventListener('click', () => owlSystem.dismissMessage());

    // Click on owl character for interaction
    const character = this.container.querySelector('.owl-character');
    character?.addEventListener('click', () => this.onOwlClick());

    // Eye tracking (fun feature)
    document.addEventListener('mousemove', this.handleMouseMove);
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
    if (!this.container || this.isMinimized) return;

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
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    document.removeEventListener('mousemove', this.handleMouseMove);

    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }

  // Check if owl is currently visible
  isVisible(): boolean {
    return this.container?.classList.contains('owl-hidden') === false;
  }
}

// Singleton instance
export const owlComponent = new OwlComponent();
