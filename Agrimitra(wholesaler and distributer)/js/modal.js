

(function (window) {
  'use strict';

  let activeModal = null;
  let lastActiveElement = null;

  const ModalSystem = {

    open(modalId, options = {}) {
      const modalEl = document.getElementById(modalId);
      if (!modalEl) {
        console.warn(`[ModalSystem] Modal with ID "${modalId}" not found.`);
        return;
      }

      if (activeModal && activeModal !== modalEl) {
        this.close(false);
      }

      lastActiveElement = document.activeElement;
      activeModal = modalEl;

      document.body.classList.add('modal-open');

      modalEl.classList.add('is-active');
      modalEl.setAttribute('aria-hidden', 'false');

      if (typeof options.onOpen === 'function') {
        options.onOpen(modalEl);
      }

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

      const event = new CustomEvent('modal:closed', { detail: { modalId: closedModal.id } });
      window.dispatchEvent(event);
    },

    init() {

      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-target]');
        if (trigger) {
          e.preventDefault();
          const targetId = trigger.getAttribute('data-modal-target');
          this.open(targetId);
          return;
        }

        const closeTrigger = e.target.closest('[data-close-modal], .modal-close-btn');
        if (closeTrigger) {
          e.preventDefault();
          this.close();
          return;
        }

        if (e.target.classList.contains('modal-overlay')) {
          this.close();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
          if (activeModal) {
            this.close();
          }
        }
      });
    }
  };

  window.ModalSystem = ModalSystem;
  window.openModal = ModalSystem.open.bind(ModalSystem);
  window.closeModal = ModalSystem.close.bind(ModalSystem);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ModalSystem.init());
  } else {
    ModalSystem.init();
  }
})(window);
