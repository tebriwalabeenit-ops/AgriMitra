/**
 * AgriMitra - Main Application Logic
 * Frontend-only simulated authentication and Farmer Login experience
 */

import {
  validatePhoneNumber,
  validatePassword,
  formatPhoneNumberDisplay,
  ValidationMessages
} from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginForm = document.getElementById('farmer-login-form');
  const phoneInput = document.getElementById('phone-number');
  const phoneGroup = document.getElementById('phone-input-group');
  const phoneError = document.getElementById('phone-error');
  const phoneErrorText = document.getElementById('phone-error-text');

  const passwordInput = document.getElementById('password');
  const passwordGroup = document.getElementById('password-input-group');
  const passwordError = document.getElementById('password-error');
  const passwordErrorText = document.getElementById('password-error-text');
  const passwordToggleBtn = document.getElementById('password-toggle-btn');
  const passwordToggleText = document.getElementById('password-toggle-text');
  const eyeIcon = document.getElementById('eye-icon');
  const eyeOffIcon = document.getElementById('eye-off-icon');

  const formAlert = document.getElementById('form-alert');
  const formAlertText = document.getElementById('form-alert-text');

  const submitBtn = document.getElementById('login-submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');

  // Views & Routing
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const registerView = document.getElementById('register-view');
  const signOutBtn = document.getElementById('sign-out-btn');
  const registerLink = document.getElementById('register-farmer-link');
  const registerBackBtn = document.getElementById('register-back-btn');
  const headerBackBtn = document.getElementById('header-back-btn');

  // Modal elements
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const helpModal = document.getElementById('help-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');



  // -------------------------------------------------------------------------
  // Phone Formatting & Real-time validation clear
  // -------------------------------------------------------------------------
  phoneInput.addEventListener('input', (e) => {
    const rawVal = e.target.value;
    const formatted = formatPhoneNumberDisplay(rawVal);
    
    // Maintain cursor position feel while formatting
    if (e.target.value !== formatted) {
      e.target.value = formatted;
    }

    // Clear inline error when typing
    if (phoneGroup.classList.contains('has-error')) {
      clearPhoneError();
    }
    clearFormAlert();
  });

  passwordInput.addEventListener('input', () => {
    if (passwordGroup.classList.contains('has-error')) {
      clearPasswordError();
    }
    clearFormAlert();
  });

  function showPhoneError(message) {
    phoneGroup.classList.add('has-error');
    phoneErrorText.textContent = message;
    phoneError.classList.add('active');
    phoneInput.setAttribute('aria-invalid', 'true');
  }

  function clearPhoneError() {
    phoneGroup.classList.remove('has-error');
    phoneError.classList.remove('active');
    phoneInput.removeAttribute('aria-invalid');
  }

  function showPasswordError(message) {
    passwordGroup.classList.add('has-error');
    passwordErrorText.textContent = message;
    passwordError.classList.add('active');
    passwordInput.setAttribute('aria-invalid', 'true');
  }

  function clearPasswordError() {
    passwordGroup.classList.remove('has-error');
    passwordError.classList.remove('active');
    passwordInput.removeAttribute('aria-invalid');
  }

  function showFormAlert(message) {
    formAlertText.textContent = message;
    formAlert.classList.add('active');
  }

  function clearFormAlert() {
    formAlert.classList.remove('active');
  }

  function clearAllErrors() {
    clearPhoneError();
    clearPasswordError();
    clearFormAlert();
  }

  // -------------------------------------------------------------------------
  // Password Show / Hide Control
  // -------------------------------------------------------------------------
  passwordToggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    passwordToggleBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
    passwordToggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    passwordToggleBtn.title = isPassword ? 'Hide password' : 'Show password';

    if (isPassword) {
      eyeIcon.style.display = 'none';
      eyeOffIcon.style.display = 'block';
      if (passwordToggleText) passwordToggleText.textContent = 'Hide';
    } else {
      eyeIcon.style.display = 'block';
      eyeOffIcon.style.display = 'none';
      if (passwordToggleText) passwordToggleText.textContent = 'Show';
    }
  });

  // -------------------------------------------------------------------------
  // Form Submission & Simulated Authentication
  // -------------------------------------------------------------------------
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors();

    const rawPhone = phoneInput.value;
    const rawPassword = passwordInput.value;

    // Step 1 & 2: Validate Phone Number
    const phoneResult = validatePhoneNumber(rawPhone);
    let hasError = false;

    if (!phoneResult.isValid) {
      showPhoneError(phoneResult.error);
      hasError = true;
    }

    // Step 3: Validate Password
    const passwordResult = validatePassword(rawPassword);
    if (!passwordResult.isValid) {
      showPasswordError(passwordResult.error);
      hasError = true;
    }

    if (hasError) {
      // Focus first erroneous field
      if (!phoneResult.isValid) {
        phoneInput.focus();
      } else {
        passwordInput.focus();
      }
      return;
    }

    // Optional simulated invalid credential test:
    // If the tester enters password "fail" or "wrong", test the credential mismatch error:
    if (rawPassword.toLowerCase() === 'fail' || rawPassword.toLowerCase() === 'wrong') {
      showFormAlert(ValidationMessages.CREDENTIALS_MISMATCH);
      passwordInput.focus();
      return;
    }

    // Step 4 & 5: Loading State & Simulated Authentication
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    btnText.textContent = 'Logging in...';

    setTimeout(() => {
      // Step 6: Transition to Farmer Dashboard (/farmer/dashboard)
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      btnText.textContent = 'Login';

      navigateToDashboard();
    }, 750);
  });

  // -------------------------------------------------------------------------
  // Simulated View Navigation
  // -------------------------------------------------------------------------
  function navigateToDashboard() {
    loginView.style.display = 'none';
    if (registerView) registerView.style.display = 'none';
    dashboardView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState({ view: 'dashboard' }, '', '#farmer/dashboard');
  }

  function navigateToLogin() {
    dashboardView.classList.remove('active');
    if (registerView) registerView.style.display = 'none';
    loginView.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState({ view: 'login' }, '', '#farmer/login');
  }

  function navigateToRegister() {
    loginView.style.display = 'none';
    dashboardView.classList.remove('active');
    if (registerView) {
      registerView.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    history.pushState({ view: 'register' }, '', '#farmer/register');
  }

  // Sign out button returns to login
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      navigateToLogin();
    });
  }

  // Register link handler
  if (registerLink) {
    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToRegister();
    });
  }

  if (registerBackBtn) {
    registerBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToLogin();
    });
  }

  if (headerBackBtn) {
    headerBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // If currently on dashboard or register, go to login
      if (dashboardView.classList.contains('active') || (registerView && registerView.style.display === 'flex')) {
        navigateToLogin();
      } else {
        // Reset form for fresh testing
        loginForm.reset();
        clearAllErrors();
        phoneInput.focus();
      }
    });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    const hash = window.location.hash;
    if (hash.includes('dashboard')) {
      navigateToDashboard();
    } else if (hash.includes('register')) {
      navigateToRegister();
    } else {
      navigateToLogin();
    }
  });



  // -------------------------------------------------------------------------
  // Forgot Password Modal
  // -------------------------------------------------------------------------
  if (forgotPasswordLink && helpModal) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      helpModal.classList.add('active');
      modalCloseBtn.focus();
    });

    modalCloseBtn.addEventListener('click', () => {
      helpModal.classList.remove('active');
      forgotPasswordLink.focus();
    });

    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        helpModal.classList.remove('active');
        forgotPasswordLink.focus();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && helpModal.classList.contains('active')) {
        helpModal.classList.remove('active');
        forgotPasswordLink.focus();
      }
    });
  }
});
