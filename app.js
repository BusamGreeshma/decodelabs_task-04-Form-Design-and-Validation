document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // DOM ELEMENT SELECTION
  // ==========================================================================
  const form = document.getElementById('registerForm');
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const specializationSelect = document.getElementById('specialization');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const termsCheckbox = document.getElementById('terms');
  
  // Progress indicators
  const progressContainer = document.getElementById('progressContainer');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressPercentage = document.getElementById('progressPercentage');
  
  // Password Strength Widgets
  const strengthContainer = document.getElementById('strengthContainer');
  const strengthRating = document.getElementById('strengthRating');
  const ruleItems = {
    length: document.querySelector('.rule[data-rule="length"]'),
    case: document.querySelector('.rule[data-rule="case"]'),
    number: document.querySelector('.rule[data-rule="number"]'),
    special: document.querySelector('.rule[data-rule="special"]')
  };
  
  // Submit Button
  const submitBtn = document.getElementById('submitBtn');
  
  // Success Modal
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const summaryName = document.getElementById('summaryName');
  const summaryEmail = document.getElementById('summaryEmail');
  const summaryRole = document.getElementById('summaryRole');

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  // Track whether a field has been interacted with (to avoid premature error showing)
  const touchedFields = {
    name: false,
    email: false,
    phone: false,
    specialization: false,
    password: false,
    confirmPassword: false,
    terms: false
  };

  // ==========================================================================
  // PASSWORD VISIBILITY TOGGLE
  // ==========================================================================
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.closest('.input-group').querySelector('input');
      const eyeShow = toggle.querySelector('.eye-show');
      const eyeHide = toggle.querySelector('.eye-hide');
      
      if (input.type === 'password') {
        input.type = 'text';
        toggle.setAttribute('aria-label', 'Hide password');
        if (eyeShow) eyeShow.style.display = 'none';
        if (eyeHide) eyeHide.style.display = 'block';
      } else {
        input.type = 'password';
        toggle.setAttribute('aria-label', 'Show password');
        if (eyeShow) eyeShow.style.display = 'block';
        if (eyeHide) eyeHide.style.display = 'none';
      }
    });
  });

  // ==========================================================================
  // HELPERS FOR VISUAL VALIDATION STATE
  // ==========================================================================
  const showError = (element, message) => {
    const wrapper = element.closest('.input-wrapper');
    wrapper.classList.remove('is-valid');
    wrapper.classList.add('has-error');
    
    const errorMsgElement = wrapper.querySelector('.error-msg');
    if (errorMsgElement) {
      errorMsgElement.textContent = message;
    }
  };

  const showSuccess = (element) => {
    const wrapper = element.closest('.input-wrapper');
    wrapper.classList.remove('has-error');
    wrapper.classList.add('is-valid');
    
    const errorMsgElement = wrapper.querySelector('.error-msg');
    if (errorMsgElement) {
      errorMsgElement.textContent = '';
    }
  };

  const clearStatus = (element) => {
    const wrapper = element.closest('.input-wrapper');
    wrapper.classList.remove('has-error', 'is-valid');
    
    const errorMsgElement = wrapper.querySelector('.error-msg');
    if (errorMsgElement) {
      errorMsgElement.textContent = '';
    }
  };

  // ==========================================================================
  // CORE FIELD VALIDATION ALGORITHMS
  // ==========================================================================
  
  // 1. Full Name Validation
  const validateName = () => {
    const value = fullnameInput.value.trim();
    if (!value) {
      if (touchedFields.name) showError(fullnameInput, 'Operator identifier is required.');
      return false;
    }
    
    // Check minimum length
    if (value.length < 3) {
      if (touchedFields.name) showError(fullnameInput, 'Name must be at least 3 characters.');
      return false;
    }
    
    // Allow only alphabetical characters, spaces, apostrophes, and hyphens
    const nameRegex = /^[a-zA-Z\s'\-]+$/;
    if (!nameRegex.test(value)) {
      if (touchedFields.name) showError(fullnameInput, 'Name contains invalid characters.');
      return false;
    }
    
    showSuccess(fullnameInput);
    return true;
  };

  // 2. Email Address Validation
  const validateEmail = () => {
    const value = emailInput.value.trim();
    if (!value) {
      if (touchedFields.email) showError(emailInput, 'Secure communication channel is required.');
      return false;
    }
    
    // Comprehensive RFC-compliant regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      if (touchedFields.email) showError(emailInput, 'Please input a valid email configuration (e.g. user@domain.com).');
      return false;
    }
    
    showSuccess(emailInput);
    return true;
  };

  // 3. Phone Number Validation
  const validatePhone = () => {
    const value = phoneInput.value.trim();
    if (!value) {
      if (touchedFields.phone) showError(phoneInput, 'Contact frequency is required.');
      return false;
    }
    
    // Sanitize input: Strip spaces, hyphens, and parenthesis
    const sanitized = value.replace(/[\s\-\(\)]/g, '');
    
    // Verify standard 10-digit number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(sanitized)) {
      if (touchedFields.phone) showError(phoneInput, 'Phone connection requires exactly 10 digits.');
      return false;
    }
    
    showSuccess(phoneInput);
    return true;
  };

  // 4. Specialization Selection Validation
  const validateSpecialization = () => {
    const value = specializationSelect.value;
    if (!value) {
      if (touchedFields.specialization) showError(specializationSelect, 'A specialization protocol must be selected.');
      return false;
    }
    
    showSuccess(specializationSelect);
    return true;
  };

  // 5. Password Rule Evaluation & Validation
  const evaluatePasswordStrength = () => {
    const value = passwordInput.value;
    
    if (!value) {
      strengthContainer.style.display = 'none';
      if (touchedFields.password) showError(passwordInput, 'Access pass phrase is required.');
      return { isValid: false, strength: 0 };
    }
    
    // Open strength metrics on focus
    strengthContainer.style.display = 'block';
    
    // Evaluate rule criteria
    const rules = {
      length: value.length >= 8,
      case: /[a-z]/.test(value) && /[A-Z]/.test(value),
      number: /\d/.test(value),
      special: /[^A-Za-z0-9]/.test(value)
    };
    
    // Update rules list UI
    let satisfiedRules = 0;
    for (const [ruleName, isSatisfied] of Object.entries(rules)) {
      if (isSatisfied) {
        ruleItems[ruleName].classList.add('valid');
        satisfiedRules++;
      } else {
        ruleItems[ruleName].classList.remove('valid');
      }
    }
    
    // Assign strength rating metadata
    let strengthName = 'Empty';
    if (satisfiedRules === 1) strengthName = 'Weak';
    else if (satisfiedRules === 2) strengthName = 'Fair';
    else if (satisfiedRules === 3) strengthName = 'Good';
    else if (satisfiedRules === 4) strengthName = 'Strong';
    
    strengthRating.textContent = strengthName;
    strengthContainer.setAttribute('data-strength', satisfiedRules);
    
    // Overall Password validity condition
    if (satisfiedRules < 4) {
      if (touchedFields.password) {
        showError(passwordInput, 'Password does not meet all security protocol requirements.');
      }
      return { isValid: false, strength: satisfiedRules };
    }
    
    showSuccess(passwordInput);
    return { isValid: true, strength: satisfiedRules };
  };

  // 6. Confirm Password Validation
  const validateConfirmPassword = () => {
    const valConfirm = confirmPasswordInput.value;
    const valPass = passwordInput.value;
    
    if (!valConfirm) {
      if (touchedFields.confirmPassword) showError(confirmPasswordInput, 'Security validation check is required.');
      return false;
    }
    
    if (valConfirm !== valPass) {
      if (touchedFields.confirmPassword) showError(confirmPasswordInput, 'Credentials match failure. Password signatures do not match.');
      return false;
    }
    
    showSuccess(confirmPasswordInput);
    return true;
  };

  // 7. Terms & Conditions Validation
  const validateTerms = () => {
    const isChecked = termsCheckbox.checked;
    if (!isChecked) {
      if (touchedFields.terms) showError(termsCheckbox, 'Compliance terms agreement is required to proceed.');
      return false;
    }
    
    showSuccess(termsCheckbox);
    return true;
  };

  // ==========================================================================
  // PROGRESS TRACKING & RE-EVALUATION SYSTEM
  // ==========================================================================
  const updateFormProgress = () => {
    // Run core validation without setting 'touchedFields' to true 
    // to update completion statistics silently without generating UI errors
    const isNameValid = fullnameInput.value.trim().length >= 3 && /^[a-zA-Z\s'\-]+$/.test(fullnameInput.value.trim());
    const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput.value.trim());
    
    const sanitizedPhone = phoneInput.value.trim().replace(/[\s\-\(\)]/g, '');
    const isPhoneValid = /^\d{10}$/.test(sanitizedPhone);
    
    const isSpecValid = specializationSelect.value !== '';
    
    const passVal = passwordInput.value;
    const isPassValid = passVal.length >= 8 && 
                        /[a-z]/.test(passVal) && 
                        /[A-Z]/.test(passVal) && 
                        /\d/.test(passVal) && 
                        /[^A-Za-z0-9]/.test(passVal);
                        
    const isConfirmValid = confirmPasswordInput.value !== '' && confirmPasswordInput.value === passVal;
    const isTermsValid = termsCheckbox.checked;
    
    // Count success variables
    const validFields = [
      isNameValid,
      isEmailValid,
      isPhoneValid,
      isSpecValid,
      isPassValid,
      isConfirmValid,
      isTermsValid
    ];
    
    const totalValid = validFields.filter(Boolean).length;
    const percentage = Math.round((totalValid / 7) * 100);
    
    progressBarFill.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage}%`;
  };

  // Master handler for evaluating any specific field validation
  const evaluateField = (fieldName) => {
    switch (fieldName) {
      case 'name':
        validateName();
        break;
      case 'email':
        validateEmail();
        break;
      case 'phone':
        validatePhone();
        break;
      case 'specialization':
        validateSpecialization();
        break;
      case 'password':
        evaluatePasswordStrength();
        // Dynamic re-run of confirm validation if password field modifications occur
        if (touchedFields.confirmPassword) {
          validateConfirmPassword();
        }
        break;
      case 'confirmPassword':
        validateConfirmPassword();
        break;
      case 'terms':
        validateTerms();
        break;
    }
    updateFormProgress();
  };

  // ==========================================================================
  // EVENT LISTENERS BINDINGS
  // ==========================================================================
  
  // List of fields to hook interactive events
  const fieldConfigs = [
    { element: fullnameInput, name: 'name' },
    { element: emailInput, name: 'email' },
    { element: phoneInput, name: 'phone' },
    { element: specializationSelect, name: 'specialization' },
    { element: passwordInput, name: 'password' },
    { element: confirmPasswordInput, name: 'confirmPassword' },
    { element: termsCheckbox, name: 'terms' }
  ];

  fieldConfigs.forEach(cfg => {
    // 1. BLUR EVENT: Mark field as touched and run full validation
    cfg.element.addEventListener('blur', () => {
      touchedFields[cfg.name] = true;
      evaluateField(cfg.name);
    });

    // 2. INPUT EVENT: Perform real-time changes only if field has been marked as touched
    cfg.element.addEventListener('input', () => {
      if (cfg.name === 'password') {
        // Special case: Always show password rule checklists on input focus/interaction
        evaluateField('password');
      } else if (touchedFields[cfg.name]) {
        evaluateField(cfg.name);
      } else {
        // Silent update on progress bar statistics
        updateFormProgress();
      }
    });
  });

  // Explicit dropdown change helper mapping
  specializationSelect.addEventListener('change', () => {
    touchedFields.specialization = true;
    evaluateField('specialization');
  });

  // Explicit checkbox click handler mapping
  termsCheckbox.addEventListener('change', () => {
    touchedFields.terms = true;
    evaluateField('terms');
  });

  // ==========================================================================
  // SUBMIT HANDLER & MOCK PROTOCOL INITIALIZATION
  // ==========================================================================
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Force set all fields to touched to enable error highlights
    Object.keys(touchedFields).forEach(key => {
      touchedFields[key] = true;
    });
    
    // Execute all validation methods
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isSpecValid = validateSpecialization();
    const isPassValid = evaluatePasswordStrength().isValid;
    const isConfirmValid = validateConfirmPassword();
    const isTermsValid = validateTerms();
    
    updateFormProgress();
    
    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isSpecValid && isPassValid && isConfirmValid && isTermsValid;
    
    if (!isFormValid) {
      // Find the first field with errors and focus it
      const invalidWrapper = document.querySelector('.input-wrapper.has-error');
      if (invalidWrapper) {
        const inputToFocus = invalidWrapper.querySelector('input, select');
        if (inputToFocus) {
          inputToFocus.focus();
        }
      }
      return;
    }
    
    // Trigger button submission loading animation states
    submitBtn.classList.add('loading');
    
    // Simulate secure transmission delay to remote servers
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      
      // Map user variables to success dashboard screen labels
      summaryName.textContent = fullnameInput.value.trim();
      summaryEmail.textContent = emailInput.value.trim();
      
      // Parse friendly role text
      const selectedOptionText = specializationSelect.options[specializationSelect.selectedIndex].text;
      summaryRole.textContent = selectedOptionText;
      
      // Open success modal
      successModal.classList.add('active');
    }, 1500);
  });

  // ==========================================================================
  // MODAL ACTION WORKFLOW (RESET APPLICATION STATE)
  // ==========================================================================
  modalCloseBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    
    // Fully reset form values
    form.reset();
    
    // Reset internal validation statuses
    Object.keys(touchedFields).forEach(key => {
      touchedFields[key] = false;
    });
    
    // Clear validation styling classes across inputs
    const wrappers = document.querySelectorAll('.input-wrapper');
    wrappers.forEach(w => {
      w.classList.remove('has-error', 'is-valid');
      const err = w.querySelector('.error-msg');
      if (err) err.textContent = '';
    });
    
    // Collapse password checklist components
    strengthContainer.style.display = 'none';
    strengthContainer.setAttribute('data-strength', '0');
    strengthRating.textContent = 'Empty';
    Object.values(ruleItems).forEach(item => item.classList.remove('valid'));
    
    // Reset password field types back to hidden by default
    passwordInput.type = 'password';
    confirmPasswordInput.type = 'password';
    passwordToggles.forEach(toggle => {
      toggle.setAttribute('aria-label', 'Show password');
      const eyeShow = toggle.querySelector('.eye-show');
      const eyeHide = toggle.querySelector('.eye-hide');
      if (eyeShow) eyeShow.style.display = 'block';
      if (eyeHide) eyeHide.style.display = 'none';
    });
    
    // Re-initialize progress bar values
    progressBarFill.style.width = '0%';
    progressPercentage.textContent = '0%';
  });
});
