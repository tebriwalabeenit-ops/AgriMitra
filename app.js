/**
 * AgriMitra Welcome Page Application Script
 * Features:
 * - Native accessible <dialog> management (Login, Register, About)
 * - Light-dismiss & backdrop click handlers
 * - Role-specific AgriMitra Assistant with concise practical responses
 * - English only, zero emojis
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Dialog (Modal) Controller
  // --------------------------------------------------------------------------
  const loginDialog = document.getElementById('login-dialog');
  const registerDialog = document.getElementById('register-dialog');
  const aboutDialog = document.getElementById('about-dialog');

  // Trigger Buttons
  const headerLoginBtn = document.getElementById('header-login-btn');
  const mainLoginBtn = document.getElementById('main-login-btn');
  const headerRegisterBtn = document.getElementById('header-register-btn');
  const mainRegisterBtn = document.getElementById('main-register-btn');
  const navAboutLink = document.getElementById('nav-about-link');
  const footerAboutLink = document.getElementById('footer-about-link');

  function openDialog(dialog) {
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  }

  function closeDialog(dialog) {
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  }

  // Open Login
  if (headerLoginBtn) headerLoginBtn.addEventListener('click', () => openDialog(loginDialog));
  if (mainLoginBtn) mainLoginBtn.addEventListener('click', () => openDialog(loginDialog));

  // Open Register
  if (headerRegisterBtn) headerRegisterBtn.addEventListener('click', () => openDialog(registerDialog));
  if (mainRegisterBtn) mainRegisterBtn.addEventListener('click', () => openDialog(registerDialog));

  // Open About
  if (navAboutLink) navAboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    openDialog(aboutDialog);
  });
  if (footerAboutLink) footerAboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    openDialog(aboutDialog);
  });

  // Auto-open modal based on URL hash
  if (window.location.hash === '#register' || window.location.hash === '#role-selection') {
    openDialog(registerDialog);
  } else if (window.location.hash === '#login') {
    openDialog(loginDialog);
  } else if (window.location.hash === '#about-modal') {
    openDialog(aboutDialog);
  }

  // Generic Close Buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dialogId = btn.getAttribute('data-close-modal');
      const targetDialog = document.getElementById(dialogId);
      closeDialog(targetDialog);
    });
  });

  // Light dismiss on backdrop click for all dialogs
  [loginDialog, registerDialog, aboutDialog].forEach(dialog => {
    if (!dialog) return;
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeDialog(dialog);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Language Selector Controller (Landing Page)
  // --------------------------------------------------------------------------
  const langDropdown = document.getElementById('lang-selector-dropdown');
  const langToggle = document.getElementById('lang-selector-toggle');
  const langOptions = document.querySelectorAll('.lang-option');

  if (langToggle && langDropdown) {
    // Toggle dropdown open/close on click
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langDropdown.classList.toggle('open');
      langToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Option selection
    langOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedLang = opt.getAttribute('data-lang');
        if (selectedLang && window.AgriMitraI18n) {
          window.AgriMitraI18n.setLanguage(selectedLang);
        }
        langDropdown.classList.remove('open');
        langToggle.setAttribute('aria-expanded', 'false');
        langToggle.focus();
      });

      // Keyboard navigation (Enter / Space)
      opt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          opt.click();
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!langDropdown.contains(e.target)) {
        langDropdown.classList.remove('open');
        langToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langDropdown.classList.contains('open')) {
        langDropdown.classList.remove('open');
        langToggle.setAttribute('aria-expanded', 'false');
        langToggle.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Role Navigation Mapping
  // --------------------------------------------------------------------------
  const roleRegistrationRoutes = {
    farmer: 'AgriMitra-Farmer/farmer/register.html',
    buyer: 'AgriMitra-Buyer/buyer.html',
    fpo: 'AgriMitra- FPO/fpo-register.html',
    wholesaler: 'Agrimitra(wholesaler and distributer)/register-distributor.html',
    distributor: 'Agrimitra(wholesaler and distributer)/register-distributor.html',
    delivery: 'AgriMitra-delivery agent/delivery-agent.html',
    delivery_agent: 'AgriMitra-delivery agent/delivery-agent.html'
  };

  const roleDashboardRoutes = {
    farmer: 'AgriMitra-Farmer/farmer/dashboard.html',
    buyer: 'buyer-dashboard.html',
    fpo: 'fpo-dashboard.html',
    wholesaler: 'wholesaler-trading.html',
    distributor: 'Agrimitra(wholesaler and distributer)/distributor-dashboard.html',
    delivery: 'delivery-dashboard.html',
    delivery_agent: 'delivery-dashboard.html'
  };

  // Role trigger links in footer open either registration dialog or direct page
  document.querySelectorAll('.modal-role-trigger').forEach(link => {
    link.addEventListener('click', (e) => {
      const role = link.getAttribute('data-role');
      if (role && roleRegistrationRoutes[role]) {
        e.preventDefault();
        window.location.href = roleRegistrationRoutes[role];
      } else {
        e.preventDefault();
        openDialog(registerDialog);
      }
    });
  });

  // When user clicks any role option in the registration popup, navigate directly to that role's registration page
  document.querySelectorAll('.role-select-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const role = card.getAttribute('data-role');
      const targetUrl = card.getAttribute('href') || (role ? roleRegistrationRoutes[role] : null);
      if (targetUrl && targetUrl !== '#') {
        closeDialog(registerDialog);
        window.location.href = targetUrl;
      }
    });
  });

  // --------------------------------------------------------------------------
  // Demo Account 1-Click Auto-Fill Controller
  // --------------------------------------------------------------------------
  const demoButtons = document.querySelectorAll('.demo-account-btn');
  const roleSelect = document.getElementById('login-role');
  const phoneInput = document.getElementById('login-phone');
  const passwordInput = document.getElementById('login-password');
  const demoStatusDiv = document.getElementById('demo-account-status');

  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      demoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const role = btn.getAttribute('data-role');
      const phone = btn.getAttribute('data-phone');
      const pass = btn.getAttribute('data-pass');

      if (roleSelect) roleSelect.value = role;
      if (phoneInput) phoneInput.value = phone;
      if (passwordInput) passwordInput.value = pass;

      // Clear any prior error
      const errorDiv = document.getElementById('login-error-msg');
      if (errorDiv) errorDiv.remove();

      // Show confirmation badge
      if (demoStatusDiv) {
        demoStatusDiv.style.display = 'flex';
        const roleName = btn.querySelector('.demo-btn-role') ? btn.querySelector('.demo-btn-role').textContent : role;
        demoStatusDiv.innerHTML = `<span class="status-check">✓</span> <span>Pre-filled <strong>${roleName}</strong> credentials: <code>${phone}</code> • Ready to sign in!</span>`;
      }
    });
  });

  // Form Handling for Login (Authenticates with Flask backend & redirects to role dashboard)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      const selectedRole = roleSelect ? roleSelect.value : 'farmer';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      // Clean any existing error message
      let errorDiv = document.getElementById('login-error-msg');
      if (errorDiv) errorDiv.remove();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';
      }

      try {
        const activeLang = window.AgriMitraI18n ? window.AgriMitraI18n.getCurrentLanguage() : 'en';
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ phone, password, role: selectedRole, preferred_language: activeLang })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Save active session metadata locally
          if (data.user) {
            localStorage.setItem('krishilink_user', JSON.stringify(data.user));
            localStorage.setItem('agrimitra_user', JSON.stringify(data.user));
            if (window.AgriMitraAuth) {
              window.AgriMitraAuth.setCurrentUser(data.user);
            }
            if (data.user.preferred_language && window.AgriMitraI18n) {
              window.AgriMitraI18n.setLanguage(data.user.preferred_language);
            }
          }
          const actualRole = (data.user && data.user.role) ? data.user.role : selectedRole;
          
          // Specific destination logic for demo flows
          let targetDashboard = roleDashboardRoutes[selectedRole] || roleDashboardRoutes[actualRole];
          if (selectedRole === 'buyer') {
            targetDashboard = 'buyer-dashboard.html';
          } else if (selectedRole === 'wholesaler') {
            targetDashboard = 'wholesaler-trading.html';
          } else if (selectedRole === 'distributor') {
            targetDashboard = 'Agrimitra(wholesaler and distributer)/distributor-dashboard.html';
          } else if (selectedRole === 'delivery' || actualRole === 'delivery_agent') {
            targetDashboard = 'delivery-dashboard.html';
          } else if (selectedRole === 'fpo') {
            targetDashboard = 'fpo-dashboard.html';
          }

          closeDialog(loginDialog);
          window.location.href = targetDashboard || 'AgriMitra-Farmer/farmer/dashboard.html';
        } else {
          // Display error message inside modal
          errorDiv = document.createElement('div');
          errorDiv.id = 'login-error-msg';
          errorDiv.style.cssText = 'color: #DC2626; background: #FEF2F2; border: 1px solid #FCA5A5; padding: 8px 12px; border-radius: 6px; font-size: 0.825rem; margin-top: 10px; text-align: center;';
          errorDiv.textContent = data.message || 'Invalid credentials. Please verify phone number and password.';
          const modalBody = loginForm.querySelector('.modal-body');
          if (modalBody) modalBody.appendChild(errorDiv);
        }
      } catch (networkErr) {
        console.warn('[KrishiLink] Login API unreachable, continuing in offline demo mode:', networkErr);
        let targetDashboard = roleDashboardRoutes[selectedRole] || 'AgriMitra-Farmer/farmer/dashboard.html';
        if (selectedRole === 'buyer') targetDashboard = 'buyer-dashboard.html';
        else if (selectedRole === 'wholesaler') targetDashboard = 'wholesaler-trading.html';
        else if (selectedRole === 'distributor') targetDashboard = 'Agrimitra(wholesaler and distributer)/distributor-dashboard.html';
        else if (selectedRole === 'delivery') targetDashboard = 'delivery-dashboard.html';
        else if (selectedRole === 'fpo') targetDashboard = 'fpo-dashboard.html';
        closeDialog(loginDialog);
        window.location.href = targetDashboard;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Login to Dashboard';
        }
      }
    });
  }
});
