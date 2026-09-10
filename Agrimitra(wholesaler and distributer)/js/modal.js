/* ==========================================================================
   AgriMitra Unified Modal Engine
   Single reusable modal system for all dashboard dialogues and drawers
   ========================================================================== */

(function (window) {
  'use strict';

  let activeModal = null;
  let lastActiveElement = null;

  const ModalSystem = {
    /**
     * Open a modal by DOM ID
     * @param {string} modalId - The element ID of the modal container or overlay
     * @param {Object} options - Optional callbacks or context data
     */
    open(modalId, options = {}) {
      const modalEl = document.getElementById(modalId);
      if (!modalEl) {
        console.warn(`[ModalSystem] Modal with ID "${modalId}" not found.`);
        return;
      }

      // If another modal is already active, close it first without animation flicker
      if (activeModal && activeModal !== modalEl) {
        this.close(false);
      }

      lastActiveElement = document.activeElement;
      activeModal = modalEl;

      // Lock body scroll
      document.body.classList.add('modal-open');

      // Show overlay
      modalEl.classList.add('is-active');
      modalEl.setAttribute('aria-hidden', 'false');

      // Call onOpen callback if provided
      if (typeof options.onOpen === 'function') {
        options.onOpen(modalEl);
      }

      // Auto-focus first focusable element or close button
      setTimeout(() => {
        const focusable = modalEl.querySelector('input:not([disabled]), select:not([disabled]), button:not([disabled]):not(.modal-close-btn)');
        const closeBtn = modalEl.querySelector('.modal-close-btn');
        if (focusable) {
          focusable.focus();
        } else if (closeBtn) {
          closeBtn.focus();
        }
      }, 50);
    },

    /**
     * Close the currently active modal
     * @param {boolean} restoreFocus - Whether to restore focus to trigger element
     */
    close(restoreFocus = true) {
      if (!activeModal) return;

      activeModal.classList.remove('is-active');
      activeModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');

      const closedModal = activeModal;
      activeModal = null;

      if (restoreFocus && lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }

      // Dispatch custom closed event
      const event = new CustomEvent('modal:closed', { detail: { modalId: closedModal.id } });
      window.dispatchEvent(event);
    },

    /**
     * Initialize global event delegation for modal triggers, close buttons, backdrop click, and Escape key
     */
    init() {
      // Delegated clicks for triggers: [data-modal-target="modalId"]
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-target]');
        if (trigger) {
          e.preventDefault();
          const targetId = trigger.getAttribute('data-modal-target');
          this.open(targetId);
          return;
        }

        // Delegated clicks for close buttons: [data-close-modal] or .modal-close-btn
        const closeTrigger = e.target.closest('[data-close-modal], .modal-close-btn');
        if (closeTrigger) {
          e.preventDefault();
          this.close();
          return;
        }

        // Clicking directly on the modal backdrop / overlay (outside modal-container)
        if (e.target.classList.contains('modal-overlay')) {
          this.close();
        }
      });

      // Global keyboard handler: Escape to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
          if (activeModal) {
            this.close();
          }
        }
      });
    }
  };

  // Expose to window
  window.ModalSystem = ModalSystem;
  window.openModal = ModalSystem.open.bind(ModalSystem);
  window.closeModal = ModalSystem.close.bind(ModalSystem);

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ModalSystem.init());
  } else {
    ModalSystem.init();
  }
})(window);
