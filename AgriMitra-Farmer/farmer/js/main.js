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
  // Master Indian States and Districts Data (Shared across Portal)
  // =========================================================================
  const stateDistricts = {
    'Andaman and Nicobar Islands': ['Nicobar', 'North and Middle Andaman', 'South Andaman'],
    'Andhra Pradesh': ['Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla', 'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
    'Arunachal Pradesh': ['Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Itanagar Capital Complex', 'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang'],
    'Assam': ['Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tamulpur', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'],
    'Bihar': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran (Motihari)', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur (Bhabua)', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran (Bettiah)'],
    'Chandigarh': ['Chandigarh'],
    'Chhattisgarh': ['Balod', 'Baloda Bazar-Bhatapara', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Khairagarh-Chhuikhadan-Gandai', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sakti', 'Sarangarh-Bilaigarh', 'Sukma', 'Surajpur', 'Surguja'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Dadra and Nagar Haveli', 'Daman', 'Diu'],
    'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
    'Goa': ['North Goa', 'South Goa'],
    'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhumi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'],
    'Haryana': ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'],
    'Himachal Pradesh': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'],
    'Jammu and Kashmir': ['Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'],
    'Jharkhand': ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahebganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'],
    'Karnataka': ['Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagara', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Vijayapura', 'Yadgir'],
    'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
    'Ladakh': ['Kargil', 'Leh'],
    'Lakshadweep': ['Lakshadweep'],
    'Madhya Pradesh': ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad (Narmadapuram)', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Maihar', 'Mandla', 'Mandsaur', 'Mauganj', 'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Pandhurna', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'],
    'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Dharashiv', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
    'Manipur': ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'],
    'Meghalaya': ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'],
    'Mizoram': ['Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saitual', 'Serchhip', 'Siaha'],
    'Nagaland': ['Chümoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu', 'Tuensang', 'Wokha', 'Zunheboto'],
    'Odisha': ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'],
    'Puducherry': ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'],
    'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar (Mohali)', 'Sangrur', 'Shahid Bhagat Singh Nagar', 'Tarn Taran'],
    'Rajasthan': ['Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Deeg', 'Dholpur', 'Didwana-Kuchaman', 'Dudu', 'Dungarpur', 'Gangapur City', 'Hanumangarh', 'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Jodhpur Rural', 'Karauli', 'Kekri', 'Khairthal-Tijara', 'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'],
    'Sikkim': ['Gangtok', 'Gyalshing', 'Mangan', 'Namchi', 'Pakyong', 'Soreng'],
    'Tamil Nadu': ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'],
    'Telangana': ['Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'],
    'Tripura': ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'],
    'Uttar Pradesh': ['Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
    'Uttarakhand': ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
    'West Bengal': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur']
  };

  // =========================================================================
  // 1. Farmer Registration Logic
  // =========================================================================
  function initRegisterPage() {
    const registerForms = document.querySelectorAll('.farmer-registration-form');
    if (!registerForms || registerForms.length === 0) return;

    registerForms.forEach((regForm) => {
      const nameInput = regForm.querySelector('.reg-name');
      const phoneInput = regForm.querySelector('.reg-phone');
      const phoneGroup = regForm.querySelector('.reg-phone-group');
      const phoneCounter = regForm.parentElement.querySelector('#reg-phone-counter, #spa-reg-phone-counter') || regForm.querySelector('.phone-digits-badge');
      const stateSelect = regForm.querySelector('.reg-state');
      const districtInput = regForm.querySelector('#reg-district-select, #reg-district-input, .reg-district') || regForm.querySelector('select[name="district"]');
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

      // 3. Dynamic State-to-District Suggestions & Popular Quick Pills
      if (stateSelect && districtInput) {
        const quickContainer = regForm.querySelector('#district-quick-suggestions') || regForm.parentElement.querySelector('#district-quick-suggestions');

        function updateDistrictSuggestions(stateName, keepExistingVal) {
          const districts = stateDistricts[stateName] || [];
          const isSelectTag = districtInput.tagName === 'SELECT';

          if (isSelectTag) {
            districtInput.innerHTML = '';

            if (districts.length > 0) {
              const defaultOpt = document.createElement('option');
              defaultOpt.value = '';
              defaultOpt.disabled = true;
              defaultOpt.selected = true;
              defaultOpt.textContent = '-- Select District --';
              districtInput.appendChild(defaultOpt);

              districts.forEach((d) => {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = d;
                districtInput.appendChild(opt);
              });

              districtInput.disabled = false;
              if (keepExistingVal && districts.includes(keepExistingVal)) {
                districtInput.value = keepExistingVal;
              } else {
                districtInput.value = '';
              }
            } else {
              const defaultOpt = document.createElement('option');
              defaultOpt.value = '';
              defaultOpt.disabled = true;
              defaultOpt.selected = true;
              defaultOpt.textContent = '-- Select State first --';
              districtInput.appendChild(defaultOpt);
              districtInput.disabled = true;
              districtInput.value = '';
            }
          } else {
            // Fallback for text/datalist input if present
            const listId = districtInput.getAttribute('list') || 'district-options';
            let datalist = document.getElementById(listId);
            if (!datalist) {
              datalist = document.createElement('datalist');
              datalist.id = listId;
              districtInput.setAttribute('list', listId);
              regForm.appendChild(datalist);
            }
            datalist.innerHTML = '';

            districts.forEach((d) => {
              const opt = document.createElement('option');
              opt.value = d;
              datalist.appendChild(opt);
            });

            if (!keepExistingVal && districtInput.value && !districts.includes(districtInput.value)) {
              districtInput.value = '';
            }

            if (districts.length > 0) {
              districtInput.placeholder = `e.g. ${districts[0]}`;
              districtInput.disabled = false;
            } else {
              districtInput.placeholder = 'Choose state to view districts';
              districtInput.disabled = true;
            }
          }

          // Populate quick suggestion pills for top agricultural trade hubs
          if (quickContainer) {
            quickContainer.innerHTML = '';
            if (districts.length > 0) {
              quickContainer.style.display = 'flex';

              const labelSpan = document.createElement('span');
              labelSpan.className = 'quick-pills-label';
              labelSpan.textContent = 'Popular:';
              quickContainer.appendChild(labelSpan);

              const topDistricts = districts.slice(0, 6);
              topDistricts.forEach((d) => {
                const pill = document.createElement('button');
                pill.type = 'button';
                pill.className = 'district-pill-btn' + (districtInput.value === d ? ' active' : '');
                pill.textContent = d;
                pill.title = `Select ${d}`;
                pill.addEventListener('click', (e) => {
                  e.preventDefault();
                  districtInput.value = d;
                  districtInput.dispatchEvent(new Event('change'));
                  quickContainer.querySelectorAll('.district-pill-btn').forEach(p => p.classList.remove('active'));
                  pill.classList.add('active');
                  districtInput.focus();
                  if (errorAlert) errorAlert.style.display = 'none';
                });
                quickContainer.appendChild(pill);
              });
            } else {
              quickContainer.style.display = 'none';
            }
          }
        }

        stateSelect.addEventListener('change', () => {
          updateDistrictSuggestions(stateSelect.value, false);
        });

        districtInput.addEventListener('change', () => {
          if (quickContainer) {
            const currentVal = districtInput.value.trim().toLowerCase();
            quickContainer.querySelectorAll('.district-pill-btn').forEach((p) => {
              if (p.textContent.toLowerCase() === currentVal) {
                p.classList.add('active');
              } else {
                p.classList.remove('active');
              }
            });
          }
        });

        districtInput.addEventListener('input', () => {
          if (quickContainer) {
            const currentVal = districtInput.value.trim().toLowerCase();
            quickContainer.querySelectorAll('.district-pill-btn').forEach((p) => {
              if (p.textContent.toLowerCase() === currentVal) {
                p.classList.add('active');
              } else {
                p.classList.remove('active');
              }
            });
          }
        });

        // Initialize state & district options
        if (stateSelect.value) {
          updateDistrictSuggestions(stateSelect.value, true);
        } else {
          updateDistrictSuggestions('', false);
        }
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
        const cropInput = regForm.querySelector('#reg-crop-input, .reg-crop');
        const cropVal = cropInput ? cropInput.value.trim() : 'Paddy';

        const payload = {
          role: 'farmer',
          full_name: nameVal,
          phone: phoneCheck.cleanedPhone || phoneVal,
          state: stateSelect ? stateSelect.value : '',
          district: districtVal,
          password: pwdVal,
          primary_crops: cropVal
        };

        if (errorAlert) errorAlert.style.display = 'none';
        if (successAlert) successAlert.style.display = 'block';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="btn-spinner" style="display:inline-block"></span> <span>Registering & Redirecting...</span>';
        }

        fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        })
        .then(async res => {
          const data = await res.json();
          if (res.ok && data.success) {
            if (data.user) {
              localStorage.setItem('agrimitra_user', JSON.stringify(data.user));
              localStorage.setItem('agriFarmerName', data.user.full_name);
              localStorage.setItem('agriFarmerPhone', data.user.phone);
            }
            if (window.AgriMitraAuth) {
              window.AgriMitraAuth.showToast('Farmer account registered successfully! Redirecting...', 'success', 2500);
            }
            setTimeout(() => {
              window.location.href = data.redirect_url || 'dashboard.html';
            }, 600);
          } else {
            showFormError(data.message || 'Registration failed. Mobile number may already exist.', phoneInput);
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Register as a Farmer</span>';
            }
          }
        })
        .catch(err => {
          console.warn('[Farmer Reg] Offline fallback:', err);
          window.location.href = 'dashboard.html';
        });
      }

      regForm.addEventListener('submit', handleFarmerRegistrationSubmit);
    });
  }

  // =========================================================================
  // 3. Simple & Interactive Farmer Dashboard Logic
  // =========================================================================
  function initDashboardPage() {
    if (window.AgriMitraAuth) {
      window.AgriMitraAuth.guardRole('farmer', { strict: false });
    }

    // -----------------------------------------------------------------------
    // Profile Management & Profile Edit Modal
    // -----------------------------------------------------------------------
    const defaultProfile = {
      full_name: 'Ramesh Patel',
      phone: '9876543210',
      state: 'Tamil Nadu',
      district: 'Krishnagiri',
      primary_crops: 'Paddy, Fresh Tomatoes',
      location: 'Krishnagiri, Tamil Nadu',
      upi_id: 'ramesh.kisan@oksbi'
    };

    let farmerProfile = { ...defaultProfile };
    try {
      const savedProfile = localStorage.getItem('agriFarmerProfile');
      if (savedProfile) {
        farmerProfile = { ...defaultProfile, ...JSON.parse(savedProfile) };
      } else {
        const storedName = localStorage.getItem('agriFarmerName');
        const storedPhone = localStorage.getItem('agriFarmerPhone');
        if (storedName) farmerProfile.full_name = storedName;
        if (storedPhone) farmerProfile.phone = storedPhone;
      }
    } catch(err) {
      console.warn('[AgriMitra] Profile load error:', err);
    }

    function syncProfileUI() {
      const userNameEl = document.querySelector('.user-name');
      const userAvatarEl = document.querySelector('.user-avatar');
      const userLocationEl = document.querySelector('.user-location');
      const bannerHeading = document.querySelector('.farmer-banner-text h1');
      const cropLocationInput = document.getElementById('crop-location');

      if (userNameEl) userNameEl.textContent = farmerProfile.full_name;
      if (userLocationEl) {
        userLocationEl.textContent = farmerProfile.location || `${farmerProfile.district}, ${farmerProfile.state}`;
      }
      if (bannerHeading) {
        const firstName = (farmerProfile.full_name || 'Kisan').split(' ')[0];
        bannerHeading.textContent = `Namaste, ${firstName} Ji`;
      }
      if (userAvatarEl) {
        const initials = (farmerProfile.full_name || 'RP')
          .split(' ')
          .map(n => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();
        userAvatarEl.textContent = initials || 'RP';
        userAvatarEl.title = farmerProfile.full_name;
      }
      if (cropLocationInput && !cropLocationInput.value) {
        cropLocationInput.value = `${farmerProfile.district} APMC Warehouse`;
      }
      const payoutBeneficiary = document.getElementById('payouts-beneficiary-name');
      const payoutUpi = document.getElementById('payouts-upi-val');
      const hubPayoutsAccountText = document.getElementById('hub-payouts-account-text');
      if (payoutBeneficiary) payoutBeneficiary.textContent = farmerProfile.full_name;
      if (payoutUpi) payoutUpi.textContent = farmerProfile.upi_id || 'ramesh.kisan@oksbi';
      if (hubPayoutsAccountText && farmerProfile.upi_id) {
        hubPayoutsAccountText.innerHTML = `Linked: SBI &bull;&bull;&bull;&bull; 4291 (${farmerProfile.upi_id}) &bull; Tap to view ledger &rarr;`;
      }
    }

    syncProfileUI();

    // Profile Edit Modal Elements
    const profileModal = document.getElementById('profile-modal');
    const openProfileBtns = document.querySelectorAll('#open-profile-modal-btn, #user-profile-pill');
    const closeProfileModalBtn = document.getElementById('close-profile-modal-btn');
    const cancelProfileModalBtn = document.getElementById('cancel-profile-modal-btn');
    const editProfileForm = document.getElementById('edit-profile-form');

    const profileNameInput = document.getElementById('profile-name-input');
    const profilePhoneInput = document.getElementById('profile-phone-input');
    const profileStateSelect = document.getElementById('profile-state-select');
    const profileDistrictSelect = document.getElementById('profile-district-select');
    const profileCropsInput = document.getElementById('profile-crops-input');
    const profileLocationInput = document.getElementById('profile-location-input');
    const profileUpiInput = document.getElementById('profile-upi-input');

    function populateProfileStates() {
      if (!profileStateSelect || profileStateSelect.options.length > 1) return;
      const states = Object.keys(stateDistricts).sort();
      states.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st;
        opt.textContent = st;
        profileStateSelect.appendChild(opt);
      });
    }

    function populateProfileDistricts(selectedState, selectedDistrict = '') {
      if (!profileDistrictSelect) return;
      profileDistrictSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
      const districts = stateDistricts[selectedState] || [];
      districts.forEach(dist => {
        const opt = document.createElement('option');
        opt.value = dist;
        opt.textContent = dist;
        if (dist === selectedDistrict) {
          opt.selected = true;
        }
        profileDistrictSelect.appendChild(opt);
      });
    }

    if (profileStateSelect) {
      profileStateSelect.addEventListener('change', () => {
        populateProfileDistricts(profileStateSelect.value);
      });
    }

    function openProfileModal() {
      if (!profileModal) return;
      populateProfileStates();

      if (profileNameInput) profileNameInput.value = farmerProfile.full_name || '';
      if (profilePhoneInput) profilePhoneInput.value = farmerProfile.phone || '';
      if (profileStateSelect) {
        profileStateSelect.value = farmerProfile.state || 'Tamil Nadu';
        populateProfileDistricts(farmerProfile.state || 'Tamil Nadu', farmerProfile.district || 'Krishnagiri');
      }
      if (profileCropsInput) profileCropsInput.value = farmerProfile.primary_crops || '';
      if (profileLocationInput) profileLocationInput.value = farmerProfile.location || `${farmerProfile.district}, ${farmerProfile.state}`;
      if (profileUpiInput) profileUpiInput.value = farmerProfile.upi_id || '';

      profileModal.classList.add('active');
      if (profileNameInput) profileNameInput.focus();
    }

    function closeProfileModal() {
      if (profileModal) profileModal.classList.remove('active');
    }

    openProfileBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProfileModal();
      });
    });

    if (closeProfileModalBtn) closeProfileModalBtn.addEventListener('click', closeProfileModal);
    if (cancelProfileModalBtn) cancelProfileModalBtn.addEventListener('click', closeProfileModal);
    if (profileModal) {
      profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) closeProfileModal();
      });
    }

    if (editProfileForm) {
      editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedName = profileNameInput ? profileNameInput.value.trim() : '';
        const updatedPhone = profilePhoneInput ? profilePhoneInput.value.trim() : '';
        const updatedState = profileStateSelect ? profileStateSelect.value : '';
        const updatedDistrict = profileDistrictSelect ? profileDistrictSelect.value : '';
        const updatedCrops = profileCropsInput ? profileCropsInput.value.trim() : '';
        const updatedLocation = profileLocationInput ? profileLocationInput.value.trim() : '';
        const updatedUpi = profileUpiInput ? profileUpiInput.value.trim() : '';

        if (!updatedName) {
          showToast('Please enter your full name.');
          return;
        }

        farmerProfile = {
          full_name: updatedName,
          phone: updatedPhone || farmerProfile.phone,
          state: updatedState || farmerProfile.state,
          district: updatedDistrict || farmerProfile.district,
          primary_crops: updatedCrops,
          location: updatedLocation || `${updatedDistrict}, ${updatedState}`,
          upi_id: updatedUpi
        };

        try {
          localStorage.setItem('agriFarmerProfile', JSON.stringify(farmerProfile));
          localStorage.setItem('agriFarmerName', farmerProfile.full_name);
          localStorage.setItem('agriFarmerPhone', farmerProfile.phone);

          const storedUser = localStorage.getItem('agrimitra_user');
          if (storedUser) {
            const userObj = JSON.parse(storedUser);
            userObj.full_name = farmerProfile.full_name;
            userObj.phone = farmerProfile.phone;
            userObj.state = farmerProfile.state;
            userObj.district = farmerProfile.district;
            localStorage.setItem('agrimitra_user', JSON.stringify(userObj));
          }
        } catch(err) {
          console.warn('[AgriMitra] Profile save notice:', err);
        }

        syncProfileUI();
        closeProfileModal();
        showToast('Farmer profile updated successfully! ✅');
      });
    }

    // -----------------------------------------------------------------------
    // Interactive Notification Bell & Dropdown Logic
    // -----------------------------------------------------------------------
    const defaultNotifications = [
      {
        id: 'notif-1',
        type: 'bid',
        title: 'New Buyer Bid Received',
        desc: 'Lakshmi Agro placed a bid of ₹2,850/Qtl for your 40 Quintal Sona Masoori Paddy.',
        time: '10m ago',
        unread: true,
        tagText: 'Buyer Bid',
        tagClass: 'notif-tag-bid',
        iconClass: 'notif-icon-bid',
        icon: '💰',
        actionText: 'Review Bid',
        actionTarget: '#buyer-bids-section'
      },
      {
        id: 'notif-2',
        type: 'delivery',
        title: 'Order Out for Delivery',
        desc: 'Pickup vehicle KA-05-AB-3211 is out for delivery with 50 Crates Tomatoes.',
        time: '35m ago',
        unread: true,
        tagText: 'Out for Delivery',
        tagClass: 'notif-tag-delivery',
        iconClass: 'notif-icon-delivery',
        icon: '🚚',
        actionText: 'Track Pickup',
        actionTarget: '#hub-payouts-val'
      },
      {
        id: 'notif-3',
        type: 'delivery',
        title: 'Order Reached Destination',
        desc: 'Batch #WHT-9012 (60 Quintals Wheat) safely reached Bengaluru Central APMC Mandi. Quality Grade A+ approved.',
        time: '2h ago',
        unread: true,
        tagText: 'Order Reached',
        tagClass: 'notif-tag-reached',
        iconClass: 'notif-icon-reached',
        icon: '📦',
        actionText: 'View Payout',
        actionTarget: '#hub-payouts-val'
      },
      {
        id: 'notif-4',
        type: 'feedback',
        title: 'Buyer Feedback (5.0 ★)',
        desc: 'Trader Rajesh Gupta left feedback: "Crisp drumsticks, accurate weighing and prompt dispatch. Recommended!"',
        time: 'Yesterday',
        unread: true,
        tagText: 'Buyer Review',
        tagClass: 'notif-tag-feedback',
        iconClass: 'notif-icon-feedback',
        icon: '⭐',
        actionText: 'Read Feedback',
        actionTarget: '#hub-listings-val'
      },
      {
        id: 'notif-5',
        type: 'system',
        title: 'System AI Recommendation',
        desc: 'Mandi Price Surge Alert: Fresh Tomato rates in Krishnagiri APMC up +14% today. Ideal window to list produce.',
        time: '1d ago',
        unread: true,
        tagText: 'AI Tip',
        tagClass: 'notif-tag-system',
        iconClass: 'notif-icon-system',
        icon: '💡',
        actionText: 'Sell Crop Now',
        actionTarget: 'modal'
      },
      {
        id: 'notif-6',
        type: 'bid',
        title: 'Buyer Outbid Update',
        desc: 'Metro Fresh Foods raised bid to ₹3,120/Qtl for Lot #FM-98421 Onion harvest.',
        time: '2d ago',
        unread: false,
        tagText: 'Bid Update',
        tagClass: 'notif-tag-bid',
        iconClass: 'notif-icon-bid',
        icon: '📈',
        actionText: 'View Bids',
        actionTarget: '#buyer-bids-section'
      }
    ];

    let notifications = [...defaultNotifications];
    try {
      const storedNotifs = localStorage.getItem('agriFarmerNotifications');
      if (storedNotifs) {
        notifications = JSON.parse(storedNotifs);
      }
    } catch(err) {
      console.warn('[AgriMitra] Notif load notice:', err);
    }

    function saveNotifications() {
      try {
        localStorage.setItem('agriFarmerNotifications', JSON.stringify(notifications));
      } catch(err) {}
    }

    const notifWrapper = document.getElementById('notif-wrapper');
    const notifBellBtn = document.getElementById('notif-bell-btn');
    const notifBadge = document.getElementById('notif-badge');
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifUnreadCount = document.getElementById('notif-unread-count');
    const notifMarkReadBtn = document.getElementById('notif-mark-read-btn');
    const notifItemsList = document.getElementById('notif-items-list');
    const notifTabs = document.querySelectorAll('.notif-tab');

    let currentNotifFilter = 'all';

    function renderNotifications(filter = currentNotifFilter) {
      currentNotifFilter = filter;
      if (!notifItemsList) return;

      const unreadTotal = notifications.filter(n => n.unread).length;
      if (notifBadge) {
        notifBadge.textContent = unreadTotal;
        if (unreadTotal > 0) {
          notifBadge.classList.remove('hidden');
          notifBadge.style.display = 'flex';
        } else {
          notifBadge.classList.add('hidden');
          notifBadge.style.display = 'none';
        }
      }
      if (notifUnreadCount) {
        notifUnreadCount.textContent = `${unreadTotal} new`;
      }

      const filtered = notifications.filter(n => {
        if (filter === 'all') return true;
        return n.type === filter;
      });

      if (filtered.length === 0) {
        notifItemsList.innerHTML = `
          <div class="notif-empty-state">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📭</div>
            <div>No notifications in this category.</div>
          </div>
        `;
        return;
      }

      notifItemsList.innerHTML = filtered.map(item => `
        <div class="notif-item ${item.unread ? 'unread' : ''}" data-id="${item.id}" role="listitem">
          <div class="notif-icon-box ${item.iconClass || 'notif-icon-bid'}">
            ${item.icon || '🔔'}
          </div>
          <div class="notif-content-wrap">
            <div class="notif-item-header">
              <span class="notif-item-title">${item.title}</span>
              ${item.unread ? '<span class="notif-dot" title="Unread"></span>' : ''}
            </div>
            <div class="notif-item-desc">${item.desc}</div>
            <div class="notif-item-meta">
              <span>${item.time} &bull; <span class="notif-item-tag ${item.tagClass || ''}">${item.tagText || item.type}</span></span>
              <a href="${item.actionTarget === 'modal' ? 'javascript:void(0)' : item.actionTarget}" class="notif-item-action" data-action="${item.actionTarget}">
                ${item.actionText} &rarr;
              </a>
            </div>
          </div>
        </div>
      `).join('');
    }

    renderNotifications();

    if (notifBellBtn && notifDropdown) {
      notifBellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notifDropdown.classList.contains('active');
        if (isOpen) {
          notifDropdown.classList.remove('active');
          notifBellBtn.setAttribute('aria-expanded', 'false');
          notifBellBtn.classList.remove('active');
        } else {
          notifDropdown.classList.add('active');
          notifBellBtn.setAttribute('aria-expanded', 'true');
          notifBellBtn.classList.add('active');
        }
      });
    }

    // Close notification dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (notifWrapper && !notifWrapper.contains(e.target)) {
        if (notifDropdown) notifDropdown.classList.remove('active');
        if (notifBellBtn) {
          notifBellBtn.setAttribute('aria-expanded', 'false');
          notifBellBtn.classList.remove('active');
        }
      }
    });

    // Mark all as read
    if (notifMarkReadBtn) {
      notifMarkReadBtn.addEventListener('click', () => {
        notifications.forEach(n => n.unread = false);
        saveNotifications();
        renderNotifications();
        showToast('All notifications marked as read! ✔️');
      });
    }

    // Filter tabs click
    notifTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        notifTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter') || 'all';
        renderNotifications(filter);
      });
    });

    // Item click: mark individual as read & handle action
    if (notifItemsList) {
      notifItemsList.addEventListener('click', (e) => {
        const itemEl = e.target.closest('.notif-item');
        if (!itemEl) return;
        const notifId = itemEl.getAttribute('data-id');
        const targetNotif = notifications.find(n => n.id === notifId);
        if (targetNotif && targetNotif.unread) {
          targetNotif.unread = false;
          saveNotifications();
          renderNotifications();
        }

        const actionLink = e.target.closest('.notif-item-action');
        if (actionLink) {
          const action = actionLink.getAttribute('data-action');
          if (action === 'modal') {
            e.preventDefault();
            if (produceModal) produceModal.classList.add('active');
            if (notifDropdown) notifDropdown.classList.remove('active');
          } else if (action && action.startsWith('#')) {
            const sec = document.querySelector(action);
            if (sec) {
              e.preventDefault();
              sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
              sec.style.transition = 'box-shadow 0.3s ease';
              sec.style.boxShadow = '0 0 0 3px #22c55e';
              setTimeout(() => { sec.style.boxShadow = ''; }, 1800);
              if (notifDropdown) notifDropdown.classList.remove('active');
            }
          }
        }
      });
    }

    // Sign out button
    const signOutBtns = document.querySelectorAll('#sign-out-btn, .btn-signout');
    signOutBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.AgriMitraAuth) {
          window.AgriMitraAuth.logout('../../index.html');
        } else {
          window.location.href = '../../index.html';
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

        // Persist to backend database API
        fetch('/api/farmer/produce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            crop_name: cropName,
            variety: cropVariety,
            quantity: parseFloat(cropQty) || 50.0,
            unit: cropUnit,
            expected_price: parseFloat(cropPrice) || 2500.0,
            location: cropLocation
          })
        }).then(res => res.json()).then(data => {
          if (data && data.success) {
            console.log('[KrishiLink] Produce saved to database record:', data.produce);
          }
        }).catch(err => {
          console.warn('[KrishiLink] Backend call notice:', err);
        });

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
                <button type="button" class="btn-sm-action btn-sm-primary view-crop-bids-btn" data-crop="${cropName} (${cropVariety})" data-qty="${cropQty} ${cropUnit}" data-price="${cropPrice}" data-location="${cropLocation}">View Bids</button>
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

    // -----------------------------------------------------------------------
    // Interactive Crop Bids Modal Logic
    // -----------------------------------------------------------------------
    const cropBidsModal = document.getElementById('crop-bids-modal');
    const closeCropBidsModalBtn = document.getElementById('close-crop-bids-modal-btn');
    const closeCropBidsBtn = document.getElementById('close-crop-bids-btn');
    const scrollToBidsPanelBtn = document.getElementById('scroll-to-bids-panel-btn');
    const cropBidsProduceSummary = document.getElementById('crop-bids-produce-summary');
    const cropBidsModalList = document.getElementById('crop-bids-modal-list');
    const cropBidsModalCropName = document.getElementById('modal-crop-bids-title');

    function getBidsForCrop(cropName, expectedPrice = 2500, qty = '50 Qtl', location = 'Krishnagiri APMC Warehouse') {
      const lower = (cropName || '').toLowerCase();
      const numPrice = parseFloat(String(expectedPrice).replace(/[^0-9.]/g, '')) || 2500;

      if (lower.includes('paddy') || lower.includes('rice')) {
        return [
          {
            buyer: 'Cauvery Valley Farmers Producer Co. (FPO)',
            badge: 'Verified FPO Buyer • Tamil Nadu',
            rate: '₹ 2,680 / Qtl',
            rateHighlight: '+₹30 above expected rate',
            qty: '60 Quintals',
            total: '₹ 1,60,800',
            pickup: 'Krishnagiri Warehouse • Immediate RTGS on vehicle pickup',
            phone: '09845122334'
          },
          {
            buyer: 'Lakshmi Agro Millers & Traders',
            badge: 'Verified APMC Mandi Processor',
            rate: '₹ 2,850 / Qtl',
            rateHighlight: '+₹200 premium lot bid',
            qty: '40 Quintals',
            total: '₹ 1,14,000',
            pickup: 'Krishnagiri Mandi Hub • Direct Bank Transfer',
            phone: '09876543210'
          },
          {
            buyer: 'Sri Murugan Modern Rice Mill',
            badge: 'Direct Grain Merchant',
            rate: '₹ 2,650 / Qtl',
            rateHighlight: '100% target match',
            qty: 'Full Lot (120 Quintals)',
            total: '₹ 3,18,000',
            pickup: 'Farm Gate or Warehouse • Same day NEFT',
            phone: '09443211098'
          }
        ];
      } else if (lower.includes('tomato')) {
        return [
          {
            buyer: 'AgroFresh Wholesale Distributors',
            badge: 'Verified APMC Commission Agent',
            rate: '₹ 700 / Crate',
            rateHighlight: '+₹20 above expected',
            qty: '30 Crates',
            total: '₹ 21,000',
            pickup: 'Farm Gate (Buyer vehicle arranged) • Same day UPI / NEFT',
            phone: '09443211098'
          },
          {
            buyer: 'Reliance Fresh Direct Sourcing',
            badge: 'Verified Corporate Buyer',
            rate: '₹ 720 / Crate',
            rateHighlight: '+₹40 premium quality',
            qty: '50 Crates',
            total: '₹ 36,000',
            pickup: 'Direct Farm Pickup • Instant UPI Payout',
            phone: '09845122334'
          }
        ];
      } else if (lower.includes('moringa') || lower.includes('drumstick')) {
        return [
          {
            buyer: 'Salem Spice & Agro Exports Ltd.',
            badge: 'Verified Exporter • Salem',
            rate: '₹ 3,550 / Qtl',
            rateHighlight: '+₹150 export premium',
            qty: '20 Quintals',
            total: '₹ 71,000',
            pickup: 'Cold Storage Krishnagiri • Advance 30% + Balance on dispatch',
            phone: '09887766554'
          },
          {
            buyer: 'Coimbatore Wholesale Veg Mart',
            badge: 'APMC Authorized Wholesaler',
            rate: '₹ 3,400 / Qtl',
            rateHighlight: '100% price match',
            qty: '15 Quintals',
            total: '₹ 51,000',
            pickup: 'Mandi Gate Delivery • Instant UPI',
            phone: '09445566778'
          }
        ];
      } else {
        const rate1 = Math.round(numPrice * 1.04);
        const rate2 = Math.round(numPrice * 1.08);
        return [
          {
            buyer: 'Regional Kisan Agro Federation (FPO)',
            badge: 'Verified Institutional Buyer',
            rate: `₹ ${rate2.toLocaleString('en-IN')} / Unit`,
            rateHighlight: `+₹${rate2 - numPrice} top offer`,
            qty: qty || 'Standard Lot',
            total: `₹ ${(rate2 * 25).toLocaleString('en-IN')}`,
            pickup: `${location || 'Mandi Hub'} • Direct Bank Settlement (DBT)`,
            phone: '09845122334'
          },
          {
            buyer: 'National Mandi Trading Syndicate',
            badge: 'APMC Certified Buyer',
            rate: `₹ ${rate1.toLocaleString('en-IN')} / Unit`,
            rateHighlight: `+₹${rate1 - numPrice} above base`,
            qty: qty || 'Standard Lot',
            total: `₹ ${(rate1 * 25).toLocaleString('en-IN')}`,
            pickup: `${location || 'Mandi Hub'} • Verified RTGS on weighing`,
            phone: '09443211098'
          }
        ];
      }
    }

    function openCropBidsModal(cropName, qty, price, location) {
      if (!cropBidsModal) return;

      if (cropBidsModalCropName) {
        cropBidsModalCropName.textContent = `Buyer Bids: ${cropName}`;
      }

      if (cropBidsProduceSummary) {
        cropBidsProduceSummary.innerHTML = `
          <div>
            <div class="crop-bids-produce-title">${cropName}</div>
            <div class="crop-bids-produce-meta">📦 Lot Size: ${qty || 'Standard Lot'} &bull; Base Rate: &#8377;${price || 'Market Rate'} &bull; 📍 ${location || 'Krishnagiri Warehouse'}</div>
          </div>
          <span class="hub-badge badge-urgent" style="font-size: 0.75rem;">Active Bidding</span>
        `;
      }

      const bids = getBidsForCrop(cropName, price, qty, location);
      if (cropBidsModalList) {
        cropBidsModalList.innerHTML = bids.map((bid, idx) => `
          <div class="crop-bid-card" data-bid-idx="${idx}">
            <div class="crop-bid-top">
              <div>
                <div class="crop-bid-buyer-name">${bid.buyer}</div>
                <span class="crop-bid-badge">&#9989; ${bid.badge}</span>
              </div>
              <div>
                <div class="crop-bid-rate-val">${bid.rate}</div>
                <div class="crop-bid-total-payout">${bid.rateHighlight}</div>
              </div>
            </div>
            <div class="crop-bid-details">
              <strong>Order Quantity:</strong> ${bid.qty} &bull; <strong>Total Payout:</strong> ${bid.total}<br>
              <strong>Pickup / Terms:</strong> ${bid.pickup}
            </div>
            <div class="crop-bid-actions">
              <button type="button" class="btn-accept-offer modal-accept-bid-btn" data-buyer="${bid.buyer}">
                <span>&#10003;</span>
                <span>Accept Offer</span>
              </button>
              <a href="tel:${bid.phone}" class="btn-call-buyer">
                <span>&#128222;</span>
                <span>Call Buyer</span>
              </a>
            </div>
          </div>
        `).join('');
      }

      cropBidsModal.classList.add('active');
    }

    function closeCropBidsModal() {
      if (cropBidsModal) cropBidsModal.classList.remove('active');
    }

    if (closeCropBidsModalBtn) closeCropBidsModalBtn.addEventListener('click', closeCropBidsModal);
    if (closeCropBidsBtn) closeCropBidsBtn.addEventListener('click', closeCropBidsModal);
    if (cropBidsModal) {
      cropBidsModal.addEventListener('click', (e) => {
        if (e.target === cropBidsModal) closeCropBidsModal();
      });
    }

    // Scroll to Bids panel with pulse animation
    function scrollToBidsPanel() {
      const bidsSection = document.getElementById('buyer-bids-section');
      if (bidsSection) {
        closeCropBidsModal();
        bidsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        bidsSection.classList.remove('highlight-pulse');
        void bidsSection.offsetWidth;
        bidsSection.classList.add('highlight-pulse');
        setTimeout(() => {
          bidsSection.classList.remove('highlight-pulse');
        }, 1800);
      }
    }

    if (scrollToBidsPanelBtn) scrollToBidsPanelBtn.addEventListener('click', scrollToBidsPanel);

    // Attach scroll highlight to Hub Card 2 (Buyer Offers & Orders)
    const hubBidsCard = document.querySelector('a[href="#buyer-bids-section"]');
    if (hubBidsCard) {
      hubBidsCard.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToBidsPanel();
      });
    }

    // -----------------------------------------------------------------------
    // Interactive Bank Payouts Ledger Modal Logic
    // -----------------------------------------------------------------------
    const payoutsModal = document.getElementById('payouts-modal');
    const hubPayoutsCard = document.getElementById('hub-payouts-card');
    const closePayoutsModalBtn = document.getElementById('close-payouts-modal-btn');
    const cancelPayoutsModalBtn = document.getElementById('cancel-payouts-modal-btn');
    const openProfileFromPayoutsBtn = document.getElementById('open-profile-from-payouts-btn');
    const downloadPayoutStatementBtn = document.getElementById('download-payout-statement-btn');

    function openPayoutsModal() {
      if (!payoutsModal) return;
      const beneficiaryEl = document.getElementById('payouts-beneficiary-name');
      const upiEl = document.getElementById('payouts-upi-val');
      if (beneficiaryEl) beneficiaryEl.textContent = farmerProfile.full_name || 'Ramesh Patel';
      if (upiEl) upiEl.textContent = farmerProfile.upi_id || 'ramesh.kisan@oksbi';
      payoutsModal.classList.add('active');
    }

    function closePayoutsModal() {
      if (payoutsModal) payoutsModal.classList.remove('active');
    }

    if (hubPayoutsCard) {
      hubPayoutsCard.addEventListener('click', openPayoutsModal);
      hubPayoutsCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPayoutsModal();
        }
      });
    }

    if (closePayoutsModalBtn) closePayoutsModalBtn.addEventListener('click', closePayoutsModal);
    if (cancelPayoutsModalBtn) cancelPayoutsModalBtn.addEventListener('click', closePayoutsModal);
    if (payoutsModal) {
      payoutsModal.addEventListener('click', (e) => {
        if (e.target === payoutsModal) closePayoutsModal();
      });
    }

    if (openProfileFromPayoutsBtn) {
      openProfileFromPayoutsBtn.addEventListener('click', () => {
        closePayoutsModal();
        openProfileModal();
      });
    }

    if (downloadPayoutStatementBtn) {
      downloadPayoutStatementBtn.addEventListener('click', () => {
        showToast('📄 Settlement statement downloaded (PDF) successfully!');
      });
    }

    // Global Click Delegation for View Bids, Modal Actions & Produce Operations
    document.addEventListener('click', (e) => {
      // 1. View Bids in Crop Listing
      const viewBidsBtn = e.target.closest('.view-crop-bids-btn');
      if (viewBidsBtn) {
        e.preventDefault();
        const cropName = viewBidsBtn.getAttribute('data-crop') || 'Produce';
        const qty = viewBidsBtn.getAttribute('data-qty') || '';
        const price = viewBidsBtn.getAttribute('data-price') || '';
        const location = viewBidsBtn.getAttribute('data-location') || '';
        openCropBidsModal(cropName, qty, price, location);
        return;
      }

      // 2. Accept Offer from Modal
      const modalAcceptBtn = e.target.closest('.modal-accept-bid-btn');
      if (modalAcceptBtn) {
        const card = modalAcceptBtn.closest('.crop-bid-card');
        if (card) {
          card.classList.add('accepted');
          modalAcceptBtn.innerHTML = '<span>&#10003;</span> <span>Offer Accepted</span>';
          modalAcceptBtn.disabled = true;
          modalAcceptBtn.style.backgroundColor = '#166534';
          modalAcceptBtn.style.cursor = 'default';
        }
        const buyer = modalAcceptBtn.getAttribute('data-buyer') || 'Buyer';
        showToast(`✅ Offer from ${buyer} accepted! Pickup & payment scheduled.`);
        return;
      }

      // 3. Accept Buyer Offer Handler (Direct Dashboard List)
      const acceptBtn = e.target.closest('.btn-accept-offer:not(.modal-accept-bid-btn)');
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
        return;
      }

      // 4. Mark as sold handler
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
        return;
      }

      // 5. Request callback button
      const callbackBtn = e.target.closest('.request-callback-btn');
      if (callbackBtn) {
        callbackBtn.textContent = '✓ Callback Requested';
        callbackBtn.disabled = true;
        showToast('📞 Kisan Sahayak will call you on +91 98765 43210 within 15 minutes.');
      }
    });

  }

})();
