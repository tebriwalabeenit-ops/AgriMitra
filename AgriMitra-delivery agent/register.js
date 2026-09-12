

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('registration-form');
  const stepView1 = document.getElementById('step-view-1');
  const stepView2 = document.getElementById('step-view-2');
  const stepView3 = document.getElementById('step-view-3');
  const successScreen = document.getElementById('success-screen');

  const formHeaderBlock = document.getElementById('form-header-block');
  const dynamicHeading = document.getElementById('dynamic-form-heading');
  const dynamicSubheading = document.getElementById('dynamic-form-subheading');
  const formStepper = document.getElementById('form-stepper');

  const stepNode1 = document.getElementById('step-node-1');
  const stepNode2 = document.getElementById('step-node-2');
  const stepNode3 = document.getElementById('step-node-3');
  const stepLine1 = document.getElementById('step-line-1');
  const stepLine2 = document.getElementById('step-line-2');

  const btnContinueStep1 = document.getElementById('btn-continue-step1');
  const btnBackStep2 = document.getElementById('btn-back-step2');
  const btnContinueStep2 = document.getElementById('btn-continue-step2');
  const btnBackStep3 = document.getElementById('btn-back-step3');
  const btnSubmitRegistration = document.getElementById('btn-submit-registration');
  const btnDone = document.getElementById('btn-done');
  const btnRegisterAnother = document.getElementById('btn-register-another');

  const fullNameInput = document.getElementById('full-name');
  const phoneInput = document.getElementById('phone-number');
  const phoneGroup = document.getElementById('phone-group');
  const stateSelect = document.getElementById('state');
  const districtSelect = document.getElementById('district');
  const cityAreaInput = document.getElementById('city-area');

  const fullNameError = document.getElementById('full-name-error');
  const phoneError = document.getElementById('phone-error');
  const stateError = document.getElementById('state-error');
  const districtError = document.getElementById('district-error');
  const cityAreaError = document.getElementById('city-area-error');

  const vehCards = document.querySelectorAll('.veh-card');
  const capacityChips = document.querySelectorAll('#capacity-options-container .chip-card');
  const availabilityChips = document.querySelectorAll('#availability-options-container .chip-card');
  const serviceAreaInput = document.getElementById('service-area');

  const vehicleError = document.getElementById('vehicle-error');
  const capacityError = document.getElementById('capacity-error');
  const serviceAreaError = document.getElementById('service-area-error');
  const availabilityError = document.getElementById('availability-error');

  const licenseInput = document.getElementById('license-number');
  const rcInput = document.getElementById('rc-number');
  const additionalNotesInput = document.getElementById('additional-notes');
  const licenseError = document.getElementById('license-error');
  const rcError = document.getElementById('rc-error');

  const sumName = document.getElementById('sum-name');
  const sumPhone = document.getElementById('sum-phone');
  const sumLocation = document.getElementById('sum-location');
  const sumVehicle = document.getElementById('sum-vehicle');
  const sumCapacity = document.getElementById('sum-capacity');
  const sumServiceArea = document.getElementById('sum-service-area');
  const sumAvailability = document.getElementById('sum-availability');
  const sumLicense = document.getElementById('sum-license');

  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    clearFieldError(phoneInput, phoneError, phoneGroup);
  });

  fullNameInput.addEventListener('input', () => clearFieldError(fullNameInput, fullNameError));
  stateSelect.addEventListener('change', () => clearFieldError(stateSelect, stateError));
  districtSelect.addEventListener('change', () => clearFieldError(districtSelect, districtError));
  cityAreaInput.addEventListener('input', () => clearFieldError(cityAreaInput, cityAreaError));
  serviceAreaInput.addEventListener('input', () => clearFieldError(serviceAreaInput, serviceAreaError));
  licenseInput.addEventListener('input', () => clearFieldError(licenseInput, licenseError));
  rcInput.addEventListener('input', () => clearFieldError(rcInput, rcError));

  vehCards.forEach(card => {
    card.addEventListener('click', () => {
      vehCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      clearCustomError(vehicleError);
    });
  });

  capacityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      capacityChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const radio = chip.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      clearCustomError(capacityError);
    });
  });

  availabilityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      availabilityChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const radio = chip.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      clearCustomError(availabilityError);
    });
  });

  function showFieldError(input, errorElem, message, wrapper = null) {
    if (wrapper) {
      wrapper.classList.add('input-error');
    } else {
      input.classList.add('input-error');
    }
    errorElem.innerHTML = `
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>${message}</span>
    `;
    errorElem.classList.add('visible');
    input.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(input, errorElem, wrapper = null) {
    if (wrapper) {
      wrapper.classList.remove('input-error');
    } else {
      input.classList.remove('input-error');
    }
    errorElem.classList.remove('visible');
    errorElem.innerHTML = '';
    input.removeAttribute('aria-invalid');
  }

  function showCustomError(errorElem, message) {
    errorElem.innerHTML = `
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>${message}</span>
    `;
    errorElem.classList.add('visible');
  }

  function clearCustomError(errorElem) {
    errorElem.classList.remove('visible');
    errorElem.innerHTML = '';
  }

  function validateStep1() {
    let isValid = true;
    let firstInvalid = null;

    const nameVal = fullNameInput.value.trim();
    if (!nameVal) {
      showFieldError(fullNameInput, fullNameError, 'Please enter your full name.');
      if (!firstInvalid) firstInvalid = fullNameInput;
      isValid = false;
    } else if (nameVal.length < 2) {
      showFieldError(fullNameInput, fullNameError, 'Please enter a valid full name.');
      if (!firstInvalid) firstInvalid = fullNameInput;
      isValid = false;
    } else {
      clearFieldError(fullNameInput, fullNameError);
    }

    const phoneVal = phoneInput.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneVal) {
      showFieldError(phoneInput, phoneError, 'Please enter your phone number.', phoneGroup);
      if (!firstInvalid) firstInvalid = phoneInput;
      isValid = false;
    } else if (!phoneRegex.test(phoneVal)) {
      showFieldError(phoneInput, phoneError, 'Please enter a valid 10-digit mobile number.', phoneGroup);
      if (!firstInvalid) firstInvalid = phoneInput;
      isValid = false;
    } else {
      clearFieldError(phoneInput, phoneError, phoneGroup);
    }

    if (!stateSelect.value) {
      showFieldError(stateSelect, stateError, 'Please select your state.');
      if (!firstInvalid) firstInvalid = stateSelect;
      isValid = false;
    } else {
      clearFieldError(stateSelect, stateError);
    }

    if (!districtSelect.value) {
      showFieldError(districtSelect, districtError, 'Please select your district.');
      if (!firstInvalid) firstInvalid = districtSelect;
      isValid = false;
    } else {
      clearFieldError(districtSelect, districtError);
    }

    const cityVal = cityAreaInput.value.trim();
    if (!cityVal) {
      showFieldError(cityAreaInput, cityAreaError, 'Please enter your city or area.');
      if (!firstInvalid) firstInvalid = cityAreaInput;
      isValid = false;
    } else {
      clearFieldError(cityAreaInput, cityAreaError);
    }

    if (!isValid && firstInvalid) {
      firstInvalid.focus();
    }

    return isValid;
  }

  function validateStep2() {
    let isValid = true;
    let firstInvalid = null;

    const selectedVeh = document.querySelector('input[name="vehicle_type"]:checked');
    if (!selectedVeh) {
      showCustomError(vehicleError, 'Please select your vehicle type.');
      if (!firstInvalid) firstInvalid = document.getElementById('vehicle-options-container');
      isValid = false;
    } else {
      clearCustomError(vehicleError);
    }

    const selectedCap = document.querySelector('input[name="vehicle_capacity"]:checked');
    if (!selectedCap) {
      showCustomError(capacityError, 'Please select your vehicle capacity.');
      if (!firstInvalid) firstInvalid = document.getElementById('capacity-options-container');
      isValid = false;
    } else {
      clearCustomError(capacityError);
    }

    const areaVal = serviceAreaInput.value.trim();
    if (!areaVal) {
      showFieldError(serviceAreaInput, serviceAreaError, 'Please enter where you can deliver.');
      if (!firstInvalid) firstInvalid = serviceAreaInput;
      isValid = false;
    } else {
      clearFieldError(serviceAreaInput, serviceAreaError);
    }

    const selectedAvail = document.querySelector('input[name="availability"]:checked');
    if (!selectedAvail) {
      showCustomError(availabilityError, 'Please select your availability.');
      if (!firstInvalid) firstInvalid = document.getElementById('availability-options-container');
      isValid = false;
    } else {
      clearCustomError(availabilityError);
    }

    if (!isValid && firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof firstInvalid.focus === 'function') firstInvalid.focus();
    }

    return isValid;
  }

  function validateStep3() {
    let isValid = true;
    let firstInvalid = null;

    const licVal = licenseInput.value.trim();
    if (!licVal) {
      showFieldError(licenseInput, licenseError, 'Please enter your driving license number.');
      if (!firstInvalid) firstInvalid = licenseInput;
      isValid = false;
    } else {
      clearFieldError(licenseInput, licenseError);
    }

    const rcVal = rcInput.value.trim();
    if (!rcVal) {
      showFieldError(rcInput, rcError, 'Please enter your vehicle RC number.');
      if (!firstInvalid) firstInvalid = rcInput;
      isValid = false;
    } else {
      clearFieldError(rcInput, rcError);
    }

    if (!isValid && firstInvalid) {
      firstInvalid.focus();
    }

    return isValid;
  }

  btnContinueStep1.addEventListener('click', () => {
    if (validateStep1()) {
      stepView1.classList.remove('active');
      stepView2.classList.add('active');

      stepNode1.classList.remove('active');
      stepNode1.classList.add('completed');
      stepNode1.querySelector('.node-circle').innerHTML = `
        <svg style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 3;" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      stepLine1.classList.add('filled');
      stepNode2.classList.add('active');

      dynamicHeading.textContent = 'Vehicle & Delivery Details';
      dynamicSubheading.textContent = 'Specify your vehicle and transport capacity.';
    }
  });

  btnBackStep2.addEventListener('click', () => {
    stepView2.classList.remove('active');
    stepView1.classList.add('active');

    stepNode2.classList.remove('active');
    stepLine1.classList.remove('filled');
    stepNode1.classList.remove('completed');
    stepNode1.classList.add('active');
    stepNode1.querySelector('.node-circle').textContent = '1';

    dynamicHeading.textContent = 'Create Delivery Agent Account';
    dynamicSubheading.textContent = 'Join our delivery network and start earning.';
  });

  btnContinueStep2.addEventListener('click', () => {
    if (validateStep2()) {
      stepView2.classList.remove('active');
      stepView3.classList.add('active');

      stepNode2.classList.remove('active');
      stepNode2.classList.add('completed');
      stepNode2.querySelector('.node-circle').innerHTML = `
        <svg style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 3;" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      stepLine2.classList.add('filled');
      stepNode3.classList.add('active');

      dynamicHeading.textContent = 'Document Verification';
      dynamicSubheading.textContent = 'Provide your credentials for delivery authorization.';
    }
  });

  btnBackStep3.addEventListener('click', () => {
    stepView3.classList.remove('active');
    stepView2.classList.add('active');

    stepNode3.classList.remove('active');
    stepLine2.classList.remove('filled');
    stepNode2.classList.remove('completed');
    stepNode2.classList.add('active');
    stepNode2.querySelector('.node-circle').textContent = '2';

    dynamicHeading.textContent = 'Vehicle & Delivery Details';
    dynamicSubheading.textContent = 'Specify your vehicle and transport capacity.';
  });

  btnSubmitRegistration.addEventListener('click', () => {
    if (!validateStep3()) {
      return;
    }

    btnSubmitRegistration.disabled = true;
    btnBackStep3.disabled = true;
    const origBtnHtml = btnSubmitRegistration.innerHTML;
    btnSubmitRegistration.innerHTML = `
      <span class="spin-loader"></span>
      <span>Registering...</span>
    `;

    const name = fullNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const state = stateSelect.value;
    const district = districtSelect.value;
    const city = cityAreaInput.value.trim();

    const veh = document.querySelector('input[name="vehicle_type"]:checked')?.value || 'Small Truck';
    const cap = document.querySelector('input[name="vehicle_capacity"]:checked')?.value || '500 kg–1 tonne';
    const area = serviceAreaInput.value.trim();
    const avail = document.querySelector('input[name="availability"]:checked')?.value || 'Full Day';
    const lic = licenseInput.value.trim();
    const rc = rcInput.value.trim();

    setTimeout(() => {

      stepNode3.classList.remove('active');
      stepNode3.classList.add('completed');
      stepNode3.querySelector('.node-circle').innerHTML = `
        <svg style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 3;" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      sumName.textContent = name;
      sumPhone.textContent = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
      sumLocation.textContent = `${city}, ${district}, ${state}`;
      sumVehicle.textContent = veh;
      sumCapacity.textContent = cap;
      sumServiceArea.textContent = area;
      sumAvailability.textContent = avail;
      sumLicense.textContent = `${lic} / ${rc}`;

      form.style.display = 'none';
      formHeaderBlock.style.display = 'none';
      formStepper.style.display = 'none';

      successScreen.classList.add('active');

      btnSubmitRegistration.disabled = false;
      btnBackStep3.disabled = false;
      btnSubmitRegistration.innerHTML = origBtnHtml;
    }, 1200);
  });

  btnDone.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  btnRegisterAnother.addEventListener('click', () => {
    form.reset();

    vehCards.forEach(c => c.classList.remove('selected'));
    capacityChips.forEach(c => c.classList.remove('selected'));
    availabilityChips.forEach(c => c.classList.remove('selected'));

    stateSelect.value = 'Maharashtra';
    districtSelect.value = '';

    form.style.display = 'block';
    formHeaderBlock.style.display = 'block';
    formStepper.style.display = 'flex';

    dynamicHeading.textContent = 'Create Delivery Agent Account';
    dynamicSubheading.textContent = 'Join our delivery network and start earning.';

    stepView1.classList.add('active');
    stepView2.classList.remove('active');
    stepView3.classList.remove('active');
    successScreen.classList.remove('active');

    stepNode1.className = 'step-node active';
    stepNode1.querySelector('.node-circle').textContent = '1';
    stepLine1.className = 'step-line';
    stepNode2.className = 'step-node';
    stepNode2.querySelector('.node-circle').textContent = '2';
    stepLine2.className = 'step-line';
    stepNode3.className = 'step-node';
    stepNode3.querySelector('.node-circle').textContent = '3';
  });

  const alreadyText = document.getElementById('already-registered-text');
  const alreadyLink = document.getElementById('link-login-delivery');
  const deliveryLoginUrl = '../index.html#login?role=delivery';

  if (alreadyLink) {
    alreadyLink.href = deliveryLoginUrl;
  }
  if (alreadyText) {
    alreadyText.addEventListener('click', () => {
      window.location.href = deliveryLoginUrl;
    });
  }
});
