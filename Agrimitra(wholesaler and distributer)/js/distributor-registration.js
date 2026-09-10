/* ==========================================================================
   AgriMitra Distributor Registration Wizard Logic
   Multi-step form wizard, inline validation, simulated account creation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 3;

  // Step Panels & Indicators
  const panels = document.querySelectorAll('.wizard-step-panel');
  const stepItems = document.querySelectorAll('.wizard-step-item');

  // Step 1 Form Elements
  const inputBusinessName = document.getElementById('reg-business-name');
  const inputContactPerson = document.getElementById('reg-contact-person');
  const inputPhone = document.getElementById('reg-phone');
  const selectBusinessType = document.getElementById('reg-business-type');
  const inputCity = document.getElementById('reg-city');
  const inputDistrict = document.getElementById('reg-district');
  const selectState = document.getElementById('reg-state');

  // Step 2 Form Elements
  const produceCheckboxes = document.querySelectorAll('input[name="mainProduce"]');
  const selectPurchaseQty = document.getElementById('reg-purchase-qty');
  const selectStorageCap = document.getElementById('reg-storage-cap');
  const inputSupplyArea = document.getElementById('reg-supply-area');

  // Step 3 Form Elements
  const inputPassword = document.getElementById('reg-password');
  const inputConfirmPassword = document.getElementById('reg-confirm-password');

  // Navigation Buttons
  const btnStep1Next = document.getElementById('btn-step-1-next');
  const btnStep2Back = document.getElementById('btn-step-2-back');
  const btnStep2Next = document.getElementById('btn-step-2-next');
  const btnStep3Back = document.getElementById('btn-step-3-back');
  const btnCreateAccount = document.getElementById('btn-create-account');

  // Wizard Card & Success Container
  const wizardFormContainer = document.getElementById('registration-wizard-card');
  const successContainer = document.getElementById('registration-success-card');

  /**
   * Show inline error for a field
   */
  function showError(fieldId, message) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
    if (inputEl) {
      inputEl.classList.add('is-invalid');
    }
  }

  /**
   * Clear inline error for a field
   */
  function clearError(fieldId) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
    if (inputEl) {
      inputEl.classList.remove('is-invalid');
    }
  }

  // Clear errors on user input
  const allInputs = [
    inputBusinessName,
    inputContactPerson,
    inputPhone,
    selectBusinessType,
    inputCity,
    inputDistrict,
    selectState,
    selectPurchaseQty,
    selectStorageCap,
    inputSupplyArea,
    inputPassword,
    inputConfirmPassword
  ];

  allInputs.forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => clearError(input.id));
    input.addEventListener('change', () => clearError(input.id));
  });

  produceCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => clearError('mainProduce'));
  });

  /**
   * Update active step panel and progress indicator
   */
  function setStep(stepNum) {
    currentStep = stepNum;

    // Update Panels
    panels.forEach(panel => {
      const step = parseInt(panel.getAttribute('data-step'), 10);
      if (step === currentStep) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update Stepper Header
    stepItems.forEach(item => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');
      if (step === currentStep) {
        item.classList.add('active');
      } else if (step < currentStep) {
        item.classList.add('completed');
      }
    });

    // Scroll to top of wizard on step change
    if (wizardFormContainer) {
      wizardFormContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Validate Step 1: Business Details
   */
  function validateStep1() {
    let isValid = true;

    if (!inputBusinessName.value.trim()) {
      showError('reg-business-name', 'Please enter your business name.');
      isValid = false;
    }

    if (!inputContactPerson.value.trim()) {
      showError('reg-contact-person', "Please enter contact person's name.");
      isValid = false;
    }

    const cleanPhone = inputPhone.value.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      showError('reg-phone', 'Please enter a valid 10-digit phone number.');
      isValid = false;
    }

    if (!selectBusinessType.value) {
      showError('reg-business-type', 'Please select your business type.');
      isValid = false;
    }

    if (!inputCity.value.trim()) {
      showError('reg-city', 'Please enter your area or city.');
      isValid = false;
    }

    if (!inputDistrict.value.trim()) {
      showError('reg-district', 'Please enter your district.');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Validate Step 2: Operations
   */
  function validateStep2() {
    let isValid = true;

    const checkedProduce = Array.from(produceCheckboxes).filter(cb => cb.checked);
    if (checkedProduce.length === 0) {
      showError('mainProduce', 'Please select at least one main produce.');
      isValid = false;
    }

    if (!selectPurchaseQty.value) {
      showError('reg-purchase-qty', 'Please select your typical purchase quantity.');
      isValid = false;
    }

    if (!selectStorageCap.value) {
      showError('reg-storage-cap', 'Please select your storage capacity.');
      isValid = false;
    }

    if (!inputSupplyArea.value.trim()) {
      showError('reg-supply-area', 'Please enter your main supply area.');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Validate Step 3: Account Setup
   */
  function validateStep3() {
    let isValid = true;

    const pass = inputPassword.value;
    const confirmPass = inputConfirmPassword.value;

    if (!pass) {
      showError('reg-password', 'Please enter a password.');
      isValid = false;
    } else if (pass.length < 6) {
      showError('reg-password', 'Password must be at least 6 characters.');
      isValid = false;
    }

    if (!confirmPass) {
      showError('reg-confirm-password', 'Please confirm your password.');
      isValid = false;
    } else if (pass !== confirmPass) {
      showError('reg-confirm-password', 'Passwords do not match.');
      isValid = false;
    }

    return isValid;
  }

  // Button Listeners
  if (btnStep1Next) {
    btnStep1Next.addEventListener('click', () => {
      if (validateStep1()) {
        setStep(2);
      }
    });
  }

  if (btnStep2Back) {
    btnStep2Back.addEventListener('click', () => {
      setStep(1);
    });
  }

  if (btnStep2Next) {
    btnStep2Next.addEventListener('click', () => {
      if (validateStep2()) {
        setStep(3);
      }
    });
  }

  if (btnStep3Back) {
    btnStep3Back.addEventListener('click', () => {
      setStep(2);
    });
  }

  // Submit / Create Account
  if (btnCreateAccount) {
    btnCreateAccount.addEventListener('click', () => {
      if (!validateStep3()) return;

      // Show Creating Account state
      btnCreateAccount.disabled = true;
      btnCreateAccount.innerHTML = `
        <span class="spinner"></span>
        <span>Creating account...</span>
      `;

      // Gather form data
      const selectedProduce = Array.from(produceCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      const registeredProfile = {
        businessName: inputBusinessName.value.trim(),
        contactPerson: inputContactPerson.value.trim(),
        phone: inputPhone.value.trim(),
        businessType: selectBusinessType.value,
        city: inputCity.value.trim(),
        district: inputDistrict.value.trim(),
        state: selectState.value,
        mainProduce: selectedProduce,
        purchaseQuantity: selectPurchaseQty.value,
        storageCapacity: selectStorageCap.value,
        mainSupplyArea: inputSupplyArea.value.trim()
      };

      // Persist to store
      if (window.AgriMitraStore) {
        window.AgriMitraStore.saveProfile(registeredProfile);
      }

      // Simulate short network delay and auto-redirect to dashboard
      setTimeout(() => {
        // Hide form panels, show success view
        if (wizardFormContainer && successContainer) {
          wizardFormContainer.style.display = 'none';
          successContainer.style.display = 'block';

          // Insert personalized name into success card
          const successBusinessEl = document.getElementById('success-business-name');
          if (successBusinessEl) {
            successBusinessEl.textContent = registeredProfile.businessName || 'MahaAgro Wholesale Dist.';
          }
        }

        // Auto-redirect to Distributor Dashboard
        setTimeout(() => {
          window.location.href = 'distributor/dashboard.html';
        }, 700);
      }, 400);
    });
  }
});
