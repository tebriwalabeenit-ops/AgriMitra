/**
 * AgriMitra - Universal Frontend Application Script
 * Compatible with both HTTP servers and local file:// execution (no ES module CORS restrictions)
 */

(function () {
  'use strict';

  // =========================================================================
  // Validation Rules & Messages
  // =========================================================================
  const ValidationMessages = {
    PHONE_EMPTY: 'Please enter your phone number.',
    PHONE_INVALID: 'Please enter a valid phone number.',
    PASSWORD_EMPTY: 'Please enter your password.',
    PASSWORD_SHORT: 'Password must be at least 6 characters.',
    PASSWORDS_DONT_MATCH: 'Passwords do not match.',
    NAME_EMPTY: 'Please enter your full name.',
    STATE_EMPTY: 'Please select your state.',
    CREDENTIALS_MISMATCH: 'Incorrect phone number or password.'
  };

  function cleanPhoneNumber(rawPhone) {
    if (!rawPhone) return '';
    let cleaned = rawPhone.replace(/[\s\-\(\)]/g, '');
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  }

  function validatePhoneNumber(phone) {
    const cleaned = cleanPhoneNumber(phone);
    if (!cleaned || cleaned.trim().length === 0) {
      return { isValid: false, error: ValidationMessages.PHONE_EMPTY, cleanedPhone: '' };
    }
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(cleaned)) {
      return { isValid: false, error: ValidationMessages.PHONE_INVALID, cleanedPhone: cleaned };
    }
    return { isValid: true, error: null, cleanedPhone: cleaned };
  }

  function validatePassword(password) {
    if (!password || password.trim().length === 0) {
      return { isValid: false, error: ValidationMessages.PASSWORD_EMPTY };
    }
    return { isValid: true, error: null };
  }

  function formatPhoneNumberDisplay(val) {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length > 5) {
      return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return digits;
  }

  // Toast Notification Helper
  function showToast(message) {
    let toast = document.getElementById('dash-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dash-toast';
      toast.className = 'dash-toast';
      toast.innerHTML = `
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span id="toast-text"></span>
      `;
      document.body.appendChild(toast);
    }
    const toastText = toast.querySelector('#toast-text') || toast;
    toastText.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  }

  // =========================================================================
  // Initialize on DOM Ready (Farmer Registration & Dashboard only)
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initRegisterPage();
    initDashboardPage();
  });

  // =========================================================================
  // 1. Farmer Registration Logic
  // =========================================================================
  function initRegisterPage() {
    const stateDistricts = {
      'Tamil Nadu': ['Krishnagiri', 'Dharmapuri', 'Salem', 'Thanjavur', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Erode', 'Vellore'],
      'Maharashtra': ['Nashik', 'Pune', 'Nagpur', 'Ahmednagar', 'Solapur', 'Kolhapur', 'Amravati', 'Aurangabad'],
      'Karnataka': ['Belagavi', 'Mysuru', 'Mandya', 'Shivamogga', 'Dharwad', 'Tumakuru', 'Hassan', 'Ballari'],
      'Andhra Pradesh': ['Guntur', 'Krishna', 'Kurnool', 'Anantapur', 'Chittoor', 'East Godavari', 'Nellore'],
      'Punjab': ['Ludhiana', 'Amritsar', 'Bathinda', 'Patiala', 'Jalandhar', 'Sangrur', 'Firozpur'],
      'Madhya Pradesh': ['Indore', 'Ujjain', 'Bhopal', 'Hoshangabad', 'Sehore', 'Dewas', 'Jabalpur'],
      'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Meerut', 'Agra', 'Bareilly', 'Aligarh', 'Kanpur']
    };

    const registerForms = document.querySelectorAll('.farmer-registration-form');
    if (!registerForms || registerForms.length === 0) return;

    registerForms.forEach((regForm) => {
      const nameInput = regForm.querySelector('.reg-name');
      const phoneInput = regForm.querySelector('.reg-phone');
      const phoneGroup = regForm.querySelector('.reg-phone-group');
      const phoneCounter = regForm.parentElement.querySelector('#reg-phone-counter, #spa-reg-phone-counter') || regForm.querySelector('.phone-digits-badge');
      const stateSelect = regForm.querySelector('.reg-state');
      const districtInput = regForm.querySelector('#reg-district-input, .reg-district') || regForm.querySelector('input[placeholder*="Krishnagiri"]');
      const passwordInput = regForm.querySelector('.reg-password');
      const confirmPasswordInput = regForm.querySelector('.reg-confirm-password');
      const submitBtn = regForm.querySelector('.reg-submit-btn');
      const successAlert = regForm.parentElement.querySelector('.reg-success-alert') || regForm.querySelector('.reg-success-alert');
      const errorAlert = regForm.parentElement.querySelector('.reg-error-alert') || regForm.querySelector('.reg-error-alert');
      const errorAlertText = errorAlert ? errorAlert.querySelector('.reg-error-text') : null;

      const strengthWrap = regForm.querySelector('.password-strength-wrap');
      const strengthText = regForm.querySelector('.strength-text');
      const strengthHint = regForm.querySelector('.strength-hint');
      const strengthSegments = strengthWrap ? strengthWrap.querySelectorAll('.strength-segment') : [];

      const matchStatus = regForm.querySelector('.password-match-status');
      const matchText = matchStatus ? (matchStatus.querySelector('#reg-password-match-text') || matchStatus.querySelector('span')) : null;

      // 1. Dynamic Password Show/Hide Toggle Buttons
      const toggleBtns = regForm.querySelectorAll('.password-toggle-btn');
      toggleBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const parentGroup = btn.closest('.password-input-group');
          if (!parentGroup) return;
          const input = parentGroup.querySelector('input');
          if (!input) return;
          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
          btn.title = isPassword ? 'Hide password' : 'Show password';
          const eyeIcon = btn.querySelector('.eye-icon');
          const eyeOffIcon = btn.querySelector('.eye-off-icon');
          if (eyeIcon && eyeOffIcon) {
            eyeIcon.style.display = isPassword ? 'none' : 'block';
            eyeOffIcon.style.display = isPassword ? 'block' : 'none';
          }
        });
      });

      // 2. Dynamic Live Phone Formatting, Counter & Validation
      if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
          const rawVal = e.target.value;
          const formatted = formatPhoneNumberDisplay(rawVal);
          if (e.target.value !== formatted) {
            e.target.value = formatted;
          }
          const cleaned = cleanPhoneNumber(rawVal);
          const digitCount = cleaned.length;

          if (phoneCounter) {
            phoneCounter.textContent = `${digitCount}/10 digits`;
            if (digitCount === 10) {
              phoneCounter.classList.add('complete');
              if (validatePhoneNumber(cleaned).isValid) {
                if (phoneGroup) phoneGroup.classList.add('is-valid');
              }
            } else {
              phoneCounter.classList.remove('complete');
              if (phoneGroup) phoneGroup.classList.remove('is-valid');
            }
          }

          if (phoneGroup) phoneGroup.classList.remove('has-error');
          if (errorAlert) errorAlert.style.display = 'none';
        });
      }

      // 3. Dynamic State-to-District Suggestions
      if (stateSelect && districtInput) {
        function updateDistrictSuggestions(stateName) {
          const districts = stateDistricts[stateName] || [];
          const listId = districtInput.getAttribute('list');
          let datalist = listId ? document.getElementById(listId) : null;
          if (!datalist) {
            datalist = document.createElement('datalist');
            const newId = 'dl-' + Math.random().toString(36).substr(2, 6);
            datalist.id = newId;
            districtInput.setAttribute('list', newId);
            regForm.appendChild(datalist);
          }
          datalist.innerHTML = '';
          districts.forEach((d) => {
            const opt = document.createElement('option');
            opt.value = d;
            datalist.appendChild(opt);
          });
          if (districts.length > 0) {
            districtInput.placeholder = `e.g. ${districts[0]}`;
          }
        }

        stateSelect.addEventListener('change', () => {
          updateDistrictSuggestions(stateSelect.value);
        });
        updateDistrictSuggestions(stateSelect.value);
      }

      // 4. Dynamic Live Password Strength Meter
      function evaluateStrength(pwd) {
        if (!pwd || pwd.length === 0) return { score: 0, label: '', hint: '' };
        if (pwd.length < 6) return { score: 1, label: 'Too short', hint: 'Min 6 characters', css: 'active-weak' };

        let score = 2; // Met minimum length
        const hasNumbers = /\d/.test(pwd);
        const hasLetters = /[a-zA-Z]/.test(pwd);
        const hasMixedCase = /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
        const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);

        if (pwd.length >= 8 && hasNumbers && hasLetters) score = 3;
        if (pwd.length >= 8 && ((hasMixedCase && hasNumbers) || hasSpecial)) score = 4;

        if (score === 2) return { score: 2, label: 'Fair', hint: 'Add numbers & mix case', css: 'active-fair' };
        if (score === 3) return { score: 3, label: 'Good', hint: 'Good Kisan password', css: 'active-good' };
        return { score: 4, label: 'Strong', hint: 'Excellent Kisan security', css: 'active-strong' };
      }

      function updatePasswordUI() {
        if (!passwordInput) return;
        const pwd = passwordInput.value;
        if (pwd.length > 0) {
          if (strengthWrap) strengthWrap.style.display = 'block';
          const res = evaluateStrength(pwd);
          if (strengthText) {
            strengthText.textContent = res.label;
            strengthText.className = 'strength-text ' + (res.label.toLowerCase().replace(/\s+/g, '-'));
          }
          if (strengthHint) strengthHint.textContent = res.hint;
          strengthSegments.forEach((seg, idx) => {
            seg.className = 'strength-segment';
            if (idx < res.score) {
              seg.classList.add(res.css);
            }
          });
        } else {
          if (strengthWrap) strengthWrap.style.display = 'none';
        }
        checkPasswordMatch();
      }

      if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordUI);
      }

      // 5. Dynamic Live Password Match Feedback
      function checkPasswordMatch() {
        if (!passwordInput || !confirmPasswordInput || !matchStatus) return;
        const p1 = passwordInput.value;
        const p2 = confirmPasswordInput.value;

        if (!p2 || p2.length === 0) {
          matchStatus.style.display = 'none';
          matchStatus.className = 'password-match-status';
          return;
        }

        if (p1 === p2) {
          matchStatus.className = 'password-match-status match';
          matchStatus.style.display = 'flex';
          if (matchText) matchText.textContent = 'Passwords match';
        } else {
          matchStatus.className = 'password-match-status mismatch';
          matchStatus.style.display = 'flex';
          if (matchText) matchText.textContent = 'Passwords do not match';
        }
      }

      if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
      }

      // 6. Name Validation Active State
      if (nameInput) {
        nameInput.addEventListener('input', () => {
          const parentGroup = nameInput.closest('.password-input-group');
          if (nameInput.value.trim().length >= 2) {
            if (parentGroup) parentGroup.classList.add('is-valid');
          } else {
            if (parentGroup) parentGroup.classList.remove('is-valid');
          }
        });
      }

      // 7. Form Submission Handler - Enforces compulsory validation
      function handleFarmerRegistrationSubmit(e) {
        if (e && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }

        function showFormError(msg, targetInput) {
          if (errorAlert) {
            errorAlert.style.display = 'flex';
            if (errorAlertText) errorAlertText.textContent = msg;
          }
          if (successAlert) successAlert.style.display = 'none';
          if (targetInput) {
            targetInput.focus();
            const group = targetInput.closest('.password-input-group, .phone-input-group, .form-group');
            if (group) {
              group.classList.add('has-error');
              setTimeout(() => group.classList.remove('has-error'), 3000);
            }
          }
        }

        // 1. Full Name (Compulsory)
        const nameVal = nameInput ? nameInput.value.trim() : '';
        if (!nameVal || nameVal.length < 2) {
          showFormError('Please enter your full name (minimum 2 characters).', nameInput);
          return;
        }

        // 2. Phone Number (Compulsory, 10 digits starting with 6-9)
        const phoneVal = phoneInput ? phoneInput.value : '';
        const phoneCheck = validatePhoneNumber(phoneVal);
        if (!phoneCheck.isValid) {
          showFormError(phoneCheck.error || 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.', phoneInput);
          return;
        }

        // 3. State (Compulsory)
        if (stateSelect && !stateSelect.value) {
          showFormError('Please select your state from the list.', stateSelect);
          return;
        }

        // 4. District (Compulsory)
        const districtVal = districtInput ? districtInput.value.trim() : '';
        if (!districtVal) {
          showFormError('Please enter or select your district.', districtInput);
          return;
        }

        // 5. Password (Compulsory, min 6 chars)
        const pwdVal = passwordInput ? passwordInput.value : '';
        if (!pwdVal) {
          showFormError('Please enter a password for your account.', passwordInput);
          return;
        }
        if (pwdVal.length < 6) {
          showFormError('Password must be at least 6 characters long.', passwordInput);
          return;
        }

        // 6. Confirm Password (Compulsory, must match)
        const confirmVal = confirmPasswordInput ? confirmPasswordInput.value : '';
        if (!confirmVal) {
          showFormError('Please confirm your password.', confirmPasswordInput);
          return;
        }
        if (pwdVal !== confirmVal) {
          showFormError('Passwords do not match. Please re-enter identical passwords.', confirmPasswordInput);
          return;
        }

        // All compulsory validations passed!
        try {
          localStorage.setItem('agriFarmerName', nameVal);
          localStorage.setItem('agriFarmerPhone', phoneCheck.cleanedPhone || phoneVal);
        } catch(err) {}

        if (errorAlert) errorAlert.style.display = 'none';
        if (successAlert) successAlert.style.display = 'block';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="btn-spinner" style="display:inline-block"></span> <span>Registering & Redirecting...</span>';
        }

        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 400);
      }

      regForm.addEventListener('submit', handleFarmerRegistrationSubmit);
    });
  }

  // =========================================================================
  // 3. Simple & Interactive Farmer Dashboard Logic
  // =========================================================================
  function initDashboardPage() {
    // Load registered farmer name if available
    try {
      const storedName = localStorage.getItem('agriFarmerName');
      if (storedName) {
        const userNameEl = document.querySelector('.user-name');
        const userAvatarEl = document.querySelector('.user-avatar');
        const bannerHeading = document.querySelector('.farmer-banner-text h1');
        if (userNameEl) userNameEl.textContent = storedName;
        if (bannerHeading) bannerHeading.textContent = `Namaste, ${storedName.split(' ')[0]} Ji`;
        if (userAvatarEl) {
          const initials = storedName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          userAvatarEl.textContent = initials || 'RP';
        }
      }
    } catch(err) {}

    // Sign out button
    const signOutBtns = document.querySelectorAll('#sign-out-btn, .btn-signout');
    signOutBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const registerView = document.getElementById('register-view');
        const dashboardView = document.getElementById('dashboard-view');
        if (registerView && dashboardView) {
          e.preventDefault();
          dashboardView.classList.remove('active');
          registerView.style.display = 'flex';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.history && window.history.pushState) {
            window.history.pushState({ view: 'register' }, '', '#farmer/register');
          }
        } else {
          window.location.href = 'register.html';
        }
      });
    });

    // Produce Modal Elements (Sell Crop / Add Listing)
    const openModalBtns = document.querySelectorAll('.open-produce-modal-btn');
    const produceModal = document.getElementById('produce-modal');
    const closeProduceModalBtn = document.getElementById('close-produce-modal-btn');
    const cancelProduceModalBtn = document.getElementById('cancel-produce-modal-btn');
    const addProduceForm = document.getElementById('add-produce-form');

    if (openModalBtns && produceModal) {
      openModalBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          produceModal.classList.add('active');
          const firstInput = produceModal.querySelector('input, select');
          if (firstInput) firstInput.focus();
        });
      });
    }

    function closeProduceModal() {
      if (produceModal) {
        produceModal.classList.remove('active');
      }
    }

    if (closeProduceModalBtn) closeProduceModalBtn.addEventListener('click', closeProduceModal);
    if (cancelProduceModalBtn) cancelProduceModalBtn.addEventListener('click', closeProduceModal);

    if (produceModal) {
      produceModal.addEventListener('click', (e) => {
        if (e.target === produceModal) closeProduceModal();
      });
    }

    // Add New Produce Form Submit Handler
    if (addProduceForm) {
      addProduceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cropNameInput = document.getElementById('crop-select');
        const cropVarietyInput = document.getElementById('crop-variety');
        const cropQtyInput = document.getElementById('crop-qty');
        const cropUnitInput = document.getElementById('crop-unit');
        const cropPriceInput = document.getElementById('crop-price');
        const cropLocationInput = document.getElementById('crop-location');

        const cropName = cropNameInput ? cropNameInput.value : 'Paddy';
        const cropVariety = (cropVarietyInput && cropVarietyInput.value.trim()) ? cropVarietyInput.value.trim() : 'Standard Quality';
        const cropQty = cropQtyInput ? cropQtyInput.value : '50';
        const cropUnit = cropUnitInput ? cropUnitInput.value : 'Quintals';
        const cropPrice = cropPriceInput ? cropPriceInput.value : '2500';
        const cropLocation = (cropLocationInput && cropLocationInput.value.trim()) ? cropLocationInput.value.trim() : 'Krishnagiri APMC Warehouse';

        // Prepend new listing card to #crop-cards-list
        const cropCardsList = document.getElementById('crop-cards-list');
        if (cropCardsList) {
          const newCard = document.createElement('div');
          newCard.className = 'crop-card-item';
          newCard.style.borderLeft = '4px solid #15803d';
          newCard.innerHTML = `
            <div class="crop-top-row">
              <div>
                <div class="crop-name">${cropName} (${cropVariety})</div>
                <div class="crop-meta-text">${cropQty} ${cropUnit} &bull; ${cropLocation}</div>
              </div>
              <div class="crop-price-box">
                <div class="crop-price">&#8377; ${Number(cropPrice).toLocaleString('en-IN')}</div>
                <div class="crop-price-unit">per ${cropUnit.slice(0, -1)}</div>
              </div>
            </div>
            <div class="crop-bottom-row">
              <span class="crop-bids-pill" style="background-color:#e0f2fe; color:#0369a1;">
                &#9679; Live on Market &bull; Just Added
              </span>
              <div class="crop-actions-btns">
                <button type="button" class="btn-sm-action mark-sold-btn">Mark Sold</button>
                <button type="button" class="btn-sm-action btn-sm-primary" onclick="alert('Your listing is live! 14 registered buyers have received an alert.')">Share Bids</button>
              </div>
            </div>
          `;
          cropCardsList.insertBefore(newCard, cropCardsList.firstChild);

          // Update active count on badge
          const activeBadge = document.getElementById('active-crops-count');
          if (activeBadge) {
            const currentCount = parseInt(activeBadge.textContent) || 3;
            activeBadge.textContent = `${currentCount + 1} Active`;
          }
          const hubListingVal = document.getElementById('hub-listings-val');
          if (hubListingVal) {
            const currentCount = parseInt(hubListingVal.textContent) || 3;
            hubListingVal.textContent = `${currentCount + 1} Crops Listed`;
          }
        }

        closeProduceModal();
        addProduceForm.reset();
        showToast(`🌾 ${cropName} (${cropQty} ${cropUnit}) published successfully! 14 buyers notified.`);
      });
    }

    // Accept Buyer Offer Handler
    document.addEventListener('click', (e) => {
      const acceptBtn = e.target.closest('.btn-accept-offer');
      if (acceptBtn) {
        const bidCard = acceptBtn.closest('.bid-item');
        if (bidCard) {
          bidCard.classList.add('accepted');
          acceptBtn.textContent = '✅ Offer Accepted';
          acceptBtn.disabled = true;
          acceptBtn.style.backgroundColor = '#166534';
          acceptBtn.style.cursor = 'default';

          const buyerName = bidCard.querySelector('.buyer-name')?.textContent || 'Buyer';
          showToast(`✅ Offer from ${buyerName} accepted! Pickup scheduled.`);
        }
      }

      // Mark as sold handler
      const markSoldBtn = e.target.closest('.mark-sold-btn');
      if (markSoldBtn) {
        const cropCard = markSoldBtn.closest('.crop-card-item');
        if (cropCard) {
          const pill = cropCard.querySelector('.crop-bids-pill');
          if (pill) {
            pill.textContent = '✓ Sold & Payment Settled';
            pill.style.backgroundColor = '#f1f5f9';
            pill.style.color = '#475569';
          }
          markSoldBtn.textContent = 'Sold';
          markSoldBtn.disabled = true;
          markSoldBtn.style.cursor = 'default';
          showToast('Lot marked as sold! Added to your payment records.');
        }
      }

      // Request callback button
      const callbackBtn = e.target.closest('.request-callback-btn');
      if (callbackBtn) {
        callbackBtn.textContent = '✓ Callback Requested';
        callbackBtn.disabled = true;
        showToast('📞 Kisan Sahayak will call you on +91 98765 43210 within 15 minutes.');
      }
    });

  }

})();
