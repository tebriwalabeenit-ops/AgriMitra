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
  // Role Navigation Mapping
  // --------------------------------------------------------------------------
  const roleRegistrationRoutes = {
    farmer: 'AgriMitra-Farmer/farmer/register.html',
    buyer: 'AgriMitra-Buyer/buyer.html',
    fpo: 'AgriMitra- FPO/fpo-register.html',
    delivery: 'AgriMitra-delivery agent/delivery-agent.html',
    distributor: 'Agrimitra(wholesaler and distributer)/register-distributor.html'
  };

  const roleDashboardRoutes = {
    farmer: 'AgriMitra-Farmer/farmer/dashboard.html',
    buyer: 'AgriMitra-Buyer/buyer-dashboard.html',
    fpo: 'AgriMitra- FPO/index.html',
    delivery: 'AgriMitra-delivery agent/index.html',
    distributor: 'Agrimitra(wholesaler and distributer)/distributor-dashboard.html'
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

  // Form Handling for Login (Redirects to selected role's dashboard)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const roleSelect = document.getElementById('login-role');
      const selectedRole = roleSelect ? roleSelect.value : 'farmer';
      const targetDashboard = roleDashboardRoutes[selectedRole] || 'AgriMitra-Farmer/farmer/dashboard.html';
      closeDialog(loginDialog);
      window.location.href = targetDashboard;
    });
  }
});
