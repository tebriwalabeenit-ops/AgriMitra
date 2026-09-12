

(function () {
  'use strict';

  const STORAGE_KEY = 'agrimitraLanguage';
  const DEFAULT_LANG = 'en';

  const LANGUAGES = {
    en: { code: 'en', name: 'English', nativeName: 'English' },
    hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
  };

  const translations = {
    en: {

      language: 'Language',
      select_language: 'Select Language',
      brand_subtext: 'Market Intelligence & Trade',
      nav_about: 'About',
      nav_how_it_works: 'How It Works',
      login: 'Login',
      register: 'Register',
      cancel: 'Cancel',
      close: 'Close',
      home: 'Home',
      back_to_home: 'Back to Home',
      sign_out: 'Sign Out',
      helpline: 'Helpline: 1800-123-AGRI',

      platform_badge: 'Public Agricultural Trading Infrastructure',
      hero_tagline: 'Connect. Trade. Grow.',
      hero_desc: 'Helping farmers discover better markets, connect with reliable buyers, and manage produce sales from farm to delivery.',
      ecosystem_roles_label: 'Connected Ecosystem Roles',

      role_farmer: 'Farmer',
      role_buyer: 'Buyer',
      role_fpo: 'FPO',
      role_fpo_full: 'FPO (Farmer Producer Organisation)',
      role_distributor: 'Distributor',
      role_wholesaler: 'Wholesaler',
      role_distributor_wholesaler: 'Distributor / Wholesaler',
      role_delivery: 'Delivery Agent',

      chain_eyebrow: 'End-to-End Transparency',
      chain_title: 'Agricultural Supply Chain',
      chain_subtitle: 'A unified workflow ensuring transparent price discovery, quality assessment, and timely settlement.',

      step_1_name: 'Farmer',
      step_1_desc: 'Discovers transparent market rates and lists harvest quantities without intermediary price suppression.',
      step_1_feat: 'Fair Price Discovery →',

      step_2_name: 'Produce',
      step_2_desc: 'Standardized lot cataloging with verified grade, moisture content, storage status, and harvest dates.',
      step_2_feat: 'Quality Graded Lots',

      step_3_name: 'Buyer',
      step_3_desc: 'Accesses certified produce lots with escrow-secured bidding, advance logistics scheduling, and direct invoicing.',
      step_3_feat: 'Verified Sourcing →',

      step_4_name: 'Delivery',
      step_4_desc: 'GPS-monitored agricultural transit partners ensure temperature compliance, timely dispatch, and verified handoff.',
      step_4_feat: 'GPS Monitored Fleet →',

      step_5_name: 'Bank Settlement',
      step_5_desc: 'Automated escrow release directly to farmer account upon digital delivery confirmation and quality signoff.',
      step_5_feat: 'Direct Bank Transfer',

      core_eyebrow: 'Market Intelligence',
      core_title: 'Informed Selling Decisions',
      core_subtitle: 'AgriMitra equips producers with actionable answers instead of raw data tables.',

      pillar_1_title: 'What and When to Sell',
      pillar_1_desc: 'Real-time Mandi price aggregation and seasonal price forecasting to optimize harvesting schedules and warehouse holding decisions.',

      pillar_2_title: 'Where to Sell',
      pillar_2_desc: 'Net realisation calculator comparing local mandi returns against distant regional hubs factoring in transport and handling costs.',

      pillar_3_title: 'Who to Sell To',
      pillar_3_desc: 'Verified buyers, FPO aggregators, and institutional processors with verifiable credit and on-time settlement ratings.',

      footer_statement: 'Connect. Trade. Grow. Direct market access, real-time intelligence, and verified fulfillment across the agricultural supply chain.',
      footer_platform_roles: 'Platform Roles',
      footer_information: 'Information',
      footer_about: 'About AgriMitra',
      footer_supply_chain: 'Supply Chain Flow',
      footer_copyright: 'AgriMitra Agricultural Trading & Intelligence Platform. All rights reserved.',
      footer_subtext: 'Secure Infrastructure • Public Impact Standard',

      login_dialog_title: 'Sign In to AgriMitra',
      demo_accounts_label: 'Demo Test Accounts (1-Click Fill)',
      demo_accounts_badge: 'Demo Evaluation Mode',
      demo_accounts_subtext: 'Click any role below to pre-fill verified demo credentials:',
      or_enter_custom: 'Or Enter Custom Credentials',
      select_role_portal: 'Select Role Portal',
      phone_label: 'Phone Number',
      phone_placeholder: 'Enter 10-digit phone number',
      password_label: 'Password',
      password_placeholder: 'Enter your password',
      login_to_dashboard: 'Login to Dashboard',

      portal_opt_farmer: 'Farmer Portal & Dashboard',
      portal_opt_buyer: 'Buyer Dashboard & Marketplace',
      portal_opt_delivery: 'Delivery Agent Logistics Portal',
      portal_opt_distributor: 'Distributor / Wholesaler Dashboard',
      portal_opt_fpo: 'FPO Portal & Aggregation',

      register_dialog_title: 'Join AgriMitra',
      register_joining_as: 'I am joining as:',
      reg_farmer_desc: 'Sell harvest lots, compare mandi prices, and connect with verified buyers',
      reg_buyer_desc: 'Source quality graded produce lots directly with transparent contracts',
      reg_fpo_desc: 'Aggregate member harvest, negotiate institutional bulk deals and logistics',
      reg_delivery_desc: 'Accept agricultural transit contracts with GPS tracking and quick payout',
      reg_distributor_desc: 'Manage warehouse inventory, bulk mandi arrivals, and regional distribution',

      about_dialog_title: 'About AgriMitra',
      about_p1: 'AgriMitra is an open, technology-driven market intelligence and agricultural trade platform built to solve the fundamental question for producers:',
      about_quote: '“What should I sell, where should I sell it, when should I sell it, and who should I sell it to?”',
      about_p2: 'By bringing together verified farmers, FPOs, wholesale buyers, logistics partners, and transparent bank settlement, AgriMitra reduces price volatility and post-harvest losses.'
    },

    hi: {

      language: 'भाषा',
      select_language: 'भाषा चुनें',
      brand_subtext: 'बाजार आसूचना एवं व्यापार',
      nav_about: 'के बारे में',
      nav_how_it_works: 'यह कैसे काम करता है',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      cancel: 'रद्द करें',
      close: 'बंद करें',
      home: 'होम',
      back_to_home: 'मुख्य पृष्ठ पर वापस जाएँ',
      sign_out: 'साइन आउट',
      helpline: 'हेल्पलाइन: 1800-123-AGRI',

      platform_badge: 'सार्वजनिक कृषि व्यापार अवसंरचना',
      hero_tagline: 'जुड़ें. व्यापार करें. आगे बढ़ें.',
      hero_desc: 'किसानों को बेहतर बाजार खोजने, विश्वसनीय खरीदारों से जुड़ने और खेत से डिलीवरी तक उपज की बिक्री प्रबंधित करने में मदद करना।',
      ecosystem_roles_label: 'जुड़ी हुई कृषि भूमिकाएँ',

      role_farmer: 'किसान',
      role_buyer: 'खरीदार',
      role_fpo: 'एफपीओ',
      role_fpo_full: 'एफपीओ (किसान उत्पादक संगठन)',
      role_distributor: 'वितरक',
      role_wholesaler: 'थोक विक्रेता',
      role_distributor_wholesaler: 'वितरक / थोक विक्रेता',
      role_delivery: 'डिलीवरी एजेंट',

      chain_eyebrow: 'शुरुआत से अंत तक पूर्ण पारदर्शिता',
      chain_title: 'कृषि आपूर्ति श्रृंखला',
      chain_subtitle: 'पारदर्शी मूल्य निर्धारण, गुणवत्ता मूल्यांकन और समय पर बैंक भुगतान सुनिश्चित करने वाली एकीकृत प्रणाली।',

      step_1_name: 'किसान',
      step_1_desc: 'बिचौलियों के मूल्य दबाव के बिना पारदर्शी बाजार दरों की खोज करें और अपनी फसल सूचीबद्ध करें।',
      step_1_feat: 'उचित मूल्य खोज →',

      step_2_name: 'उपज',
      step_2_desc: 'सत्यापित ग्रेड, नमी की मात्रा, भंडारण स्थिति और कटाई की तारीख के साथ मानकीकृत लॉट सूची।',
      step_2_feat: 'गुणवत्ता प्रमाणित लॉट',

      step_3_name: 'खरीदार',
      step_3_desc: 'सुरक्षित एस्क्रो बोली, अग्रिम लॉजिस्टिक्स और सीधे चालान के साथ प्रमाणित उपज प्राप्त करें।',
      step_3_feat: 'सत्यापित स्रोत खरीद →',

      step_4_name: 'डिलीवरी',
      step_4_desc: 'जीपीएस-ट्रैक किए गए कृषि परिवहन भागीदार तापमान अनुपालन और सुरक्षित डिलीवरी सुनिश्चित करते हैं।',
      step_4_feat: 'जीपीएस निगरानी वाहन बेड़ा →',

      step_5_name: 'बैंक निपटान',
      step_5_desc: 'डिजिटल डिलीवरी पुष्टि और गुणवत्ता स्वीकृति के बाद सीधे किसान के बैंक खाते में स्वचालित भुगतान।',
      step_5_feat: 'सीधा बैंक खाता ट्रांसफर',

      core_eyebrow: 'बाजार आसूचना',
      core_title: 'सोच-समझकर बिक्री के निर्णय',
      core_subtitle: 'AgriMitra उत्पादकों को केवल तालिकाओं के बजाय स्पष्ट एवं व्यावहारिक उत्तर प्रदान करता है।',

      pillar_1_title: 'क्या और कब बेचें',
      pillar_1_desc: 'कटाई कार्यक्रम और भंडारण निर्णयों को बेहतर बनाने के लिए वास्तविक समय में मंडी भाव और मौसमी मूल्य पूर्वानुमान।',

      pillar_2_title: 'कहाँ बेचें',
      pillar_2_desc: 'परिवहन और हैंडलिंग लागत को ध्यान में रखते हुए स्थानीय मंडी और क्षेत्रीय केंद्रों के शुद्ध लाभ की तुलना करने वाला कैलकुलेटर।',

      pillar_3_title: 'किसे बेचें',
      pillar_3_desc: 'सत्यापित साख और समय पर भुगतान रेटिंग वाले विश्वसनीय खरीदार, एफपीओ और संस्थागत प्रसंस्करणकर्ता।',

      footer_statement: 'जुड़ें. व्यापार करें. आगे बढ़ें. संपूर्ण कृषि आपूर्ति श्रृंखला में सीधा बाजार संपर्क, त्वरित जानकारी और सुरक्षित पूर्ति।',
      footer_platform_roles: 'प्लेटफॉर्म भूमिकाएँ',
      footer_information: 'जानकारी',
      footer_about: 'AgriMitra के बारे में',
      footer_supply_chain: 'आपूर्ति श्रृंखला प्रवाह',
      footer_copyright: 'AgriMitra कृषि व्यापार एवं आसूचना प्लेटफॉर्म। सर्वाधिकार सुरक्षित।',
      footer_subtext: 'सुरक्षित डिजिटल अवसंरचना • सार्वजनिक प्रभाव मानक',

      login_dialog_title: 'AgriMitra में साइन इन करें',
      demo_accounts_label: 'डेमो टेस्ट खाते (1-क्लिक भरें)',
      demo_accounts_badge: 'डेमो मूल्यांकन मोड',
      demo_accounts_subtext: 'सत्यापित डेमो विवरण स्वतः भरने के लिए नीचे किसी भी भूमिका पर क्लिक करें:',
      or_enter_custom: 'या कस्टम विवरण दर्ज करें',
      select_role_portal: 'भूमिका पोर्टल चुनें',
      phone_label: 'फोन नंबर',
      phone_placeholder: '10 अंकों का फोन नंबर दर्ज करें',
      password_label: 'पासवर्ड',
      password_placeholder: 'अपना पासवर्ड दर्ज करें',
      login_to_dashboard: 'डैशबोर्ड में लॉगिन करें',

      portal_opt_farmer: 'किसान पोर्टल एवं डैशबोर्ड',
      portal_opt_buyer: 'खरीदार डैशबोर्ड एवं मार्केटप्लेस',
      portal_opt_delivery: 'डिलीवरी एजेंट लॉजिस्टिक्स पोर्टल',
      portal_opt_distributor: 'वितरक / थोक विक्रेता डैशबोर्ड',
      portal_opt_fpo: 'एफपीओ पोर्टल एवं एकत्रीकरण',

      register_dialog_title: 'AgriMitra से जुड़ें',
      register_joining_as: 'मेरी भूमिका है:',
      reg_farmer_desc: 'फसल लॉट बेचें, मंडी भाव की तुलना करें और सत्यापित खरीदारों से जुड़ें',
      reg_buyer_desc: 'पारदर्शी अनुबंधों के साथ सीधे गुणवत्ता-श्रेणीबद्ध उपज खरीदें',
      reg_fpo_desc: 'सदस्यों की फसल एकत्र करें, थोक सौदे और लॉजिस्टिक्स प्रबंधित करें',
      reg_delivery_desc: 'जीपीएस ट्रैकिंग और त्वरित भुगतान के साथ कृषि परिवहन अनुबंध स्वीकार करें',
      reg_distributor_desc: 'गोदाम इन्वेंट्री, थोक मंडी आवक और क्षेत्रीय वितरण का प्रबंधन करें',

      about_dialog_title: 'AgriMitra के बारे में',
      about_p1: 'AgriMitra एक खुला, प्रौद्योगिकी-आधारित बाजार आसूचना एवं कृषि व्यापार मंच है जो उत्पादकों के मुख्य प्रश्नों का समाधान करता है:',
      about_quote: '“मुझे क्या बेचना चाहिए, कहाँ बेचना चाहिए, कब बेचना चाहिए और किसे बेचना चाहिए?”',
      about_p2: 'सत्यापित किसानों, एफपीओ, थोक खरीदारों, लॉजिस्टिक्स भागीदारों और पारदर्शी बैंक निपटान को एक साथ लाकर, AgriMitra मूल्य अस्थिरता और फसल के नुकसान को कम करता है।'
    },

    ta: {

      language: 'மொழி',
      select_language: 'மொழியைத் தேர்ந்தெடுக்கவும்',
      brand_subtext: 'சந்தை நுண்ணறிவு மற்றும் வர்த்தகம்',
      nav_about: 'பற்றி',
      nav_how_it_works: 'இது எவ்வாறு செயல்படுகிறது',
      login: 'உள்நுழைக',
      register: 'பதிவு செய்க',
      cancel: 'ரத்து செய்',
      close: 'மூடு',
      home: 'முகப்பு',
      back_to_home: 'முகப்புக்குத் திரும்பு',
      sign_out: 'வெளியேறு',
      helpline: 'உதவி எண்: 1800-123-AGRI',

      platform_badge: 'பொது விவசாய வர்த்தக உள்கட்டமைப்பு',
      hero_tagline: 'இணையுங்கள். வர்த்தகம் செய்யுங்கள். வளருங்கள்.',
      hero_desc: 'விவசாயிகள் சிறந்த சந்தைகளைக் கண்டறியவும், நம்பகமான வாங்குபவர்களுடன் இணையவும், பண்ணை முதல் விநியோகம் வரை விற்பனையை நிர்வகிக்கவும் உதவுகிறது.',
      ecosystem_roles_label: 'இணைக்கப்பட்ட சூழலியல் பாத்திரங்கள்',

      role_farmer: 'விவசாயி',
      role_buyer: 'வாங்குபவர்',
      role_fpo: 'எஃப்பிஓ',
      role_fpo_full: 'எஃப்பிஓ (உழவர் உற்பத்தியாளர் அமைப்பு)',
      role_distributor: 'விநியோகஸ்தர்',
      role_wholesaler: 'மொத்த விற்பனையாளர்',
      role_distributor_wholesaler: 'விநியோகஸ்தர் / மொத்த விற்பனையாளர்',
      role_delivery: 'டெலிவரி முகவர்',

      chain_eyebrow: 'முழுமையான வெளிப்படைத்தன்மை',
      chain_title: 'விவசாய விநியோகச் சங்கிலி',
      chain_subtitle: 'வெளிப்படையான விலை நிர்ணயம், தர மதிப்பீடு மற்றும் சரியான நேரத்தில் பணம் வழங்குவதை உறுதி செய்யும் ஒருங்கிணைந்த அமைப்பு.',

      step_1_name: 'விவசாயி',
      step_1_desc: 'இடைத்தரகர்கள் இன்றி நேரடி சந்தை விலைகளைக் கண்டறிந்து அறுவடை அளவை பட்டியலிடுங்கள்.',
      step_1_feat: 'நியாயமான விலை கண்டறிதல் →',

      step_2_name: 'விளைபொருள்',
      step_2_desc: 'சரிபார்க்கப்பட்ட தரம், ஈரப்பதம், சேமிப்பு நிலை மற்றும் அறுவடை தேதியுடன் தரப்படுத்தப்பட்ட பட்டியல்.',
      step_2_feat: 'தரப்படுத்தப்பட்ட விளைபொருட்கள்',

      step_3_name: 'வாங்குபவர்',
      step_3_desc: 'பாதுகாப்பான ஏலம் மற்றும் நேரடி விலைப்பட்டியல் மூலம் சான்றளிக்கப்பட்ட விளைபொருட்களை அணுகுங்கள்.',
      step_3_feat: 'சரிபார்க்கப்பட்ட நேரடி கொள்முதல் →',

      step_4_name: 'டெலிவரி',
      step_4_desc: 'ஜிபிஎஸ் கண்காணிக்கப்படும் விவசாய போக்குவரத்து பங்காளிகள் சரியான நேரத்தில் விநியோகத்தை உறுதி செய்கிறார்கள்.',
      step_4_feat: 'ஜிபிஎஸ் கண்காணிப்பு வாகனம் →',

      step_5_name: 'வங்கி தீர்வு',
      step_5_desc: 'டிஜிட்டல் டெலிவரி உறுதிசெய்யப்பட்டதும் நேரடியாக விவசாயியின் வங்கிக் கணக்கிற்கு பணம் செலுத்தப்படுகிறது.',
      step_5_feat: 'நேரடி வங்கிப் பரிமாற்றம்',

      core_eyebrow: 'சந்தை நுண்ணறிவு',
      core_title: 'தகவலறிந்த விற்பனை முடிவுகள்',
      core_subtitle: 'AgriMitra வெறும் தரவுகளுக்குப் பதிலாக விவசாயிகளுக்கு நடைமுறை தீர்வுகளை வழங்குகிறது.',

      pillar_1_title: 'எதை எப்போது விற்க வேண்டும்',
      pillar_1_desc: 'அறுவடை மற்றும் சேமிப்பு முடிவுகளை மேம்படுத்த நேரடி மண்டி விலைகள் மற்றும் பருவகால விலை முன்னறிவிப்புகள்.',

      pillar_2_title: 'எங்கு விற்க வேண்டும்',
      pillar_2_desc: 'போக்குவரத்து செலவைக் கணக்கிட்டு உள்ளூர் மண்டி மற்றும் பிராந்திய மையங்களின் வருவாயை ஒப்பிடும் கருவி.',

      pillar_3_title: 'யாருக்கு விற்க வேண்டும்',
      pillar_3_desc: 'சரியான நேரத்தில் பணம் செலுத்தும் சான்றளிக்கப்பட்ட நம்பகமான வாங்குபவர்கள் மற்றும் எஃப்பிஓக்கள்.',

      footer_statement: 'இணையுங்கள். வர்த்தகம் செய்யுங்கள். வளருங்கள். நேரடி சந்தை அணுகல் மற்றும் விவசாய விநியோகச் சங்கிலி நுண்ணறிவு.',
      footer_platform_roles: 'தளத்தின் பாத்திரங்கள்',
      footer_information: 'தகவல்',
      footer_about: 'AgriMitra பற்றி',
      footer_supply_chain: 'விநியோகச் சங்கிலி ஓட்டம்',
      footer_copyright: 'AgriMitra விவசாய வர்த்தக தளம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      footer_subtext: 'பாதுகாப்பான உள்கட்டமைப்பு • பொது நன்மை தரம்',

      login_dialog_title: 'AgriMitra-வில் உள்நுழையவும்',
      demo_accounts_label: 'டெமோ கணக்குகள் (1-கிளிக் நிரப்புதல்)',
      demo_accounts_badge: 'டெமோ மதிப்பீட்டு முறைமை',
      demo_accounts_subtext: 'முன் நிரப்பப்பட்ட விவரங்களுக்கு கீழே உள்ள எந்தவொரு பாத்திரத்தையும் கிளிக் செய்யவும்:',
      or_enter_custom: 'அல்லது உங்கள் விவரங்களை உள்ளிடவும்',
      select_role_portal: 'போர்டல் பாத்திரத்தைத் தேர்ந்தெடுக்கவும்',
      phone_label: 'தொலைபேசி எண்',
      phone_placeholder: '10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்',
      password_label: 'கடவுச்சொல்',
      password_placeholder: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
      login_to_dashboard: 'டாஷ்போர்டில் உள்நுழைக',

      portal_opt_farmer: 'விவசாயி போர்டல் மற்றும் டாஷ்போர்டு',
      portal_opt_buyer: 'வாங்குபவர் டாஷ்போர்டு மற்றும் சந்தை',
      portal_opt_delivery: 'டெலிவரி முகவர் போக்குவரத்து போர்டல்',
      portal_opt_distributor: 'விநியோகஸ்தர் / மொத்த விற்பனையாளர் டாஷ்போர்டு',
      portal_opt_fpo: 'எஃப்பிஓ போர்டல்',

      register_dialog_title: 'AgriMitra-வில் இணையுங்கள்',
      register_joining_as: 'நான் இணையும் பாத்திரம்:',
      reg_farmer_desc: 'விளைபொருட்களை விற்கவும், மண்டி விலைகளை ஒப்பிடவும், வாங்குபவர்களுடன் இணையவும்',
      reg_buyer_desc: 'வெளிப்படையான ஒப்பந்தங்களுடன் தரமான விளைபொருட்களை நேரடியாக வாங்கவும்',
      reg_fpo_desc: 'விவசாயிகளின் விளைச்சலை ஒருங்கிணைத்து மொத்த ஒப்பந்தங்களை நிர்வகிக்கவும்',
      reg_delivery_desc: 'ஜிபிஎஸ் கண்காணிப்புடன் போக்குவரத்து ஒப்பந்தங்களை ஏற்றுக்கொண்டு வருமானம் ஈட்டவும்',
      reg_distributor_desc: 'கிடங்கு இருப்பு மற்றும் பிராந்திய விநியோகத்தை நிர்வகிக்கவும்',

      about_dialog_title: 'AgriMitra பற்றி',
      about_p1: 'AgriMitra என்பது விவசாயிகளின் முக்கிய கேள்விகளுக்கு தீர்வு காண உருவாக்கப்பட்ட ஒரு நவீன தளமாகும்:',
      about_quote: '“நான் எதை விற்க வேண்டும், எங்கு விற்க வேண்டும், எப்போது விற்க வேண்டும், யாருக்கு விற்க வேண்டும்?”',
      about_p2: 'விவசாயிகள், வாங்குபவர்கள் மற்றும் போக்குவரத்து கூட்டாளர்களை இணைப்பதன் மூலம் விலை ஸ்திரத்தன்மையை AgriMitra உறுதி செய்கிறது.'
    },

    ml: {

      language: 'ഭാഷ',
      select_language: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
      brand_subtext: 'മാർക്കറ്റ് ഇന്റലിജൻസും വ്യാപാരവും',
      nav_about: 'കുറിച്ച്',
      nav_how_it_works: 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
      login: 'ലോഗിൻ',
      register: 'രജിസ്റ്റർ ചെയ്യുക',
      cancel: 'റദ്ദാക്കുക',
      close: 'അടയ്ക്കുക',
      home: 'ഹോം',
      back_to_home: 'ഹോം പേജിലേക്ക് മടങ്ങുക',
      sign_out: 'സൈൻ ഔട്ട്',
      helpline: 'ഹെൽപ്പ് ലൈൻ: 1800-123-AGRI',

      platform_badge: 'പൊതു കാർഷിക വ്യാപാര പശ്ചാത്തലം',
      hero_tagline: 'ബന്ധപ്പെടുക. വ്യാപാരം ചെയ്യുക. വളരുക.',
      hero_desc: 'കർഷകർക്ക് മികച്ച വിപണികൾ കണ്ടെത്താനും വിശ്വസ്തരായ വാങ്ങുന്നവരുമായി ബന്ധപ്പെടാനും വിളവെടുപ്പ് മുതൽ വിതരണം വരെയുള്ള വിൽപ്പന നിയന്ത്രിക്കാനും സഹായിക്കുന്നു.',
      ecosystem_roles_label: 'ബന്ധിപ്പിച്ച പങ്കാളിത്ത ചുമതലകൾ',

      role_farmer: 'കർഷകൻ',
      role_buyer: 'വാങ്ങുന്നയാൾ',
      role_fpo: 'എഫ്.പി.ഒ',
      role_fpo_full: 'എഫ്.പി.ഒ (കർഷക ഉത്പാദക സംഘടന)',
      role_distributor: 'വിതരണക്കാരൻ',
      role_wholesaler: 'മൊത്തവ്യാപാരി',
      role_distributor_wholesaler: 'വിതരണക്കാരൻ / മൊത്തവ്യാപാരി',
      role_delivery: 'ഡെലിവറി ഏജന്റ്',

      chain_eyebrow: 'സമ്പൂർണ്ണ സുതാര്യത',
      chain_title: 'കാർഷിക വിതരണ ശൃംഖല',
      chain_subtitle: 'സുതാര്യമായ വിലനിർണ്ണയം, ഗുണനിലവാര പരിശോധന, സമയബന്ധിതമായ പണമിടപാട് എന്നിവ ഉറപ്പാക്കുന്ന ഏകീകൃത സംവിധാനം.',

      step_1_name: 'കർഷകൻ',
      step_1_desc: 'ഇടനിലക്കാരുടെ ചൂഷണമില്ലാതെ വിപണി വിലകൾ കണ്ടെത്തുകയും വിളകൾ പട്ടികപ്പെടുത്തുകയും ചെയ്യുക.',
      step_1_feat: 'ന്യായവില കണ്ടെത്തൽ →',

      step_2_name: 'വിളവുകൾ',
      step_2_desc: 'ഗുണനിലവാരം, ഈർപ്പത്തിന്റെ അളവ്, സംഭരണ ​​വിവരം എന്നിവ ഉൾപ്പെടുത്തിയ കാറ്റലോഗ്.',
      step_2_feat: 'ഗുണനിലവാരം തിട്ടപ്പെടുത്തിയവ',

      step_3_name: 'വാങ്ങുന്നയാൾ',
      step_3_desc: 'സുരക്ഷിതമായ ബിഡ്ഡിംഗ്, ട്രാൻസ്പോർട്ട് സൗകര്യം എന്നിവയിലൂടെ മികച്ച ഉത്പന്നങ്ങൾ വാങ്ങുക.',
      step_3_feat: 'വിശ്വസനീയ സംഭരണം →',

      step_4_name: 'ഡെലിവറി',
      step_4_desc: 'ജിപിഎസ് നിരീക്ഷണത്തിലൂടെ വിളകൾ കൃത്യസമയത്ത് കേടുകൂടാതെ വിതരണം ചെയ്യുന്നു.',
      step_4_feat: 'ജിപിഎസ് നിരീക്ഷണ വാഹനം →',

      step_5_name: 'ബാങ്ക് സെറ്റിൽമെന്റ്',
      step_5_desc: 'വിഭവങ്ങൾ കൈമാറി പരിശോധന കഴിഞ്ഞാലുടൻ തുക നേരിട്ട് കർഷകന്റെ അക്കൗണ്ടിലേക്ക്.',
      step_5_feat: 'നേരിട്ടുള്ള ബാങ്ക് ട്രാൻസ്ഫർ',

      core_eyebrow: 'മാർക്കറ്റ് ഇന്റലിജൻസ്',
      core_title: 'വിവേകപൂർണ്ണമായ വിൽപ്പന തീരുമാനങ്ങൾ',
      core_subtitle: 'AgriMitra കർഷകർക്ക് പ്രായോഗികമായ മാർഗ്ഗനിർദ്ദേശങ്ങൾ നൽകുന്നു.',

      pillar_1_title: 'എന്ത്, എപ്പോൾ വിൽക്കണം',
      pillar_1_desc: 'വിളവെടുപ്പ്, സംഭരണം എന്നിവ ക്രമീകരിക്കാൻ തത്സമയ മണ്ടി വിലകളും സീസണൽ വില പ്രവചനങ്ങളും.',

      pillar_2_title: 'എവിടെ വിൽക്കണം',
      pillar_2_desc: 'ഗതാഗതച്ചെലവ് കണക്കാക്കി കൂടുതൽ ലാഭം നൽകുന്ന വിപണികൾ കണ്ടെത്താനുള്ള കാൽക്കുലേറ്റർ.',

      pillar_3_title: 'ആർക്ക് വിൽക്കണം',
      pillar_3_desc: 'കൃത്യസമയത്ത് പണം നൽകുന്ന വിശ്വസ്തരായ വ്യാപാരികളും പ്രൊസസ്സറുകളും.',

      footer_statement: 'ബന്ധപ്പെടുക. വ്യാപാരം ചെയ്യുക. വളരുക. കർഷകർക്കായി സമഗ്രമായ കാർഷിക വിപണി ശൃംഖല.',
      footer_platform_roles: 'പ്ലാറ്റ്ഫോം ചുമതലകൾ',
      footer_information: 'വിവരങ്ങൾ',
      footer_about: 'AgriMitra-യെ കുറിച്ച്',
      footer_supply_chain: 'വിതരണ ശൃംഖല പ്രക്രിയ',
      footer_copyright: 'AgriMitra കാർഷിക വ്യാപാര പ്ലാറ്റ്‌ഫോം. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.',
      footer_subtext: 'സുരക്ഷിത ഇൻഫ്രാസ്ട്രക്ചർ • പൊതു സേവന നിലവാരം',

      login_dialog_title: 'AgriMitra-യിലേക്ക് സൈൻ ഇൻ ചെയ്യുക',
      demo_accounts_label: 'ഡെമോ അക്കൗണ്ടുകൾ (1-ക്ലിക്ക് പൂരിപ്പിക്കൽ)',
      demo_accounts_badge: 'ഡെമോ മൂല്യനിർണ്ണയ മോഡ്',
      demo_accounts_subtext: 'ഡെമോ വിവരങ്ങൾക്കായി താഴെയുള്ള ഏതെങ്കിലും റോളിൽ ക്ലിക്ക് ചെയ്യുക:',
      or_enter_custom: 'അല്ലെങ്കിൽ വിവരങ്ങൾ രേഖപ്പെടുത്തുക',
      select_role_portal: 'പോർട്ടൽ തിരഞ്ഞെടുക്കുക',
      phone_label: 'ഫോൺ നമ്പർ',
      phone_placeholder: '10 അക്ക ഫോൺ നമ്പർ നൽകുക',
      password_label: 'പാസ്‌വേഡ്',
      password_placeholder: 'നിങ്ങളുടെ പാസ്‌വേഡ് നൽകുക',
      login_to_dashboard: 'ഡാഷ്‌ബോർഡിലേക്ക് ലോഗിൻ ചെയ്യുക',

      portal_opt_farmer: 'കർഷക പോർട്ടലും ഡാഷ്‌ബോർഡും',
      portal_opt_buyer: 'വാങ്ങുന്നയാളുടെ ഡാഷ്‌ബോർഡ്',
      portal_opt_delivery: 'ഡെലിവറി ഏജന്റ് പോർട്ടൽ',
      portal_opt_distributor: 'വിതരണക്കാരൻ / മൊത്തവ്യാപാരി ഡാഷ്‌ബോർഡ്',
      portal_opt_fpo: 'എഫ്.പി.ഒ പോർട്ടൽ',

      register_dialog_title: 'AgriMitra-യിൽ ചേരുക',
      register_joining_as: 'എന്റെ ചുമതല:',
      reg_farmer_desc: 'വിളവുകൾ വിൽക്കുക, മണ്ടി വിലകൾ താരതമ്യം ചെയ്യുക, വാങ്ങുന്നവരുമായി ബന്ധപ്പെടുക',
      reg_buyer_desc: 'സുതാര്യമായ വ്യവസ്ഥകളോടെ മികച്ച കാർഷിക ഉത്പന്നങ്ങൾ വാങ്ങുക',
      reg_fpo_desc: 'കർഷകരുടെ ഉത്പന്നങ്ങൾ ഒന്നിച്ച് വിപണിയിലെത്തിച്ച് മികച്ച നേട്ടം കൈവരിക്കുക',
      reg_delivery_desc: 'ജിപിഎസ് ട്രാക്കിംഗോടെയുള്ള ട്രാൻസ്പോർട്ട് ഓർഡറുകൾ സ്വീകരിക്കുക',
      reg_distributor_desc: 'വെയർഹൗസ് ഇൻവെന്ററിയും വിതരണവും കൈകാര്യം ചെയ്യുക',

      about_dialog_title: 'AgriMitra-യെ കുറിച്ച്',
      about_p1: 'കർഷകരുടെ പ്രധാന ആവശ്യങ്ങൾ പരിഹരിക്കുന്നതിനായി നിർമ്മിച്ച സാങ്കേതിക പ്ലാറ്റ്‌ഫോമാണ് AgriMitra:',
      about_quote: '“ഞാൻ എന്ത് വിൽക്കണം, എവിടെ വിൽക്കണം, എപ്പോൾ വിൽക്കണം, ആർക്ക് വിൽക്കണം?”',
      about_p2: 'കർഷകരെയും വ്യാപാരികളെയും സുതാര്യമായി ബന്ധിപ്പിച്ച് ഇടനിലക്കാരെ ഒഴിവാക്കാൻ AgriMitra സഹായിക്കുന്നു.'
    },

    kn: {

      language: 'ಭಾಷೆ',
      select_language: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      brand_subtext: 'ಮಾರುಕಟ್ಟೆ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ವ್ಯಾಪಾರ',
      nav_about: 'ಬಗ್ಗೆ',
      nav_how_it_works: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
      login: 'ಲಾಗಿನ್',
      register: 'ನೋಂದಣಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      close: 'ಮುಚ್ಚಿ',
      home: 'ಮುಖಪುಟ',
      back_to_home: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
      sign_out: 'ಸೈನ್ ಔಟ್',
      helpline: 'ಸಹಾಯವಾಣಿ: 1800-123-AGRI',

      platform_badge: 'ಸಾರ್ವಜನಿಕ ಕೃಷಿ ವ್ಯಾಪಾರ ಮೂಲಸೌಕರ್ಯ',
      hero_tagline: 'ಸಂಪರ್ಕಿಸಿ. ವ್ಯಾಪಾರ ಮಾಡಿ. ಬೆಳೆಯಿರಿ.',
      hero_desc: 'ರೈತರಿಗೆ ಉತ್ತಮ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಹುಡುಕಲು, ವಿಶ್ವಾಸಾರ್ಹ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಲು ಮತ್ತು ಹೊಲದಿಂದ ವಿತರಣೆಯವರೆಗೆ ಉತ್ಪನ್ನಗಳ ಮಾರಾಟವನ್ನು ನಿರ್ವಹಿಸಲು ಸಹಾಯ ಮಾಡುವುದು.',
      ecosystem_roles_label: 'ಸಂಪರ್ಕಿತ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯ ಪಾತ್ರಗಳು',

      role_farmer: 'ರೈತ',
      role_buyer: 'ಖರೀದಿದಾರ',
      role_fpo: 'ಎಫ್‌ಪಿಒ',
      role_fpo_full: 'ಎಫ್‌ಪಿಒ (ರೈತ ಉತ್ಪಾದಕ ಸಂಸ್ಥೆ)',
      role_distributor: 'ವಿತರಕ',
      role_wholesaler: 'ಸಗಟು ವ್ಯಾಪಾರಿ',
      role_distributor_wholesaler: 'ವಿತರಕ / ಸಗಟು ವ್ಯಾಪಾರಿ',
      role_delivery: 'ಡೆಲಿವರಿ ಏಜೆಂಟ್',

      chain_eyebrow: 'ಸಂಪೂರ್ಣ ಪಾರದರ್ಶಕತೆ',
      chain_title: 'ಕೃಷಿ ಪೂರೈಕೆ ಸರಪಳಿ',
      chain_subtitle: 'ಪಾರದರ್ಶಕ ಬೆಲೆ ನಿರ್ಣಯ, ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ ಮತ್ತು ಸಕಾಲಿಕ ಪಾವತಿಯನ್ನು ಖಚಿತಪಡಿಸುವ ಸಮಗ್ರ ಕಾರ್ಯವಿಧಾನ.',

      step_1_name: 'ರೈತ',
      step_1_desc: 'ಮಧ್ಯವರ್ತಿಗಳ ಹಾವಳಿಯಿಲ್ಲದೆ ಪಾರದರ್ಶಕ ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ ಮತ್ತು ಬೆಳೆಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಿ.',
      step_1_feat: 'ನ್ಯಾಯಯುತ ಬೆಲೆ ಶೋಧನೆ →',

      step_2_name: 'ಉತ್ಪನ್ನ',
      step_2_desc: 'ದೃಢೀಕೃತ ಗುಣಮಟ್ಟ, ತೇವಾಂಶ ಮತ್ತು ಕೊಯ್ಲು ದಿನಾಂಕದೊಂದಿಗೆ ಪ್ರಮಾಣಿತ ಉತ್ಪನ್ನಗಳ ಪಟ್ಟಿ.',
      step_2_feat: 'ಗುಣಮಟ್ಟ ಶ್ರೇಣೀಕೃತ ಉತ್ಪನ್ನಗಳು',

      step_3_name: 'ಖರೀದಿದಾರ',
      step_3_desc: 'ಸುರಕ್ಷಿತ ಬಿಡ್ಡಿಂಗ್ ಮತ್ತು ನೇರ ಇನ್‌ವಾಯ್ಸಿಂಗ್ ಮೂಲಕ ಪ್ರಮಾಣೀಕೃತ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ.',
      step_3_feat: 'ಪರಿಶೀಲಿಸಿದ ಖರೀದಿ →',

      step_4_name: 'ವಿತರಣೆ',
      step_4_desc: 'ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾದ ಸಾರಿಗೆ ಪಾಲುದಾರರು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಸುರಕ್ಷಿತ ವಿತರಣೆಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತಾರೆ.',
      step_4_feat: 'ಜಿಪಿಎಸ್ ಸಾರಿಗೆ ವಾಹನ →',

      step_5_name: 'ಬ್ಯಾಂಕ್ ಇತ್ಯರ್ಥ',
      step_5_desc: 'ಡಿಜಿಟಲ್ ವಿತರಣೆ ಖಚಿತವಾದ ನಂತರ ನೇರವಾಗಿ ರೈತರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ ವರ್ಗಾವಣೆ.',
      step_5_feat: 'ನೇರ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ',

      core_eyebrow: 'ಮಾರುಕಟ್ಟೆ ಬುದ್ಧಿಮತ್ತೆ',
      core_title: 'ತಿಳುವಳಿಕೆಯುಕ್ತ ಮಾರಾಟ ನಿರ್ಧಾರಗಳು',
      core_subtitle: 'AgriMitra ಕೇವಲ ದತ್ತಾಂಶ ನೀಡದೆ ರೈತರಿಗೆ ಉಪಯುಕ್ತ ಪರಿಹಾರಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.',

      pillar_1_title: 'ಏನು ಮತ್ತು ಯಾವಾಗ ಮಾರಾಟ ಮಾಡಬೇಕು',
      pillar_1_desc: 'ಕೊಯ್ಲು ಮತ್ತು ಶೇಖರಣಾ ನಿರ್ಧಾರಗಳನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ನೈಜ-ಸಮಯದ ಮಂಡಿ ಬೆಲೆಗಳು ಮತ್ತು ಮುನ್ಸೂಚನೆ.',

      pillar_2_title: 'ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬೇಕು',
      pillar_2_desc: 'ಸಾರಿಗೆ ವೆಚ್ಚಗಳನ್ನು ಪರಿಗಣಿಸಿ ಸ್ಥಳೀಯ ಮಂಡಿ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಕೇಂದ್ರಗಳ ಆದಾಯವನ್ನು ಹೋಲಿಸುವ ಕ್ಯಾಲ್ಕುಲೇಟರ್.',

      pillar_3_title: 'ಯಾರಿಗೆ ಮಾರಾಟ ಮಾಡಬೇಕು',
      pillar_3_desc: 'ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಹಣ ಪಾವತಿಸುವ ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರು ಮತ್ತು ಎಫ್‌ಪಿಒಗಳು.',

      footer_statement: 'ಸಂಪರ್ಕಿಸಿ. ವ್ಯಾಪಾರ ಮಾಡಿ. ಬೆಳೆಯಿರಿ. ಕೃಷಿ ಪೂರೈಕೆ ಸರಪಳಿಯಾದ್ಯಂತ ನೇರ ಮಾರುಕಟ್ಟೆ ಪ್ರವೇಶ ಮತ್ತು ಭದ್ರತೆ.',
      footer_platform_roles: 'ವೇದಿಕೆಯ ಪಾತ್ರಗಳು',
      footer_information: 'ಮಾಹಿತಿ',
      footer_about: 'AgriMitra ಬಗ್ಗೆ',
      footer_supply_chain: 'ಪೂರೈಕೆ ಸರಪಳಿ ಹರಿವು',
      footer_copyright: 'AgriMitra ಕೃಷಿ ವ್ಯಾಪಾರ ವೇದಿಕೆ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
      footer_subtext: 'ಸುರಕ್ಷಿತ ಮೂಲಸೌಕರ್ಯ • ಸಾರ್ವಜನಿಕ ಸೇವಾ ಮಾನದಂಡ',

      login_dialog_title: 'AgriMitra ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
      demo_accounts_label: 'ಡೆಮೊ ಖಾತೆಗಳು (1-ಕ್ಲಿಕ್ ಭರ್ತಿ)',
      demo_accounts_badge: 'ಡೆಮೊ ಮೌಲ್ಯಮಾಪನ ಮೋಡ್',
      demo_accounts_subtext: 'ಪರಿಶೀಲಿಸಿದ ಡೆಮೊ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಲು ಕೆಳಗಿನ ಯಾವುದೇ ಪಾತ್ರವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ:',
      or_enter_custom: 'ಅಥವಾ ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
      select_role_portal: 'ಪೋರ್ಟಲ್ ಆಯ್ಕೆಮಾಡಿ',
      phone_label: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
      phone_placeholder: '10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
      password_label: 'ಪಾಸ್‌ವರ್ಡ್',
      password_placeholder: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
      login_to_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಿ',

      portal_opt_farmer: 'ರೈತ ಪೋರ್ಟಲ್ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      portal_opt_buyer: 'ಖರೀದಿದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      portal_opt_delivery: 'ಡೆಲಿವರಿ ಏಜೆಂಟ್ ಪೋರ್ಟಲ್',
      portal_opt_distributor: 'ವಿತರಕ / ಸಗಟು ವ್ಯಾಪಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      portal_opt_fpo: 'ಎಫ್‌ಪಿಒ ಪೋರ್ಟಲ್',

      register_dialog_title: 'AgriMitra ಗೆ ಸೇರಿ',
      register_joining_as: 'ನನ್ನ ಪಾತ್ರ:',
      reg_farmer_desc: 'ಬೆಳೆಗಳನ್ನು ಮಾರಾಟ ಮಾಡಿ, ಮಂಡಿ ದರಗಳನ್ನು ಹೋಲಿಸಿ ಮತ್ತು ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ',
      reg_buyer_desc: 'ಪಾರದರ್ಶಕ ಒಪ್ಪಂದಗಳೊಂದಿಗೆ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಉತ್ಪನ್ನಗಳನ್ನು ನೇರವಾಗಿ ಖರೀದಿಸಿ',
      reg_fpo_desc: 'ರೈತರ ಉತ್ಪನ್ನಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ ಸಗಟು ವ್ಯವಹಾರಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
      reg_delivery_desc: 'ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್‌ನೊಂದಿಗೆ ಸಾರಿಗೆ ಒಪ್ಪಂದಗಳನ್ನು ಸ್ವೀಕರಿಸಿ',
      reg_distributor_desc: 'ಗೋದಾಮಿನ ದಾಸ್ತಾನು ಮತ್ತು ಪ್ರಾದೇಶಿಕ ವಿತರಣೆಯನ್ನು ನಿರ್ವಹಿಸಿ',

      about_dialog_title: 'AgriMitra ಬಗ್ಗೆ',
      about_p1: 'AgriMitra ರೈತರ ಮೂಲಭೂತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಪರಿಹಾರ ನೀಡಲು ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾದ ಆಧುನಿಕ ಕೃಷಿ ವೇದಿಕೆಯಾಗಿದೆ:',
      about_quote: '“ನಾನು ಏನನ್ನು ಮಾರಾಟ ಮಾಡಬೇಕು, ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬೇಕು, ಯಾವಾಗ ಮಾರಾಟ ಮಾಡಬೇಕು ಮತ್ತು ಯಾರಿಗೆ ಮಾರಾಟ ಮಾಡಬೇಕು?”',
      about_p2: 'ರೈತರು, ಖರೀದಿದಾರರು ಮತ್ತು ಸಾರಿಗೆ ಪಾಲುದಾರರನ್ನು ಒಟ್ಟುಗೂಡಿಸುವ ಮೂಲಕ AgriMitra ಬೆಲೆ ಸ್ಥಿರತೆಯನ್ನು ಖಾತ್ರಿಪಡಿಸುತ್ತದೆ.'
    },

    mr: {

      language: 'भाषा',
      select_language: 'भाषा निवडा',
      brand_subtext: 'बाजार माहिती आणि व्यापार',
      nav_about: 'आमच्याबद्दल',
      nav_how_it_works: 'हे कसे कार्य करते',
      login: 'लॉगिन',
      register: 'नोंदणी',
      cancel: 'रद्द करा',
      close: 'बंद करा',
      home: 'मुख्यपृष्ठ',
      back_to_home: 'मुख्यपृष्ठावर परत जा',
      sign_out: 'साइन आउट',
      helpline: 'हेल्पलाईन: 1800-123-AGRI',

      platform_badge: 'सार्वजनिक कृषी व्यापार पायाभूत सुविधा',
      hero_tagline: 'जोडा. व्यापार करा. प्रगती करा.',
      hero_desc: 'शेतकऱ्यांना चांगली बाजारपेठ शोधण्यात, विश्वासू खरेदीदारांशी जोडण्यात आणि शेतापासून ते वितरणापर्यंत उत्पादनाची विक्री व्यवस्थापित करण्यात मदत करणे.',
      ecosystem_roles_label: 'संलग्न परिसंस्था भूमिका',

      role_farmer: 'शेतकरी',
      role_buyer: 'खरेदीदार',
      role_fpo: 'एफपीओ',
      role_fpo_full: 'एफपीओ (शेतकरी उत्पादक संस्था)',
      role_distributor: 'वितरक',
      role_wholesaler: 'घाऊक व्यापारी',
      role_distributor_wholesaler: 'वितरक / घाऊक व्यापारी',
      role_delivery: 'डिलिव्हरी एजंट',

      chain_eyebrow: 'सुरुवातीपासून शेवटपर्यंत पारदर्शकता',
      chain_title: 'कृषी पुरवठा साखळी',
      chain_subtitle: 'पारदर्शक भाव शोध, गुणवत्ता तपासणी आणि वेळेवर पैसे मिळण्याची खात्री देणारी एकात्मिक कार्यप्रणाली.',

      step_1_name: 'शेतकरी',
      step_1_desc: 'दलालांशिवाय पारदर्शक बाजारभाव मिळवा आणि शेतमालाची थेट नोंदणी करा.',
      step_1_feat: 'योग्य भाव शोध →',

      step_2_name: 'उत्पादन',
      step_2_desc: 'प्रमाणित प्रत, ओलावा, साठवणूक आणि काढणीच्या तारखेसह प्रमाणित शेतमाल यादी.',
      step_2_feat: 'गुणवत्ता प्रमाणित शेतमाल',

      step_3_name: 'खरेदीदार',
      step_3_desc: 'सुरक्षित एस्क्रॉ बोली आणि थेट इनव्हॉइसिंगद्वारे दर्जेदार शेतमाल खरेदी करा.',
      step_3_feat: 'सत्यापित खरेदी →',

      step_4_name: 'डिलिव्हरी',
      step_4_desc: 'जीपीएस ट्रॅकिंगद्वारे शेतमालाची वेळेवर आणि सुरक्षित वाहतूक सुनिश्चित केली जाते.',
      step_4_feat: 'जीपीएस ट्रॅक केलेली वाहने →',

      step_5_name: 'बँक सेटलमेंट',
      step_5_desc: 'डिलिव्हरीची पुष्टी झाल्यानंतर थेट शेतकऱ्याच्या बँक खात्यात तत्काळ रक्कम जमा.',
      step_5_feat: 'थेट बँक ट्रान्सफर',

      core_eyebrow: 'बाजार माहिती',
      core_title: 'माहितीपूर्ण विक्री निर्णय',
      core_subtitle: 'AgriMitra उत्पादकांना केवळ आकडेवारी न देता थेट व्यावहारिक उत्तरे देते.',

      pillar_1_title: 'काय आणि कधी विकावे',
      pillar_1_desc: 'काढणी आणि साठवणुकीचे नियोजन करण्यासाठी थेट बाजारभाव आणि हंगामी भाव अंदाज.',

      pillar_2_title: 'कुठे विकावे',
      pillar_2_desc: 'वाहतूक खर्च लक्षात घेऊन स्थानिक बाजार आणि विभागीय केंद्रांच्या नफ्याची तुलना करणारे साधन.',

      pillar_3_title: 'कोणाला विकावे',
      pillar_3_desc: 'वेळेवर पैसे देणारे आणि विश्वासार्ह रेटिंग असलेले खरेदीदार व प्रक्रियादार.',

      footer_statement: 'जोडा. व्यापार करा. प्रगती करा. संपूर्ण कृषी पुरवठा साखळीत थेट बाजारपेठ आणि विश्वासार्हता.',
      footer_platform_roles: 'प्लॅटफॉर्म भूमिका',
      footer_information: 'माहिती',
      footer_about: 'AgriMitra बद्दल',
      footer_supply_chain: 'पुरवठा साखळी प्रवाह',
      footer_copyright: 'AgriMitra कृषी व्यापार प्लॅटफॉर्म. सर्व हक्क राखीव.',
      footer_subtext: 'सुरक्षित पायाभूत सुविधा • सार्वजनिक प्रभाव मानक',

      login_dialog_title: 'AgriMitra मध्ये साइन इन करा',
      demo_accounts_label: 'डेमो खाती (१-क्लिक भरा)',
      demo_accounts_badge: 'डेमो मूल्यांकन मोड',
      demo_accounts_subtext: 'डेमो माहिती भरण्यासाठी खालील कोणत्याही भूमिकेवर क्लिक करा:',
      or_enter_custom: 'किंवा तुमची माहिती प्रविष्ट करा',
      select_role_portal: 'भूमिका पोर्टल निवडा',
      phone_label: 'फोन नंबर',
      phone_placeholder: '१० अंकी मोबाईल नंबर टाका',
      password_label: 'पासवर्ड',
      password_placeholder: 'तुमचा पासवर्ड टाका',
      login_to_dashboard: 'डॅशबोर्डमध्ये लॉगिन करा',

      portal_opt_farmer: 'शेतकरी पोर्टल आणि डॅशबोर्ड',
      portal_opt_buyer: 'खरेदीदार डॅशबोर्ड आणि मार्केटप्लेस',
      portal_opt_delivery: 'डिलिव्हरी एजंट पोर्टल',
      portal_opt_distributor: 'वितरक / घाऊक व्यापारी डॅशबोर्ड',
      portal_opt_fpo: 'एफपीओ पोर्टल',

      register_dialog_title: 'AgriMitra मध्ये सामील व्हा',
      register_joining_as: 'माझी भूमिका आहे:',
      reg_farmer_desc: 'शेतमाल विका, बाजारभावाची तुलना करा आणि थेट खरेदीदारांशी जोडा',
      reg_buyer_desc: 'पारदर्शक करारांसह थेट गुणवत्तापूर्ण शेतमाल खरेदी करा',
      reg_fpo_desc: 'शेतकऱ्यांचा शेतमाल एकत्र करून मोठ्या सौद्यांचे व्यवस्थापन करा',
      reg_delivery_desc: 'जीपीएस ट्रॅकिंगसह कृषी वाहतूक कंत्रாटे स्वीकारा आणि उत्पन्न मिळवा',
      reg_distributor_desc: 'गोदाम साठा आणि प्रादेशिक वितरणाचे व्यवस्थापन करा',

      about_dialog_title: 'AgriMitra बद्दल',
      about_p1: 'AgriMitra हे शेतकऱ्यांच्या प्रमुख प्रश्नांची उत्तरे शोधण्यासाठी तयार केलेले आधुनिक व्यासपीठ आहे:',
      about_quote: '“मी काय विकावे, कुठे विकावे, कधी विकावे आणि कोणाला विकावे?”',
      about_p2: 'शेतकरी, खरेदीदार आणि वाहतूकदार यांना एकत्र आणून AgriMitra मध्यस्थांची साखळी कमी करते.'
    },

    bn: {

      language: 'ভাষা',
      select_language: 'ভাষা নির্বাচন করুন',
      brand_subtext: 'বাজার বুদ্ধিমত্তা ও বাণিজ্য',
      nav_about: 'সম্পর্কে',
      nav_how_it_works: 'এটি কীভাবে কাজ করে',
      login: 'লগইন',
      register: 'নিবন্ধন',
      cancel: 'বাতিল',
      close: 'বন্ধ করুন',
      home: 'হোম',
      back_to_home: 'হোমে ফিরে যান',
      sign_out: 'সাইন আউট',
      helpline: 'হেল্পলাইন: 1800-123-AGRI',

      platform_badge: 'সর্বজনীন কৃষি বাণিজ্য পরিকাঠামো',
      hero_tagline: 'যুক্ত হোন. বাণিজ্য করুন. সমৃদ্ধ হোন.',
      hero_desc: 'কৃষকদের উন্নত বাজার খুঁজে পেতে, নির্ভরযোগ্য ক্রেতাদের সাথে যুক্ত হতে এবং খামার থেকে ডেলিভারি পর্যন্ত ফসল বিক্রয় পরিচালনা করতে সহায়তা করা।',
      ecosystem_roles_label: 'সংযুক্ত বাস্তুতন্ত্রের ভূমিকাসমূহ',

      role_farmer: 'কৃষক',
      role_buyer: 'ক্রেতা',
      role_fpo: 'এফপিও',
      role_fpo_full: 'এফপিও (কৃষক উৎপাদক সংস্থা)',
      role_distributor: 'পরিবেশক',
      role_wholesaler: 'পাইকারী বিক্রেতা',
      role_distributor_wholesaler: 'পরিবেশক / পাইকারী বিক্রেতা',
      role_delivery: 'ডেলিভারি এজেন্ট',

      chain_eyebrow: 'সম্পূর্ণ স্বচ্ছতা',
      chain_title: 'কৃষি সরবরাহ শৃঙ্খলা',
      chain_subtitle: 'স্বচ্ছ মূল্য আবিষ্কার, গুণমান মূল্যায়ন এবং সময়মতো নিষ্পত্তির নিশ্চয়তাদানকারী একটি সমন্বিত কর্মপ্রবাহ।',

      step_1_name: 'কৃষক',
      step_1_desc: 'দালালদের শোষণ ছাড়াই স্বচ্ছ বাজার দর আবিষ্কার করুন এবং ফসলের তালিকাভুক্ত করুন।',
      step_1_feat: 'ন্যায্য মূল্য আবিষ্কার →',

      step_2_name: 'কৃষিজ পণ্য',
      step_2_desc: 'যাচাইকৃত গ্রেড, আর্দ্রতার পরিমাণ এবং ফসল তোলার তারিখ সহ মানসম্মত পণ্যের তালিকা।',
      step_2_feat: 'গুণমান প্রত্যয়িত লট',

      step_3_name: 'ক্রেতা',
      step_3_desc: 'নিরাপদ বিডিং এবং সরাসরি চালানের মাধ্যমে প্রত্যয়িত কৃষিজ পণ্য সংগ্রহ করুন।',
      step_3_feat: 'যাচাইকৃত সোর্সিং →',

      step_4_name: 'ডেলিভারি',
      step_4_desc: 'জিপিএস ট্র্যাকিংয়ের মাধ্যমে সঠিক তাপমাত্রায় সময়মতো ডেলিভারি নিশ্চিত করা হয়।',
      step_4_feat: 'জিপিএস পর্যবেক্ষণকারী বহর →',

      step_5_name: 'ব্যাঙ্ক নিষ্পত্তি',
      step_5_desc: 'ডিজিটাল ডেলিভারি নিশ্চিত হওয়ার সাথে সাথে কৃষকের ব্যাঙ্ক অ্যাকাউন্টে সরাসরি টাকা স্থানান্তর।',
      step_5_feat: 'সরাসরি ব্যাঙ্ক ট্রান্সফার',

      core_eyebrow: 'বাজার বুদ্ধিমত্তা',
      core_title: 'সুচিন্তিত বিক্রয় সিদ্ধান্ত',
      core_subtitle: 'AgriMitra কৃষকদের কেবল তথ্যের পরিবর্তে বাস্তবমুখী সমাধান প্রদান করে।',

      pillar_1_title: 'কী এবং কখন বিক্রি করবেন',
      pillar_1_desc: 'ফসল তোলা ও সংরক্ষণের সিদ্ধান্ত নিতে রিয়েল-টাইম মান্ডি দর এবং মৌসুমী মূল্যের পূর্বাভাস।',

      pillar_2_title: 'কোথায় বিক্রি করবেন',
      pillar_2_desc: 'পরিবহন ব্যয় বিবেচনা করে স্থানীয় মান্ডি এবং আঞ্চলিক বাজারের মুনাফা তুলনা করার ক্যালকুলেটর।',

      pillar_3_title: 'কাকে বিক্রি করবেন',
      pillar_3_desc: 'সময়মতো অর্থ প্রদানকারী নির্ভরযোগ্য রেটিংযুক্ত যাচাইকৃত ক্রেতা এবং প্রসেসর।',

      footer_statement: 'যুক্ত হোন. বাণিজ্য করুন. সমৃদ্ধ হোন. সরাসরি বাজার সংযোগ এবং কৃষি সরবরাহ শৃঙ্খলার নির্ভরযোগ্য তথ্য।',
      footer_platform_roles: 'প্ল্যাটফর্মের ভূমিকা',
      footer_information: 'তথ্য',
      footer_about: 'AgriMitra সম্পর্কে',
      footer_supply_chain: 'সরবরাহ শৃঙ্খলার প্রবাহ',
      footer_copyright: 'AgriMitra কৃষি বাণিজ্য প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।',
      footer_subtext: 'নিরাপদ পরিকাঠামো • জনকল্যাণমূলক মান',

      login_dialog_title: 'AgriMitra-তে সাইন ইন করুন',
      demo_accounts_label: 'ডেমো অ্যাকাউন্ট (১-ক্লিক পূরণ)',
      demo_accounts_badge: 'ডেমো মূল্যায়ন মোড',
      demo_accounts_subtext: 'যাচাইকৃত ডেমো তথ্যের জন্য নিচের যেকোনো ভূমিকায় ক্লিক করুন:',
      or_enter_custom: 'অথবা আপনার বিবরণ লিখুন',
      select_role_portal: 'পোর্টাল নির্বাচন করুন',
      phone_label: 'ফোন নম্বর',
      phone_placeholder: '১০ অঙ্কের ফোন নম্বর লিখুন',
      password_label: 'পাসওয়ার্ড',
      password_placeholder: 'আপনার পাসওয়ার্ড লিখুন',
      login_to_dashboard: 'ড্যাশবোর্ডে লগইন করুন',

      portal_opt_farmer: 'কৃষক পোর্টাল ও ড্যাশবোর্ড',
      portal_opt_buyer: 'ক্রেতা ড্যাশবোর্ড ও মার্কেটপ্লেস',
      portal_opt_delivery: 'ডেলিভারি এজেন্ট পোর্টাল',
      portal_opt_distributor: 'পরিবেশক / পাইকারী বিক্রেতা ড্যাশবোর্ড',
      portal_opt_fpo: 'এফপিও পোর্টাল',

      register_dialog_title: 'AgriMitra-তে যোগ দিন',
      register_joining_as: 'আমি যুক্ত হচ্ছি:',
      reg_farmer_desc: 'ফসল বিক্রি করুন, মান্ডির দর তুলনা করুন এবং ক্রেতাদের সাথে যুক্ত হোন',
      reg_buyer_desc: 'স্বচ্ছ চুক্তির মাধ্যমে মানসম্মত কৃষিজ পণ্য সরাসরি সংগ্রহ করুন',
      reg_fpo_desc: 'সদস্যদের ফসল একত্র করে পাইকারি চুক্তি পরিচালনা করুন',
      reg_delivery_desc: 'জিপিএস ট্র্যাকিং সহ পরিবহন চুক্তি গ্রহণ করুন এবং দ্রুত পেমেন্ট পান',
      reg_distributor_desc: 'গুদামজাত পণ্য এবং আঞ্চলিক বিতরণ পরিচালনা করুন',

      about_dialog_title: 'AgriMitra সম্পর্কে',
      about_p1: 'AgriMitra হলো কৃষকদের মৌলিক সমস্যার সমাধান করার জন্য নির্মিত একটি প্রযুক্তি প্ল্যাটফর্ম:',
      about_quote: '“আমার কী বিক্রি করা উচিত, কোথায় বিক্রি করা উচিত, কখন বিক্রি করা উচিত এবং কার কাছে বিক্রি করা উচিত?”',
      about_p2: 'কৃষক, ক্রেতা ও পরিবহন অংশীদারদের সংযুক্ত করে AgriMitra মূল্যের স্থিতিশীলতা নিশ্চিত করে।'
    }
  };

  function getCurrentLanguage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && LANGUAGES[stored]) {
        return stored;
      }
    } catch (e) {
      console.warn('[AgriMitra i18n] Failed reading localStorage:', e);
    }
    return DEFAULT_LANG;
  }

  function t(key, lang) {
    const activeLang = lang || getCurrentLanguage();
    if (translations[activeLang] && translations[activeLang][key]) {
      return translations[activeLang][key];
    }
    if (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key]) {
      return translations[DEFAULT_LANG][key];
    }
    return key;
  }

  function applyTranslations(root) {
    const container = root || document;
    const currentLang = getCurrentLanguage();

    const elements = container.querySelectorAll('[data-i18n]');
    elements.forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (!key) return;

      const translated = t(key, currentLang);
      if (translated) {

        const textNodeOnly = el.getAttribute('data-i18n-text-only');
        if (textNodeOnly) {

          let textNode = null;
          for (let i = 0; i < el.childNodes.length; i++) {
            if (el.childNodes[i].nodeType === Node.TEXT_NODE && el.childNodes[i].nodeValue.trim() !== '') {
              textNode = el.childNodes[i];
              break;
            }
          }
          if (textNode) {
            textNode.nodeValue = ' ' + translated + ' ';
          } else {
            el.appendChild(document.createTextNode(' ' + translated));
          }
        } else {
          el.textContent = translated;
        }
      }
    });

    const inputs = container.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(function (input) {
      const key = input.getAttribute('data-i18n-placeholder');
      if (!key) return;
      const translated = t(key, currentLang);
      if (translated) {
        input.setAttribute('placeholder', translated);
      }
    });

    const titleEls = container.querySelectorAll('[data-i18n-title]');
    titleEls.forEach(function (el) {
      const key = el.getAttribute('data-i18n-title');
      if (!key) return;
      const translated = t(key, currentLang);
      if (translated) {
        el.setAttribute('title', translated);
      }
    });

    const ariaEls = container.querySelectorAll('[data-i18n-aria-label]');
    ariaEls.forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria-label');
      if (!key) return;
      const translated = t(key, currentLang);
      if (translated) {
        el.setAttribute('aria-label', translated);
      }
    });

    document.documentElement.lang = currentLang;

    updateSelectorDisplay(currentLang);

    ensureIndicFontsLoaded();

    autoTranslateDOM(container, currentLang);
  }

  function updateSelectorDisplay(langCode) {
    const currentLangDisplay = document.getElementById('current-lang-display');
    if (currentLangDisplay && LANGUAGES[langCode]) {
      currentLangDisplay.textContent = LANGUAGES[langCode].nativeName;
    }

    const options = document.querySelectorAll('.lang-option');
    options.forEach(function (opt) {
      const optLang = opt.getAttribute('data-lang');
      if (optLang === langCode) {
        opt.classList.add('active');
        opt.setAttribute('aria-selected', 'true');
      } else {
        opt.classList.remove('active');
        opt.setAttribute('aria-selected', 'false');
      }
    });
  }

  const PHRASE_DICTIONARY = {
  "Dashboard": {
    "hi": "डैशबोर्ड",
    "ta": "டாஷ்போர்டு",
    "ml": "ഡാഷ്‌ബോർഡ്",
    "kn": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "mr": "डॅशबोर्ड",
    "bn": "ড্যাশবোর্ড"
  },
  "Overview": {
    "hi": "अवलोकन",
    "ta": "கண்ணோட்டம்",
    "ml": "അവലോകനം",
    "kn": "ಅವಲೋಕನ",
    "mr": "विहंगावलोकन",
    "bn": "সংক্ষিপ্ত বিবরণ"
  },
  "Live Bidding": {
    "hi": "लाइव बोली",
    "ta": "நேரடி ஏலம்",
    "ml": "തത്സമയ ലേലം",
    "kn": "ಲೈವ್ ಬಿಡ್ಡಿಂಗ್",
    "mr": "थेट बोली",
    "bn": "লাইভ বিডিং"
  },
  "Orders": {
    "hi": "ऑर्डर्स",
    "ta": "ஆர்டர்கள்",
    "ml": "ഓർഡറുകൾ",
    "kn": "ಆದೇಶಗಳು",
    "mr": "ऑर्डर्स",
    "bn": "অর্ডার"
  },
  "Deliveries": {
    "hi": "वितरण",
    "ta": "டெலிவரிகள்",
    "ml": "ഡെലിവറികൾ",
    "kn": "ವಿತರಣೆಗಳು",
    "mr": "वितरण",
    "bn": "ডেলিভারি"
  },
  "Inventory": {
    "hi": "इन्वेंट्री / भंडार",
    "ta": "சரக்கு இருப்பு",
    "ml": "ഇൻവെന്ററി",
    "kn": "ದಾಸ್ತಾನು",
    "mr": "साठा / इन्व्हेंटरी",
    "bn": "ইনভেন্টরি"
  },
  "Requirements": {
    "hi": "आवश्यकताएं",
    "ta": "தேவைகள்",
    "ml": "ആവശ്യങ്ങൾ",
    "kn": "ಅಗತ್ಯಗಳು",
    "mr": "आवश्यकता",
    "bn": "প্রয়োজনীয়তা"
  },
  "Profile": {
    "hi": "प्रोफ़ाइल",
    "ta": "சுயவிவரம்",
    "ml": "പ്രൊഫൈൽ",
    "kn": "ಪ್ರೊಫೈಲ್",
    "mr": "प्रोफाइल",
    "bn": "প্রোফাইল"
  },
  "Settings": {
    "hi": "सेटिंग्स",
    "ta": "அமைப்புகள்",
    "ml": "ക്രമീകരണങ്ങൾ",
    "kn": "ಸಂಯೋಜನೆಗಳು",
    "mr": "सेटिंग्ज",
    "bn": "সেটিংস"
  },
  "Home": {
    "hi": "होम",
    "ta": "முகப்பு",
    "ml": "ഹോം",
    "kn": "ಮುಖಪುಟ",
    "mr": "मुख्यपृष्ठ",
    "bn": "হোম"
  },
  "Back": {
    "hi": "वापस",
    "ta": "பின்செல்",
    "ml": "പിന്നിലേക്ക്",
    "kn": "ಹಿಂದೆ",
    "mr": "मागे",
    "bn": "ফিরে যান"
  },
  "Back to Home": {
    "hi": "मुख्य पृष्ठ पर वापस जाएँ",
    "ta": "முகப்புக்குத் திரும்பு",
    "ml": "ഹോമിലേക്ക് മടങ്ങുക",
    "kn": "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    "mr": "मुख्यपृष्ठावर परत जा",
    "bn": "হোমে ফিরে যান"
  },
  "Sign Out": {
    "hi": "साइन आउट",
    "ta": "வெளியேறு",
    "ml": "സൈൻ ഔട്ട്",
    "kn": "ಸೈನ್ ಔಟ್",
    "mr": "साइन आउट",
    "bn": "সাইন আউট"
  },
  "Log Out": {
    "hi": "लॉग आउट",
    "ta": "வெளியேறு",
    "ml": "ലോഗ് ഔട്ട്",
    "kn": "ಲಾಗ್ ಔಟ್",
    "mr": "लॉग आउट",
    "bn": "লগ আউট"
  },
  "Login": {
    "hi": "लॉगिन",
    "ta": "உள்நுழை",
    "ml": "ലോഗിൻ",
    "kn": "ಲಾಗಿನ್",
    "mr": "लॉगिन",
    "bn": "লগইন"
  },
  "Register": {
    "hi": "पंजीकरण",
    "ta": "பதிவு செய்க",
    "ml": "രജിസ്റ്റർ ചെയ്യുക",
    "kn": "ನೋಂದಣಿ",
    "mr": "नोंदणी करा",
    "bn": "নিবন্ধন"
  },
  "Helpline": {
    "hi": "हेल्पलाइन",
    "ta": "உதவி எண்",
    "ml": "ഹെൽപ്പ്‌ലൈൻ",
    "kn": "ಸಹಾಯವಾಣಿ",
    "mr": "हेल्पलाइन",
    "bn": "হেল্পলাইন"
  },
  "Help": {
    "hi": "सहायता",
    "ta": "உதவி",
    "ml": "സഹായം",
    "kn": "ಸಹಾಯ",
    "mr": "मदत",
    "bn": "সাহায্য"
  },
  "Products": {
    "hi": "उत्पाद",
    "ta": "பொருட்கள்",
    "ml": "ഉൽപ്പന്നങ്ങൾ",
    "kn": "ಉತ್ಪನ್ನಗಳು",
    "mr": "उत्पादने",
    "bn": "পণ্য"
  },
  "Produce": {
    "hi": "उपज",
    "ta": "விளைச்சல்",
    "ml": "വിളവ്",
    "kn": "ಉತ್ಪನ್ನ / ಬೆಳೆ",
    "mr": "शेतमाल",
    "bn": "ফসল / উৎপাদন"
  },
  "Payments": {
    "hi": "भुगतान",
    "ta": "பணம் செலுத்துதல்",
    "ml": "പേയ്‌മെന്റുകൾ",
    "kn": "ಪಾವತಿಗಳು",
    "mr": "पेमेंट / देयके",
    "bn": "পেমেন্ট"
  },
  "Distance": {
    "hi": "दूरी",
    "ta": "தூரம்",
    "ml": "ദൂരം",
    "kn": "ದೂರ",
    "mr": "अंतर",
    "bn": "দূরত্ব"
  },
  "Destination": {
    "hi": "गंतव्य",
    "ta": "சேருமிடம்",
    "ml": "ലക്ഷ്യസ്ഥാനം",
    "kn": "ಗಮ್ಯಸ್ಥಾನ",
    "mr": "गंतव्यस्थान",
    "bn": "গন্তব্য"
  },
  "Farmers": {
    "hi": "किसान",
    "ta": "விவசாயிகள்",
    "ml": "കർഷകർ",
    "kn": "ರೈತರು",
    "mr": "शेतकरी",
    "bn": "কৃষক"
  },
  "Status": {
    "hi": "स्थिति",
    "ta": "நிலை",
    "ml": "നില",
    "kn": "ಸ್ಥಿತಿ",
    "mr": "स्थिती",
    "bn": "স্থিতি"
  },
  "Action": {
    "hi": "कार्रवाई",
    "ta": "நடவடிக்கை",
    "ml": "നടപടി",
    "kn": "ಕ್ರಮ",
    "mr": "कृती",
    "bn": "পদক্ষেপ"
  },
  "Quantity": {
    "hi": "मात्रा",
    "ta": "அளவு",
    "ml": "അളവ്",
    "kn": "ಪ್ರಮಾಣ",
    "mr": "प्रमाण / नग",
    "bn": "পরিমাণ"
  },
  "Starting Price": {
    "hi": "शुरुआती मूल्य",
    "ta": "தொடக்க விலை",
    "ml": "ആരംഭ വില",
    "kn": "ಆರಂಭಿಕ ಬೆಲೆ",
    "mr": "सुरुवातीची किंमत",
    "bn": "শুরুর মূল্য"
  },
  "Original Starting Price": {
    "hi": "मूल शुरुआती मूल्य",
    "ta": "அசல் தொடக்க விலை",
    "ml": "യഥാർത്ഥ ആരംഭ വില",
    "kn": "ಮೂಲ ಆರಂಭಿಕ ಬೆಲೆ",
    "mr": "मूळ सुरुवातीची किंमत",
    "bn": "আসল শুরুর দাম"
  },
  "Current Highest Bid": {
    "hi": "वर्तमान उच्चतम बोली",
    "ta": "தற்போதைய அதிகபட்ச ஏலம்",
    "ml": "നിലവിലെ ഏറ്റവും ഉയർന്ന ലേലം",
    "kn": "ಪ್ರಸ್ತುತ ಗರಿಷ್ಠ ಬಿಡ್",
    "mr": "सध्याची सर्वोच्च बोली",
    "bn": "বর্তমান সর্বোচ্চ বিড"
  },
  "Current Highest Bid:": {
    "hi": "वर्तमान उच्चतम बोली:",
    "ta": "தற்போதைய அதிகபட்ச ஏலம்:",
    "ml": "നിലവിലെ ഏറ്റവും ഉയർന്ന ലേலம்:",
    "kn": "ಪ್ರಸ್ತುತ ಗರಿಷ್ಠ ಬಿಡ್:",
    "mr": "सध्याची सर्वोच्च बोली:",
    "bn": "বর্তমান সর্বোচ্চ বিড:"
  },
  "Starting Floor:": {
    "hi": "शुरुआती आधार मूल्य:",
    "ta": "தொடக்க குறைந்தபட்ச விலை:",
    "ml": "ആരംഭ നിരക്ക്:",
    "kn": "ಆರಂಭಿಕ ಮಹಡಿ ಬೆಲೆ:",
    "mr": "सुरुवातीची आधारभूत किंमत:",
    "bn": "শুরুর বেস মূল্য:"
  },
  "Minimum Bid Increment": {
    "hi": "न्यूनतम बोली वृद्धि",
    "ta": "குறைந்தபட்ச ஏல அதிகரிப்பு",
    "ml": "കുറഞ്ഞ ലേല വർദ്ധനവ്",
    "kn": "ಕನಿಷ್ಠ ಬಿಡ್ ಏರಿಕೆ",
    "mr": "किमान बोली वाढ",
    "bn": "ন্যূনতম বিড বৃদ্ধি"
  },
  "Active Bidders": {
    "hi": "सक्रिय बोलीदाता",
    "ta": "செயலில் உள்ள ஏலதாரர்கள்",
    "ml": "സജീവ ലേലക്കാർ",
    "kn": "ಸಕ್ರಿಯ ಬಿಡ್ಡರ್‌ಗಳು",
    "mr": "सक्रिय बोली लावणारे",
    "bn": "সক্রিয় দরদাতারা"
  },
  "Trading Date": {
    "hi": "व्यापार तिथि",
    "ta": "வர்த்தக தேதி",
    "ml": "വ്യാപാര തീയതി",
    "kn": "ವ್ಯಾಪಾರದ ದಿನಾಂಕ",
    "mr": "व्यापार दिनांक",
    "bn": "ট্রেডিং তারিখ"
  },
  "Estimated Earnings": {
    "hi": "अनुमानित कमाई",
    "ta": "மதிப்பிடப்பட்ட வருவாய்",
    "ml": "കണക്കാക്കിയ വരുമാനം",
    "kn": "ಅಂದಾಜು ಗಳಿಕೆ",
    "mr": "अंदाजे कमाई",
    "bn": "আনুমানিক আয়"
  },
  "Available Produce": {
    "hi": "उपलब्ध उपज",
    "ta": "கிடைக்கும் விளைச்சல்",
    "ml": "ലഭ്യമായ വിളവ്",
    "kn": "ಲಭ್ಯವಿರುವ ಬೆಳೆ",
    "mr": "उपलब्ध शेतमाल",
    "bn": "উপলব্ধ ফসল"
  },
  "Active Bulk Lots": {
    "hi": "सक्रिय थोक लॉट",
    "ta": "செயலில் உள்ள மொத்த லாட்கள்",
    "ml": "സജീവ ബൾക്ക് ലോട്ടുകൾ",
    "kn": "ಸಕ್ರಿಯ ಬೃಹತ್ ಲಾಟ್‌ಗಳು",
    "mr": "सक्रिय मोठ्या प्रमाणातील लॉट",
    "bn": "সক্রিয় পাইকারি লট"
  },
  "Create Bulk Lot": {
    "hi": "थोक लॉट बनाएं",
    "ta": "மொத்த லாட் உருவாக்கு",
    "ml": "ബൾക്ക് ലോട്ട് ഉണ്ടാക്കുക",
    "kn": "ಬೃಹತ್ ಲಾಟ್ ರಚಿಸಿ",
    "mr": "मोठा लॉट तयार करा",
    "bn": "পাইকারি লট তৈরি করুন"
  },
  "Open Requirements": {
    "hi": "खुली आवश्यकताएं",
    "ta": "திறந்த தேவைகள்",
    "ml": "തുറന്ന ആവശ്യങ്ങൾ",
    "kn": "ತೆರೆದ ಅಗತ್ಯಗಳು",
    "mr": "खुल्या आवश्यकता",
    "bn": "উন্মুক্ত চাহিদা"
  },
  "Produce sourcing requests": {
    "hi": "उपज खरीद अनुरोध",
    "ta": "விளைச்சல் கொள்முதல் கோரிக்கைகள்",
    "ml": "വിള സംഭരണ അഭ്യർത്ഥനകൾ",
    "kn": "ಬೆಳೆ ಸಂಗ್ರಹಣಾ ವಿನಂತಿಗಳು",
    "mr": "शेतमाल खरेदी विनंत्या",
    "bn": "পণ্য সোর্সিং অনুরোধ"
  },
  "Incoming Supply": {
    "hi": "आगामी आपूर्ति",
    "ta": "உள்வரும் விநியோகம்",
    "ml": "വരുന്ന സപ്ലൈ",
    "kn": "ಆಗಮಿಸುವ ಪೂರೈಕೆ",
    "mr": "येणारा पुरवठा",
    "bn": "আসন্ন সরবরাহ"
  },
  "Current Inventory": {
    "hi": "वर्तमान इन्वेंट्री",
    "ta": "தற்போதைய இருப்பு",
    "ml": "നിലവിലെ ഇൻവെന്ററി",
    "kn": "ಪ್ರಸ್ತುತ ದಾಸ್ತಾನು",
    "mr": "सध्याचा साठा",
    "bn": "বর্তমান মজুদ"
  },
  "Active Orders": {
    "hi": "सक्रिय ऑर्डर्स",
    "ta": "செயலில் உள்ள ஆர்டர்கள்",
    "ml": "സജീവ ഓർഡറുകൾ",
    "kn": "ಸಕ್ರಿಯ ಆದೇಶಗಳು",
    "mr": "सक्रिय ऑर्डर्स",
    "bn": "সক্রিয় অর্ডার"
  },
  "In transit & dispatch": {
    "hi": "पारगमन और प्रेषण में",
    "ta": "போக்குவரத்து மற்றும் அனுப்புதலில்",
    "ml": "ട്രാൻസിറ്റിലും അയയ്ക്കലിലും",
    "kn": "ರವಾನೆ ಮತ್ತು ಸಾಗಣೆಯಲ್ಲಿ",
    "mr": "वाहतूक आणि पाठवणीमध्ये",
    "bn": "পরিবহন এবং প্রেরণে"
  },
  "My Requirements": {
    "hi": "मेरी आवश्यकताएं",
    "ta": "எனது தேவைகள்",
    "ml": "എന്റെ ആവശ്യങ്ങൾ",
    "kn": "ನನ್ನ ಅಗತ್ಯಗಳು",
    "mr": "माझ्या आवश्यकता",
    "bn": "আমার প্রয়োজনীয়তা"
  },
  "Active Procurement": {
    "hi": "सक्रिय खरीद",
    "ta": "செயலில் உள்ள கொள்முதல்",
    "ml": "സജീവ സംഭരണം",
    "kn": "ಸಕ್ರಿಯ ಸಂಗ್ರಹಣೆ",
    "mr": "सक्रिय खरेदी",
    "bn": "সক্রিয় সংগ্রহ"
  },
  "Available Supply": {
    "hi": "उपलब्ध आपूर्ति",
    "ta": "கிடைக்கும் சப்ளை",
    "ml": "ലഭ്യമായ സಪ್ಲೈ",
    "kn": "ಲಭ್ಯವಿರುವ ಪೂರೈಕೆ",
    "mr": "उपलब्ध पुरवठा",
    "bn": "উপলব্ধ সরবরাহ"
  },
  "Verified Lots": {
    "hi": "सत्यापित लॉट",
    "ta": "சரிபார்க்கப்பட்ட லாட்கள்",
    "ml": "പരിശോധിച്ച ലോട്ടുകൾ",
    "kn": "ಪರಿಶೀಲಿಸಿದ ಲಾಟ್‌ಗಳು",
    "mr": "सत्यापित लॉट्स",
    "bn": "যাচাইকৃত লট"
  },
  "Best Match": {
    "hi": "सर्वोत्तम मिलान",
    "ta": "சிறந்த பொருத்தம்",
    "ml": "മികച്ച പൊരുത്തം",
    "kn": "ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ",
    "mr": "उत्तम जुळणी",
    "bn": "সেরা মিল"
  },
  "Lowest Price": {
    "hi": "न्यूनतम मूल्य",
    "ta": "குறைந்த விலை",
    "ml": "ഏറ്റവും കുറഞ്ഞ വില",
    "kn": "ಕನಿಷ್ಠ ಬೆಲೆ",
    "mr": "सर्वात कमी किंमत",
    "bn": "সর্বনিম্ন দাম"
  },
  "Nearest": {
    "hi": "निकटतम",
    "ta": "அருகில் உள்ள",
    "ml": "ഏറ്റവും അടുത്തുള്ളത്",
    "kn": "ಅತಿ ಸಮೀಪದ",
    "mr": "सर्वात जवळचे",
    "bn": "নিকটতম"
  },
  "Largest Lot": {
    "hi": "सबसे बड़ा लॉट",
    "ta": "மிகப்பெரிய லாட்",
    "ml": "ഏറ്റവും വലിയ ലോട്ട്",
    "kn": "ದೊಡ್ಡ ಲಾಟ್",
    "mr": "सर्वात मोठा लॉट",
    "bn": "বৃহত্তম লট"
  },
  "Recommended Supply": {
    "hi": "अनुशंसित आपूर्ति",
    "ta": "பரிந்துரைக்கப்பட்ட சப்ளை",
    "ml": "ശുപാർശ ചെയ്ത സപ്ലൈ",
    "kn": "ಶಿಫಾರಸು ಮಾಡಿದ ಪೂರೈಕೆ",
    "mr": "शिफारस केलेला पुरवठा",
    "bn": "সুপারিশকৃত সরবরাহ"
  },
  "Algorithmic Match": {
    "hi": "एल्गोरिदम मिलान",
    "ta": "அல்காரிதம் பொருத்தம்",
    "ml": "അൽഗോരിതമിക് പൊരുത്തം",
    "kn": "ಅಲ್ಗಾರಿದಮಿಕ್ ಹೊಂದಾಣಿಕೆ",
    "mr": "अल्गोरिदम जुळणी",
    "bn": "অ্যালগরিদমিক মিল"
  },
  "+ Create Requirement": {
    "hi": "+ आवश्यकता दर्ज करें",
    "ta": "+ தேவையை உருவாக்கு",
    "ml": "+ ആവശ്യം ചേർക്കുക",
    "kn": "+ ಅಗತ್ಯವನ್ನು ರಚಿಸಿ",
    "mr": "+ नवीन आवश्यकता तयार करा",
    "bn": "+ নতুন চাহিদা তৈরি করুন"
  },
  "Crop": {
    "hi": "फसल",
    "ta": "பயிர்",
    "ml": "വിള",
    "kn": "ಬೆಳೆ",
    "mr": "पीक",
    "bn": "ফসল"
  },
  "Grade": {
    "hi": "ग्रेड",
    "ta": "தரம்",
    "ml": "ഗ്രേഡ്",
    "kn": "ದರ್ಜೆ",
    "mr": "प्रत / दर्जा",
    "bn": "গ্রেড"
  },
  "Grade A": {
    "hi": "ग्रेड A (उत्कृष्ट)",
    "ta": "தரம் A",
    "ml": "ഗ്രേഡ് എ",
    "kn": "ದರ್ಜೆ ಎ",
    "mr": "प्रत अ (उत्कृष्ट)",
    "bn": "গ্রেড এ"
  },
  "Grade B": {
    "hi": "ग्रेड B (मध्यम)",
    "ta": "தரம் B",
    "ml": "ഗ്രേഡ് ബി",
    "kn": "ದರ್ಜೆ ಬಿ",
    "mr": "प्रत ब (मध्यम)",
    "bn": "গ্রেড বি"
  },
  "Wheat": {
    "hi": "गेहूं",
    "ta": "கோதுமை",
    "ml": "ഗോതമ്പ്",
    "kn": "ಗೋಧಿ",
    "mr": "गहू",
    "bn": "গম"
  },
  "Premium Wheat": {
    "hi": "प्रीमियम गेहूं",
    "ta": "சிறந்த கோதுமை",
    "ml": "പ്രീമിയം ഗോതമ്പ്",
    "kn": "ಪ್ರೀಮಿಯಂ ಗೋಧಿ",
    "mr": "उत्कृष्ट प्रतीचा गहू",
    "bn": "প্রিমিয়াম গম"
  },
  "Rice": {
    "hi": "चावल",
    "ta": "அரிசி",
    "ml": "അരി",
    "kn": "ಅಕ್ಕಿ",
    "mr": "तांदूळ",
    "bn": "চাল"
  },
  "Basmati Rice": {
    "hi": "बासमती चावल",
    "ta": "பாஸ்மதி அரிசி",
    "ml": "ബസുമതി അരി",
    "kn": "ಬಾಸ್ಮತಿ ಅಕ್ಕಿ",
    "mr": "बासमती तांदूळ",
    "bn": "বাসমতি চাল"
  },
  "Paddy (Rice)": {
    "hi": "धान (चावल)",
    "ta": "நெல் (அரிசி)",
    "ml": "നെല്ല് (അരി)",
    "kn": "ಭತ್ತ (ಅಕ್ಕಿ)",
    "mr": "भात / धान",
    "bn": "ধান (চাল)"
  },
  "Tomato": {
    "hi": "टमाटर",
    "ta": "தக்காளி",
    "ml": "தக்காளி",
    "kn": "ಟೊಮೇಟೊ",
    "mr": "टोमॅटो",
    "bn": "টমেটো"
  },
  "Tomatoes": {
    "hi": "टमाटर",
    "ta": "தக்காளி",
    "ml": "தக்காளி",
    "kn": "ಟೊಮೇಟೊಗಳು",
    "mr": "टोमॅटो",
    "bn": "টমেটো"
  },
  "Onion": {
    "hi": "प्याज",
    "ta": "வெங்காயம்",
    "ml": "സവാള",
    "kn": "ಈರುಳ್ಳಿ",
    "mr": "कांदा",
    "bn": "পেঁয়াজ"
  },
  "Onions": {
    "hi": "प्याज",
    "ta": "வெங்காயம்",
    "ml": "സവാളകൾ",
    "kn": "ಈರುಳ್ಳಿಗಳು",
    "mr": "कांदे",
    "bn": "পেঁয়াজ"
  },
  "Potato": {
    "hi": "आलू",
    "ta": "உருளைக்கிழங்கு",
    "ml": "உരുളക്കിഴങ്ങ്",
    "kn": "ಆಲೂಗಡ್ಡೆ",
    "mr": "बटाटा",
    "bn": "আলু"
  },
  "Potatoes": {
    "hi": "आलू",
    "ta": "உருளைக்கிழங்கு",
    "ml": "உരുളക്കിഴങ്ങുകൾ",
    "kn": "ಆಲೂಗಡ್ಡೆಗಳು",
    "mr": "बटाटे",
    "bn": "আলু"
  },
  "Fresh Potatoes": {
    "hi": "ताजा आलू",
    "ta": "புதிய உருளைக்கிழங்கு",
    "ml": "ഫ്രഷ് ഉരുളക്കിഴങ്ങ്",
    "kn": "ತಾಜಾ ಆಲೂಗಡ್ಡೆ",
    "mr": "ताजे बटाटे",
    "bn": "তাজা আলু"
  },
  "Cotton": {
    "hi": "कपास",
    "ta": "பருத்தி",
    "ml": "പരുத்தி",
    "kn": "ಹತ್ತಿ",
    "mr": "कापूस",
    "bn": "তুলা"
  },
  "Sugarcane": {
    "hi": "गन्ना",
    "ta": "கரும்பு",
    "ml": "കരിമ്പ്",
    "kn": "ಕಬ್ಬು",
    "mr": "ऊस",
    "bn": "আখ"
  },
  "Maize": {
    "hi": "मक्का",
    "ta": "மக்காச்சோளம்",
    "ml": "മക്കച്ചോളം",
    "kn": "ಮೆಕ್ಕೆಜೋಳ",
    "mr": "मका",
    "bn": "ভুট্টা"
  },
  "Vegetables": {
    "hi": "सब्जियां",
    "ta": "காய்கறிகள்",
    "ml": "പച്ചക്കറികൾ",
    "kn": "ತರಕಾರಿಗಳು",
    "mr": "भाजीपाला",
    "bn": "শাকসবজি"
  },
  "Fresh Vegetables": {
    "hi": "ताजा सब्जियां",
    "ta": "புதிய காய்கறிகள்",
    "ml": "പുതിയ പച്ചക്കറികൾ",
    "kn": "ತಾಜಾ ತರಕಾರಿಗಳು",
    "mr": "ताजा भाजीपाला",
    "bn": "তাজা শাকসবজি"
  },
  "Fruits": {
    "hi": "फल",
    "ta": "பழங்கள்",
    "ml": "പഴങ്ങൾ",
    "kn": "ಹಣ್ಣುಗಳು",
    "mr": "फळे",
    "bn": "ফলমূল"
  },
  "Seasonal Fruits": {
    "hi": "मौसमी फल",
    "ta": "பருவகால பழங்கள்",
    "ml": "സീസണൽ പഴങ്ങൾ",
    "kn": "ಕಾಲೋಚಿತ ಹಣ್ಣುಗಳು",
    "mr": "हंगामी फळे",
    "bn": "মৌসুমি ফল"
  },
  "Whole Grains & Pulses": {
    "hi": "अनाज और दालें",
    "ta": "தானியங்கள் & பருப்பு வகைகள்",
    "ml": "ധാന്യങ്ങളും പയറുവർഗ്ഗങ്ങളും",
    "kn": "ಧಾನ್ಯಗಳು ಮತ್ತು ಬೇಳೆಕಾಳುಗಳು",
    "mr": "धान्य आणि कडधान्ये",
    "bn": "দানাশস্য ও ডাল"
  },
  "Bulk Event Ordering": {
    "hi": "थोक आयोजन ऑर्डरिंग",
    "ta": "மொத்த நிகழ்வு ஆர்டர்கள்",
    "ml": "ബൾക്ക് ഇവന്റ് ഓർഡറിംഗ്",
    "kn": "ಬೃಹತ್ ಈವೆಂಟ್ ಆರ್ಡರಿಂಗ್",
    "mr": "मोठ्या समारंभांसाठी घाऊक ऑर्डर",
    "bn": "বাল্ক ইভেন্ট অর্ডারিং"
  },
  "Active": {
    "hi": "सक्रिय",
    "ta": "செயலில்",
    "ml": "സജീവം",
    "kn": "ಸಕ್ರಿಯ",
    "mr": "सक्रिय",
    "bn": "সক্রিয়"
  },
  "Pending": {
    "hi": "लंबित",
    "ta": "நிலுவையில்",
    "ml": "തീർപ്പുകൽപ്പിക്കാത്തത്",
    "kn": "ಬಾಕಿ ಇದೆ",
    "mr": "प्रलंबित",
    "bn": "অপেক্ষমান"
  },
  "Completed": {
    "hi": "पूर्ण",
    "ta": "முடிந்தது",
    "ml": "പൂർത്തിയായി",
    "kn": "ಪೂರ್ಣಗೊಂಡಿದೆ",
    "mr": "पूर्ण झाले",
    "bn": "সম্পন্ন"
  },
  "Delivered": {
    "hi": "वितरित (डिलीवर)",
    "ta": "டெலிவரி செய்யப்பட்டது",
    "ml": "ഡെലിവർ ചെയ്തു",
    "kn": "ವಿತರಿಸಲಾಗಿದೆ",
    "mr": "पोहोचवले (डिलिव्हर)",
    "bn": "বিতরিত"
  },
  "In Transit": {
    "hi": "रास्ते में (ट्रांजिट)",
    "ta": "வழியில் உள்ளது",
    "ml": "വഴിയിലാണ്",
    "kn": "ಸಾಗಣೆಯಲ್ಲಿದೆ",
    "mr": "मार्गावर आहे",
    "bn": "পরিবহনে আছে"
  },
  "Available": {
    "hi": "उपलब्ध",
    "ta": "கிடைக்கக்கூடியது",
    "ml": "ലഭ്യമാണ്",
    "kn": "ಲಭ್ಯವಿದೆ",
    "mr": "उपलब्ध",
    "bn": "উপলব্ধ"
  },
  "Open": {
    "hi": "खुला",
    "ta": "திறந்த",
    "ml": "തുറന്നത്",
    "kn": "ತೆರೆದಿದೆ",
    "mr": "उघडे",
    "bn": "উন্মুক্ত"
  },
  "Upcoming": {
    "hi": "आगामी",
    "ta": "வரவிருக்கும்",
    "ml": "വരാനിരിക്കുന്നത്",
    "kn": "ಮುಂಬರುವ",
    "mr": "आगामी",
    "bn": "আসন্ন"
  },
  "UPCOMING": {
    "hi": "आगामी",
    "ta": "வரவிருக்கும்",
    "ml": "വരാനിരിക്കുന്നത്",
    "kn": "ಮುಂಬರುವ",
    "mr": "आगामी",
    "bn": "আসন্ন"
  },
  "Close": {
    "hi": "बंद करें",
    "ta": "மூடு",
    "ml": "അടയ്ക്കുക",
    "kn": "ಮುಚ್ಚಿ",
    "mr": "बंद करा",
    "bn": "বন্ধ করুন"
  },
  "Cancel": {
    "hi": "रद्द करें",
    "ta": "ரத்து செய்",
    "ml": "റദ്ദാക്കുക",
    "kn": "ರದ್ದುಮಾಡಿ",
    "mr": "रद्द करा",
    "bn": "বাতিল করুন"
  },
  "View": {
    "hi": "देखें",
    "ta": "பார்",
    "ml": "കാണുക",
    "kn": "ವೀಕ್ಷಿಸಿ",
    "mr": "पहा",
    "bn": "দেখুন"
  },
  "View Details": {
    "hi": "विवरण देखें",
    "ta": "விவரங்களை காண்க",
    "ml": "വിശദാംശങ്ങൾ കാണുക",
    "kn": "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    "mr": "तपशील पहा",
    "bn": "বিস্তারিত দেখুন"
  },
  "Refresh": {
    "hi": "ताज़ा करें",
    "ta": "புதுப்பி",
    "ml": "പുതുക്കുക",
    "kn": "ನವೀಕರಿಸಿ",
    "mr": "रिफ्रेश करा",
    "bn": "রিফ্রেশ"
  },
  "Offer": {
    "hi": "प्रस्ताव",
    "ta": "சலுகை",
    "ml": "ഓഫർ",
    "kn": "ಆಫರ್",
    "mr": "ऑफर",
    "bn": "অফার"
  },
  "Release": {
    "hi": "जारी करें",
    "ta": "வெளியிடு",
    "ml": "റിലീസ് ചെയ്യുക",
    "kn": "ಬಿಡುಗಡೆ ಮಾಡಿ",
    "mr": "मुक्त करा",
    "bn": "মুক্তি দিন"
  },
  "Distributor Dashboard | AgriMitra": {
    "hi": "AgriMitra | वितरक डैशबोर्ड",
    "ta": "AgriMitra | விநியோகஸ்தர் டாஷ்போர்டு",
    "ml": "AgriMitra | വിതരണക്കാരന്റെ ഡാഷ്‌ബോർഡ്",
    "kn": "AgriMitra | ವಿತರಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "mr": "AgriMitra | वितरक डॅशबोर्ड",
    "bn": "AgriMitra | ডিস্ট্রিবিউটর ড্যাশবোর্ড"
  },
  "Buyer Dashboard | AgriMitra": {
    "hi": "AgriMitra | क्रेता डैशबोर्ड",
    "ta": "AgriMitra | வாங்குபவர் டாஷ்போர்டு",
    "ml": "AgriMitra | വാങ്ങുന്നയാളുടെ ഡാഷ്‌ബോർഡ്",
    "kn": "AgriMitra | ಖರೀದಿದಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "mr": "AgriMitra | खरेदीदार डॅशबोर्ड",
    "bn": "AgriMitra | ক্রেতা ড্যাশবোর্ড"
  },
  "Farmer Dashboard | AgriMitra": {
    "hi": "AgriMitra | किसान डैशबोर्ड",
    "ta": "AgriMitra | விவசாயி டாஷ்போர்டு",
    "ml": "AgriMitra | കർഷക ഡാഷ്‌ബോർഡ്",
    "kn": "AgriMitra | ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "mr": "AgriMitra | शेतकरी डॅशबोर्ड",
    "bn": "AgriMitra | কৃষক ড্যাশবোর্ড"
  },
  "FPO Dashboard | AgriMitra": {
    "hi": "AgriMitra | FPO डैशबोर्ड",
    "ta": "AgriMitra | FPO டாஷ்போர்டு",
    "ml": "AgriMitra | എഫ്.പി.ഒ ഡാഷ്‌ബോർഡ്",
    "kn": "AgriMitra | ಎಫ್‌ಪಿಒ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "mr": "AgriMitra | एफपीओ डॅशबोर्ड",
    "bn": "AgriMitra | এফপিও ড্যাশবোর্ড"
  },
  "Delivery Dashboard | AgriMitra": {
    "hi": "AgriMitra | डिलीवरी डैशबोर्ड",
    "ta": "AgriMitra | டெலிவரி டாஷ்போர்டு",
    "ml": "AgriMitra | ഡെലിവറി ഡാഷ്‌ബോർഡ്",
    "kn": "AgriMitra | ಡೆಲಿವರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "mr": "AgriMitra | डिलिव्हरी डॅशबोर्ड",
    "bn": "AgriMitra | ডেলিভারি ড্যাশবোর্ড"
  },
  "Farmer Portal": {
    "hi": "किसान पोर्टल",
    "ta": "விவசாயி போர்டல்",
    "ml": "കർഷക പോർട്ടൽ",
    "kn": "ರೈತ ಪೋರ್ಟಲ್",
    "mr": "शेतकरी पोर्टल",
    "bn": "কৃষক পোর্টাল"
  },
  "Buyer Portal": {
    "hi": "क्रेता पोर्टल",
    "ta": "வாங்குபவர் போர்டல்",
    "ml": "വാങ്ങുന്നയാളുടെ പോർട്ടൽ",
    "kn": "ಖರೀದಿದಾರರ ಪೋರ್ಟಲ್",
    "mr": "खरेदीदार पोर्टल",
    "bn": "ক্রেতা পোর্টাল"
  },
  "FPO Portal": {
    "hi": "एफपीओ पोर्टल",
    "ta": "FPO போர்டல்",
    "ml": "എഫ്.പി.ഒ പോർട്ടൽ",
    "kn": "ಎಫ್‌ಪಿಒ ಪೋರ್ಟಲ್",
    "mr": "एफपीओ पोर्टल",
    "bn": "এফপিও পোর্টাল"
  },
  "Distributor Portal": {
    "hi": "वितरक पोर्टल",
    "ta": "விநியோகஸ்தர் போர்டல்",
    "ml": "വിതരണ പോർട്ടൽ",
    "kn": "ವಿತರಕರ ಪೋರ್ಟಲ್",
    "mr": "वितरक पोर्टल",
    "bn": "ডিস্ট্রিবিউটর পোর্টাল"
  },
  "Delivery Agent Portal": {
    "hi": "डिलीवरी एजेंट पोर्टल",
    "ta": "டெலிவரி ஏஜென்ட் போர்டல்",
    "ml": "ഡെലിവറി ഏജന്റ് പോർട്ടൽ",
    "kn": "ಡೆಲಿವರಿ ಏಜೆಂಟ್ ಪೋರ್ಟಲ್",
    "mr": "डिलिव्हरी एजंट पोर्टल",
    "bn": "ডেলিভারি এজেন্ট পোর্টাল"
  },
  "My Active Produce": {
    "hi": "मेरी सक्रिय उपज",
    "ta": "எனது செயலில் உள்ள விளைச்சல்",
    "ml": "എന്റെ സജീവ വിളവ്",
    "kn": "ನನ್ನ ಸಕ್ರಿಯ ಬೆಳೆ",
    "mr": "माझा सक्रिय शेतमाल",
    "bn": "আমার সক্রিয় ফসল"
  },
  "Buyer Offers & Orders": {
    "hi": "क्रेता प्रस्ताव और आदेश",
    "ta": "வாங்குபவர் சலுகைகள் & ஆர்டர்கள்",
    "ml": "വാങ്ങുന്നയാളുടെ ഓഫറുകളും ഓർഡറുകളും",
    "kn": "ಖರೀದಿದಾರರ ಆಫರ್‌ಗಳು ಮತ್ತು ಆದೇಶಗಳು",
    "mr": "खरेदीदार ऑफर आणि ऑर्डर्स",
    "bn": "ক্রেতার প্রস্তাব ও অর্ডার"
  },
  "Today's Mandi Bhav": {
    "hi": "आज का मंडी भाव",
    "ta": "இன்றைய மண்டி விலை",
    "ml": "ഇന്നത്തെ മണ്ടി നിരക്കുകൾ",
    "kn": "ಇಂದಿನ ಮಂಡಿ ದರಗಳು",
    "mr": "आजचा मंडी भाव",
    "bn": "আজকের মান্ডি দর"
  },
  "Direct Bank Payouts": {
    "hi": "प्रत्यक्ष बैंक भुगतान",
    "ta": "நேரடி வங்கிப் பணம்",
    "ml": "നേരിട്ടുള്ള ബാങ്ക് പേഔട്ടുകൾ",
    "kn": "ನೇರ ಬ್ಯಾಂಕ್ ಪಾವತಿಗಳು",
    "mr": "थेट बँक खात्यात रक्कम",
    "bn": "সরাসরি ব্যাংক পেআউট"
  },
  "Sell Crop / List Produce": {
    "hi": "फसल बेचें / उपज सूचीबद्ध करें",
    "ta": "பயிர் விற்க / விளைச்சலை பட்டியலிடுக",
    "ml": "വിള വിൽക്കുക / വിളവ് പട്ടികപ്പെടുത്തുക",
    "kn": "ಬೆಳೆ ಮಾರಿ / ಉತ್ಪನ್ನ ಪಟ್ಟಿ ಮಾಡಿ",
    "mr": "पीक विका / शेतमाल नोंदवा",
    "bn": "ফসল বিক্রি করুন / তালিকাভুক্ত করুন"
  },
  "Mandi Trading Intelligence": {
    "hi": "मंडी व्यापार आसूचना",
    "ta": "மண்டி வர்த்தக நுண்ணறிவு",
    "ml": "മണ്ടി ട്രേഡിംഗ് ഇന്റലിജൻസ്",
    "kn": "ಮಂಡಿ ವ್ಯಾಪಾರ ಮಾಹಿತಿ",
    "mr": "मंडी व्यापार गुप्तवार्ता",
    "bn": "মান্ডি ট্রেডিং বুদ্ধিমত্তা"
  },
  "Connect. Trade. Grow.": {
    "hi": "जुड़ें. व्यापार करें. आगे बढ़ें.",
    "ta": "இணையுங்கள். வர்த்தகம் செய்யுங்கள். வளருங்கள்.",
    "ml": "ബന്ധപ്പെടുക. വ്യാപാരം ചെയ്യുക. വളരുക.",
    "kn": "ಸಂಪರ್ಕಿಸಿ. ವ್ಯಾಪಾರ ಮಾಡಿ. ಬೆಳೆಯಿರಿ.",
    "mr": "जोडा. व्यापार करा. प्रगती करा.",
    "bn": "যুক্ত হোন. বাণিজ্য করুন. এগিয়ে যান."
  }
};

  const WORD_DICTIONARY = {
  "kg": {
    "hi": "किग्रा",
    "ta": "கிலோ",
    "ml": "കിലോഗ്രാം",
    "kn": "ಕೆಜಿ",
    "mr": "किलो",
    "bn": "কেজি"
  },
  "tonnes": {
    "hi": "टन",
    "ta": "டன்கள்",
    "ml": "ടൺ",
    "kn": "ಟನ್ಗಳು",
    "mr": "टन",
    "bn": "টন"
  },
  "tonne": {
    "hi": "टन",
    "ta": "டன்",
    "ml": "ടൺ",
    "kn": "ಟನ್",
    "mr": "टन",
    "bn": "টন"
  },
  "quintal": {
    "hi": "क्विंटल",
    "ta": "குவிண்டால்",
    "ml": "ക്വിന്റൽ",
    "kn": "ಕ್ವಿಂಟಾಲ್",
    "mr": "क्विंटल",
    "bn": "কুইন্টাল"
  },
  "quintals": {
    "hi": "क्विंटल",
    "ta": "குவிண்டால்கள்",
    "ml": "ക്വിന്റലുകൾ",
    "kn": "ಕ್ವಿಂಟಾಲ್‌ಗಳು",
    "mr": "क्विंटल",
    "bn": "কুইন্টাল"
  },
  "km": {
    "hi": "किमी",
    "ta": "கி.மீ",
    "ml": "കി.മീ",
    "kn": "ಕಿ.ಮೀ",
    "mr": "किमी",
    "bn": "কিমি"
  },
  "hours": {
    "hi": "घंटे",
    "ta": "மணிநேரம்",
    "ml": "മണിക്കൂർ",
    "kn": "ಗಂಟೆಗಳು",
    "mr": "तास",
    "bn": "ঘন্টা"
  },
  "hour": {
    "hi": "घंटा",
    "ta": "மணி",
    "ml": "മണിക്കൂർ",
    "kn": "ಗಂಟೆ",
    "mr": "तास",
    "bn": "ঘন্টা"
  },
  "minutes": {
    "hi": "मिनट",
    "ta": "நிமிடங்கள்",
    "ml": "മിനിറ്റുകൾ",
    "kn": "ನಿಮಿಷಗಳು",
    "mr": "मिनिटे",
    "bn": "মিনিট"
  },
  "days": {
    "hi": "दिन",
    "ta": "நாட்கள்",
    "ml": "ദിവസങ്ങൾ",
    "kn": "ದಿನಗಳು",
    "mr": "दिवस",
    "bn": "দিন"
  },
  "day": {
    "hi": "दिन",
    "ta": "நாள்",
    "ml": "ദിവസം",
    "kn": "ದಿನ",
    "mr": "दिवस",
    "bn": "দিন"
  },
  "search": {
    "hi": "खोजें",
    "ta": "தேடு",
    "ml": "തിരയുക",
    "kn": "ಹುಡುಕಿ",
    "mr": "शोधा",
    "bn": "অনুসন্ধান"
  },
  "filter": {
    "hi": "फ़िल्टर",
    "ta": "வடிகட்டு",
    "ml": "ഫിൽട്ടർ",
    "kn": "ಫಿಲ್ಟರ್",
    "mr": "फिल्टर",
    "bn": "ফিল্টার"
  },
  "sort": {
    "hi": "क्रमबद्ध करें",
    "ta": "வரிசைப்படுத்து",
    "ml": "ക്രമീകരിക്കുക",
    "kn": "ವಿಂಗಡಿಸಿ",
    "mr": "क्रमवारी लावा",
    "bn": "সাজান"
  },
  "view": {
    "hi": "देखें",
    "ta": "பார்",
    "ml": "കാണുക",
    "kn": "ವೀಕ್ಷಿಸಿ",
    "mr": "पहा",
    "bn": "দেখুন"
  },
  "details": {
    "hi": "विवरण",
    "ta": "விவரங்கள்",
    "ml": "വിശദാംശങ്ങൾ",
    "kn": "ವಿವರಗಳು",
    "mr": "तपशील",
    "bn": "বিস্তারিত"
  },
  "close": {
    "hi": "बंद करें",
    "ta": "மூடு",
    "ml": "അടയ്ക്കുക",
    "kn": "ಮುಚ್ಚಿ",
    "mr": "बंद करा",
    "bn": "বন্ধ করুন"
  },
  "cancel": {
    "hi": "रद्द करें",
    "ta": "ரத்து செய்",
    "ml": "റദ്ദാക്കുക",
    "kn": "ರದ್ದುಮಾಡಿ",
    "mr": "रद्द करा",
    "bn": "বাতিল করুন"
  },
  "submit": {
    "hi": "जमा करें",
    "ta": "சமர்ப்பி",
    "ml": "സമർപ്പിക്കുക",
    "kn": "ಸಲ್ಲಿಸಿ",
    "mr": "सादर करा",
    "bn": "জমা দিন"
  },
  "save": {
    "hi": "सहेजें",
    "ta": "சேமி",
    "ml": "സേവ് ചെയ്യുക",
    "kn": "ಉಳಿಸಿ",
    "mr": "जतन करा",
    "bn": "সংরক্ষণ করুন"
  },
  "edit": {
    "hi": "संपादित करें",
    "ta": "திருத்து",
    "ml": "തിരുത്തുക",
    "kn": "ತಿದ್ದು",
    "mr": "संपादित करा",
    "bn": "সম্পাদনা করুন"
  },
  "delete": {
    "hi": "हटाएं",
    "ta": "நீக்கு",
    "ml": "ഇല്ലാതാക്കുക",
    "kn": "ಅಳಿಸಿ",
    "mr": "हटवा",
    "bn": "মুছুন"
  },
  "download": {
    "hi": "डाउनलोड",
    "ta": "பதிவிறக்கு",
    "ml": "ഡൗൺലോഡ്",
    "kn": "ಡೌನ್‌ಲೋಡ್",
    "mr": "डाउनलोड करा",
    "bn": "ডাউনলোড"
  },
  "confirm": {
    "hi": "पुष्टि करें",
    "ta": "உறுதிப்படுத்து",
    "ml": "സ്ഥിരീകരിക്കുക",
    "kn": "ದೃಢೀಕರಿಸಿ",
    "mr": "पुष्टी करा",
    "bn": "নিশ্চিত করুন"
  },
  "continue": {
    "hi": "जारी रखें",
    "ta": "தொடரவும்",
    "ml": "തുടരുക",
    "kn": "ಮುಂದುವರಿಸಿ",
    "mr": "पुढे चालू ठेवा",
    "bn": "চালিয়ে যান"
  },
  "next": {
    "hi": "अगला",
    "ta": "அடுத்து",
    "ml": "അടുത്തത്",
    "kn": "ಮುಂದಿನದು",
    "mr": "पुढील",
    "bn": "পরবর্তী"
  },
  "previous": {
    "hi": "पिछला",
    "ta": "முந்தைய",
    "ml": "മുമ്പത്തെ",
    "kn": "ಹಿಂದಿನದು",
    "mr": "मागील",
    "bn": "পূর্ববর্তী"
  },
  "active": {
    "hi": "सक्रिय",
    "ta": "செயலில்",
    "ml": "സജീവം",
    "kn": "ಸಕ್ರಿಯ",
    "mr": "सक्रिय",
    "bn": "সক্রিয়"
  },
  "pending": {
    "hi": "लंबित",
    "ta": "நிலுவையில்",
    "ml": "തീർപ്പുകൽപ്പിക്കാത്തത്",
    "kn": "ಬಾಕಿ ಇದೆ",
    "mr": "प्रलंबित",
    "bn": "অপেক্ষমান"
  },
  "completed": {
    "hi": "पूर्ण",
    "ta": "முடிந்தது",
    "ml": "പൂർത്തിയായി",
    "kn": "ಪೂರ್ಣಗೊಂಡಿದೆ",
    "mr": "पूर्ण झाले",
    "bn": "সম্পন্ন"
  },
  "verified": {
    "hi": "सत्यापित",
    "ta": "சரிபார்க்கப்பட்டது",
    "ml": "പരിശോധിച്ചു",
    "kn": "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "mr": "सत्यापित",
    "bn": "যাচাইকৃত"
  },
  "open": {
    "hi": "खुला",
    "ta": "திறந்த",
    "ml": "തുറന്നത്",
    "kn": "ತೆರೆದಿದೆ",
    "mr": "उघडे",
    "bn": "উন্মুক্ত"
  },
  "all": {
    "hi": "सभी",
    "ta": "அனைத்தும்",
    "ml": "എല്ലാം",
    "kn": "ಎಲ್ಲಾ",
    "mr": "सर्व",
    "bn": "সমস্ত"
  },
  "new": {
    "hi": "नया",
    "ta": "புதிய",
    "ml": "പുതിയത്",
    "kn": "ಹೊಸ",
    "mr": "नवीन",
    "bn": "নতুন"
  },
  "live": {
    "hi": "लाइव",
    "ta": "நேரடி",
    "ml": "തത്സമയം",
    "kn": "ಲೈವ್",
    "mr": "थेट (लाईव्ह)",
    "bn": "লাইভ"
  },
  "home": {
    "hi": "होम",
    "ta": "முகப்பு",
    "ml": "ഹോം",
    "kn": "ಮುಖಪುಟ",
    "mr": "मुख्यपृष्ठ",
    "bn": "হোম"
  },
  "dashboard": {
    "hi": "डैशबोर्ड",
    "ta": "டாஷ்போர்டு",
    "ml": "ഡാഷ്‌ബോർഡ്",
    "kn": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "mr": "डॅशबोर्ड",
    "bn": "ড্যাশবোর্ড"
  },
  "overview": {
    "hi": "अवलोकन",
    "ta": "கண்ணோட்டம்",
    "ml": "അവലോകനം",
    "kn": "ಅವಲೋಕನ",
    "mr": "विहंगावलोकन",
    "bn": "সংক্ষিপ্ত বিবরণ"
  },
  "profile": {
    "hi": "प्रोफ़ाइल",
    "ta": "சுயவிவரம்",
    "ml": "പ്രൊഫൈൽ",
    "kn": "ಪ್ರೊಫೈಲ್",
    "mr": "प्रोफाइल",
    "bn": "প্রোফাইল"
  },
  "orders": {
    "hi": "ऑर्डर्स",
    "ta": "ஆர்டர்கள்",
    "ml": "ഓർഡറുകൾ",
    "kn": "ಆದೇಶಗಳು",
    "mr": "ऑर्डर्स",
    "bn": "অর্ডার"
  },
  "order": {
    "hi": "ऑर्डर",
    "ta": "ஆர்டர்",
    "ml": "ഓർഡർ",
    "kn": "ಆದೇಶ",
    "mr": "ऑर्डर",
    "bn": "অর্ডার"
  },
  "bids": {
    "hi": "बोलियां",
    "ta": "ஏலங்கள்",
    "ml": "ലേലങ്ങൾ",
    "kn": "ಬಿಡ್‌ಗಳು",
    "mr": "बोली",
    "bn": "বিড"
  },
  "bid": {
    "hi": "बोली",
    "ta": "ஏலம்",
    "ml": "ലേலம்",
    "kn": "ಬಿಡ್",
    "mr": "बोली",
    "bn": "বিড"
  },
  "bidding": {
    "hi": "बोली",
    "ta": "ஏலம்",
    "ml": "ലേலம்",
    "kn": "ಬಿಡ್ಡಿಂಗ್",
    "mr": "बोली प्रक्रिया",
    "bn": "বিডিং"
  },
  "bidders": {
    "hi": "बोलीदाता",
    "ta": "ஏலதாரர்கள்",
    "ml": "ലേലക്കാർ",
    "kn": "ಬಿಡ್ಡರ್‌ಗಳು",
    "mr": "बोली लावणारे",
    "bn": "দরদাতারা"
  },
  "bidder": {
    "hi": "बोलीदाता",
    "ta": "ஏலதாரர்",
    "ml": "ലേലக்காரன்",
    "kn": "ಬಿಡ್ಡರ್",
    "mr": "बोली लावणारा",
    "bn": "দরদাতা"
  },
  "price": {
    "hi": "मूल्य / दर",
    "ta": "விலை",
    "ml": "വില",
    "kn": "ಬೆಲೆ",
    "mr": "किंमत / दर",
    "bn": "মূল্য"
  },
  "prices": {
    "hi": "कीमतें",
    "ta": "விலைகள்",
    "ml": "വിലകൾ",
    "kn": "ಬೆಲೆಗಳು",
    "mr": "किमती",
    "bn": "মূল্যসমূহ"
  },
  "rate": {
    "hi": "दर",
    "ta": "விகிதம்",
    "ml": "നിരക്ക്",
    "kn": "ದರ",
    "mr": "दर",
    "bn": "দর"
  },
  "rates": {
    "hi": "दरें",
    "ta": "விகிதங்கள்",
    "ml": "നിരക്കുകൾ",
    "kn": "ದರಗಳು",
    "mr": "दर",
    "bn": "দরসমূহ"
  },
  "quantity": {
    "hi": "मात्रा",
    "ta": "அளவு",
    "ml": "അളവ്",
    "kn": "ಪ್ರಮಾಣ",
    "mr": "प्रमाण / नग",
    "bn": "পরিমাণ"
  },
  "status": {
    "hi": "स्थिति",
    "ta": "நிலை",
    "ml": "നില",
    "kn": "ಸ್ಥಿತಿ",
    "mr": "स्थिती",
    "bn": "স্থিতি"
  },
  "action": {
    "hi": "कार्रवाई",
    "ta": "நடவடிக்கை",
    "ml": "നടപടി",
    "kn": "ಕ್ರಮ",
    "mr": "कृती",
    "bn": "পদক্ষেপ"
  },
  "total": {
    "hi": "कुल",
    "ta": "மொத்தம்",
    "ml": "ആകെ",
    "kn": "ಒಟ್ಟು",
    "mr": "एकूण",
    "bn": "মোট"
  },
  "amount": {
    "hi": "राशि",
    "ta": "தொகை",
    "ml": "തുക",
    "kn": "ಮೊತ್ತ",
    "mr": "रक्कम",
    "bn": "পরিমাণ"
  },
  "date": {
    "hi": "तारीख",
    "ta": "தேதி",
    "ml": "തീയതി",
    "kn": "ದಿನಾಂಕ",
    "mr": "दिनांक",
    "bn": "তারিখ"
  },
  "time": {
    "hi": "समय",
    "ta": "நேரம்",
    "ml": "സമയം",
    "kn": "ಸಮಯ",
    "mr": "वेळ",
    "bn": "সময়"
  },
  "location": {
    "hi": "स्थान",
    "ta": "இடம்",
    "ml": "സ്ഥലം",
    "kn": "ಸ್ಥಳ",
    "mr": "स्थान",
    "bn": "অবস্থান"
  },
  "state": {
    "hi": "राज्य",
    "ta": "மாநிலம்",
    "ml": "സംസ്ഥാനം",
    "kn": "ರಾಜ್ಯ",
    "mr": "राज्य",
    "bn": "রাজ্য"
  },
  "district": {
    "hi": "ज़िला",
    "ta": "மாவட்டம்",
    "ml": "ജില്ല",
    "kn": "ಜಿಲ್ಲೆ",
    "mr": "जिल्हा",
    "bn": "জেলা"
  },
  "address": {
    "hi": "पता",
    "ta": "முகவரி",
    "ml": "മേൽவിലാസം",
    "kn": "ವಿಳಾಸ",
    "mr": "पत्ता",
    "bn": "ঠিকানা"
  },
  "phone": {
    "hi": "फ़ोन",
    "ta": "தொலைபேசி",
    "ml": "ഫോൺ",
    "kn": "ದೂರವಾಣಿ",
    "mr": "फोन",
    "bn": "ফোন"
  },
  "mobile": {
    "hi": "मोबाइल",
    "ta": "மொபைல்",
    "ml": "മൊബൈൽ",
    "kn": "ಮೊಬೈಲ್",
    "mr": "मोबाईल",
    "bn": "মোবাইল"
  },
  "email": {
    "hi": "ईमेल",
    "ta": "மின்னஞ்சல்",
    "ml": "ഇമെയിൽ",
    "kn": "ಇಮೇಲ್",
    "mr": "ईमेल",
    "bn": "ইমেইল"
  },
  "password": {
    "hi": "पासवर्ड",
    "ta": "கடவுச்சொல்",
    "ml": "പാസ്‌വേഡ്",
    "kn": "ಪಾಸ್‌ವರ್ಡ್",
    "mr": "पासवर्ड",
    "bn": "পাসওয়ার্ড"
  },
  "name": {
    "hi": "नाम",
    "ta": "பெயர்",
    "ml": "പേര്",
    "kn": "ಹೆಸರು",
    "mr": "नाव",
    "bn": "নাম"
  },
  "user": {
    "hi": "उपयोगकर्ता",
    "ta": "பயனர்",
    "ml": "ഉപയോക്താവ്",
    "kn": "ಬಳಕೆದಾರ",
    "mr": "वापरकर्ता",
    "bn": "ব্যবহারকারী"
  },
  "account": {
    "hi": "खाता",
    "ta": "கணக்கு",
    "ml": "അക്കൗണ്ട്",
    "kn": "ಖಾತೆ",
    "mr": "खाते",
    "bn": "অ্যাকাউন্ট"
  },
  "bank": {
    "hi": "बैंक",
    "ta": "வங்கி",
    "ml": "ബാങ്ക്",
    "kn": "ಬ್ಯಾಂಕ್",
    "mr": "बँक",
    "bn": "ব্যাংক"
  },
  "payment": {
    "hi": "भुगतान",
    "ta": "பணம் செலுத்துதல்",
    "ml": "പേയ്‌മെന്റ്",
    "kn": "ಪಾವತಿ",
    "mr": "पेमेंट",
    "bn": "পেমেন্ট"
  },
  "payments": {
    "hi": "भुगतान",
    "ta": "பணம் செலுத்துதல்",
    "ml": "പേയ്‌മെന്റുകൾ",
    "kn": "ಪಾವತಿಗಳು",
    "mr": "पेमेंट्स",
    "bn": "পেমেন্ট"
  },
  "settlement": {
    "hi": "निपटान",
    "ta": "செட்டில்மென்ட்",
    "ml": "സെറ്റിൽമെന്റ്",
    "kn": "ಇತ್ಯರ್ಥ",
    "mr": "देयके",
    "bn": "নিষ্পত্তি"
  },
  "payout": {
    "hi": "भुगतान",
    "ta": "பணம் விடுவிப்பு",
    "ml": "പേഔട്ട്",
    "kn": "ಪಾವತಿ",
    "mr": "पेआउट",
    "bn": "পেআউট"
  },
  "payouts": {
    "hi": "भुगतान",
    "ta": "பணம் விடுவிப்புகள்",
    "ml": "പേഔട്ടുകൾ",
    "kn": "ಪಾವತಿಗಳು",
    "mr": "पेआउट्स",
    "bn": "পেআউট"
  },
  "kisan": {
    "hi": "किसान",
    "ta": "விவசாயி",
    "ml": "കർഷകൻ",
    "kn": "ರೈತ",
    "mr": "शेतकरी",
    "bn": "কৃষক"
  },
  "farmers": {
    "hi": "किसान",
    "ta": "விவசாயிகள்",
    "ml": "കർഷകർ",
    "kn": "ರೈತರು",
    "mr": "शेतकरी",
    "bn": "কৃষক"
  },
  "farmer": {
    "hi": "किसान",
    "ta": "விவசாயி",
    "ml": "കർഷകൻ",
    "kn": "ರೈತ",
    "mr": "शेतकरी",
    "bn": "কৃষক"
  },
  "buyer": {
    "hi": "क्रेता / खरीदार",
    "ta": "வாங்குபவர்",
    "ml": "വാങ്ങുന്നയാൾ",
    "kn": "ಖರೀದಿದಾರ",
    "mr": "खरेदीदार",
    "bn": "ক্রেতা"
  },
  "buyers": {
    "hi": "क्रेता / खरीदार",
    "ta": "வாங்குபவர்கள்",
    "ml": "വാങ്ങുന്നവർ",
    "kn": "ಖರೀದಿದಾರರು",
    "mr": "खरेदीदार",
    "bn": "ক্রেতারা"
  },
  "fpo": {
    "hi": "FPO",
    "ta": "FPO",
    "ml": "എഫ്.പി.ഒ",
    "kn": "ಎಫ್‌ಪಿಒ",
    "mr": "एफपीओ",
    "bn": "এফপিও"
  },
  "distributor": {
    "hi": "वितरक",
    "ta": "விநியோகஸ்தர்",
    "ml": "വിതരണക്കാരൻ",
    "kn": "ವಿತರಕ",
    "mr": "वितरक",
    "bn": "ডিস্ট্রিবিউটর"
  },
  "wholesaler": {
    "hi": "थोक व्यापारी",
    "ta": "மொத்த வியாபாரி",
    "ml": "മൊത്തവ്യാപാരി",
    "kn": "ಸಗಟು ವ್ಯಾಪಾರಿ",
    "mr": "घाऊक व्यापारी",
    "bn": "পাইকারি বিক্রেতা"
  },
  "delivery": {
    "hi": "वितरण / डिलीवरी",
    "ta": "டெலிவரி",
    "ml": "ഡെലിവറി",
    "kn": "ವಿತರಣೆ",
    "mr": "डिलिव्हरी",
    "bn": "ডেলিভারি"
  },
  "deliveries": {
    "hi": "वितरण",
    "ta": "டெலிவரிகள்",
    "ml": "ഡെലിവറികൾ",
    "kn": "ವಿತರಣೆಗಳು",
    "mr": "वितरण",
    "bn": "ডেলিভারি"
  },
  "agent": {
    "hi": "एजेंट",
    "ta": "முகவர்",
    "ml": "ഏജന്റ്",
    "kn": "ಏಜೆಂಟ್",
    "mr": "एजंट",
    "bn": "এজেন্ট"
  },
  "agents": {
    "hi": "एजेंट",
    "ta": "முகவர்கள்",
    "ml": "ഏജന്റുമാർ",
    "kn": "ಏಜೆಂಟರು",
    "mr": "एजंट",
    "bn": "এজেন্ট"
  },
  "crop": {
    "hi": "फसल",
    "ta": "பயிர்",
    "ml": "വിള",
    "kn": "ಬೆಳೆ",
    "mr": "पीक",
    "bn": "ফসল"
  },
  "crops": {
    "hi": "फसलें",
    "ta": "பயிர்கள்",
    "ml": "വിളകൾ",
    "kn": "ಬೆಳೆಗಳು",
    "mr": "पिके",
    "bn": "ফসলসমূহ"
  },
  "produce": {
    "hi": "उपज",
    "ta": "விளைச்சல்",
    "ml": "വിളവ്",
    "kn": "ಉತ್ಪನ್ನ / ಬೆಳೆ",
    "mr": "शेतमाल",
    "bn": "ফসল / উৎপাদন"
  },
  "harvest": {
    "hi": "कटाई / उपज",
    "ta": "அறுவடை",
    "ml": "വിളവെടുപ്പ്",
    "kn": "ಸುಗ್ಗಿ / ಕೊಯ್ಲು",
    "mr": "कापणी / शेतमाल",
    "bn": "ফসল কাটা"
  },
  "mandi": {
    "hi": "मंडी",
    "ta": "மண்டி",
    "ml": "മണ്ടി",
    "kn": "ಮಂಡಿ",
    "mr": "मंडी",
    "bn": "মান্ডি"
  },
  "lot": {
    "hi": "लॉट",
    "ta": "லாட்",
    "ml": "ലോട്ട്",
    "kn": "ಲಾಟ್",
    "mr": "लॉट",
    "bn": "লট"
  },
  "lots": {
    "hi": "लॉट",
    "ta": "லாட்கள்",
    "ml": "ലോട്ടുകൾ",
    "kn": "ಲಾಟ್‌ಗಳು",
    "mr": "लॉट्स",
    "bn": "লটসমূহ"
  },
  "grade": {
    "hi": "ग्रेड",
    "ta": "தரம்",
    "ml": "ഗ്രേഡ്",
    "kn": "ದರ್ಜೆ",
    "mr": "प्रत / दर्जा",
    "bn": "গ্রেড"
  },
  "moisture": {
    "hi": "नमी",
    "ta": "ஈரப்பதம்",
    "ml": "ഈർപ്പം",
    "kn": "ತೇವಾಂಶ",
    "mr": "ओलावा",
    "bn": "আর্দ্রতা"
  },
  "storage": {
    "hi": "भंडारण",
    "ta": "சேமிப்பு",
    "ml": "സംഭരണം",
    "kn": "ದಾಸ್ತಾನು",
    "mr": "साठवणूक",
    "bn": "মজুদ"
  },
  "warehouse": {
    "hi": "गोदाम",
    "ta": "கிடங்கு",
    "ml": "വെയർഹൗസ്",
    "kn": "ಗೋದಾಮು",
    "mr": "गोदाम",
    "bn": "গুদাম"
  },
  "inventory": {
    "hi": "इन्वेंट्री",
    "ta": "இருப்பு",
    "ml": "ഇൻവെന്ററി",
    "kn": "ದಾಸ್ತಾನು",
    "mr": "साठा",
    "bn": "ইনভেন্টরি"
  },
  "supply": {
    "hi": "आपूर्ति",
    "ta": "விநியோகம்",
    "ml": "സപ്ലൈ",
    "kn": "ಪೂರೈಕೆ",
    "mr": "पुरवठा",
    "bn": "সরবরাহ"
  },
  "procurement": {
    "hi": "खरीद",
    "ta": "கொள்முதல்",
    "ml": "സംഭരണം",
    "kn": "ಖರೀದಿ",
    "mr": "खरेदी",
    "bn": "সংগ্রহ"
  },
  "requirement": {
    "hi": "आवश्यकता",
    "ta": "தேவை",
    "ml": "ആവശ്യം",
    "kn": "ಅಗತ್ಯ",
    "mr": "आवश्यकता",
    "bn": "প্রয়োজনীয়তা"
  },
  "requirements": {
    "hi": "आवश्यकताएं",
    "ta": "தேவைகள்",
    "ml": "ആവശ്യങ്ങൾ",
    "kn": "ಅಗತ್ಯಗಳು",
    "mr": "आवश्यकता",
    "bn": "প্রয়োজনীয়তা"
  },
  "trading": {
    "hi": "व्यापार",
    "ta": "வர்த்தகம்",
    "ml": "വ്യാപാരം",
    "kn": "ವ್ಯಾಪಾರ",
    "mr": "व्यापार",
    "bn": "ট্রেডিং"
  },
  "trade": {
    "hi": "व्यापार",
    "ta": "வர்த்தகம்",
    "ml": "വ്യാപാരം",
    "kn": "ವ್ಯಾಪಾರ",
    "mr": "व्यापार",
    "bn": "বাণিজ্য"
  },
  "escrow": {
    "hi": "एस्क्रो",
    "ta": "எஸ்க்ரோ",
    "ml": "എസ്ക്രോ",
    "kn": "ಎಸ್ಕ್ರೋ",
    "mr": "एस्क्रो",
    "bn": "এসক্রো"
  },
  "vehicle": {
    "hi": "वाहन",
    "ta": "வாகனம்",
    "ml": "വാഹനം",
    "kn": "ವಾಹನ",
    "mr": "वाहन",
    "bn": "যানবাহন"
  },
  "transport": {
    "hi": "परिवहन",
    "ta": "போக்குவரத்து",
    "ml": "ഗതാഗതം",
    "kn": "ಸಾರಿಗೆ",
    "mr": "वाहतूक",
    "bn": "পরিবহন"
  },
  "transit": {
    "hi": "पारगमन",
    "ta": "போக்குவரத்து",
    "ml": "ട്രാൻസിറ്റ്",
    "kn": "ಸಾಗಣೆ",
    "mr": "वाहतूक",
    "bn": "ট্রানজিট"
  },
  "dispatch": {
    "hi": "प्रेषण",
    "ta": "அனுப்புதல்",
    "ml": "അയയ്ക്കൽ",
    "kn": "ರವಾನೆ",
    "mr": "पाठवणे",
    "bn": "প্রেরণ"
  },
  "dispatched": {
    "hi": "भेज दिया गया",
    "ta": "அனுப்பப்பட்டது",
    "ml": "അയച്ചു",
    "kn": "ರವಾನಿಸಲಾಗಿದೆ",
    "mr": "पाठवले",
    "bn": "প্রেরিত"
  },
  "pickup": {
    "hi": "पिकअप स्थान",
    "ta": "பிக்கப்",
    "ml": "പിക്കപ്പ്",
    "kn": "ಪಿಕಪ್",
    "mr": "उचलण्याचे ठिकाण",
    "bn": "পিকআপ"
  },
  "delivered": {
    "hi": "वितरित",
    "ta": "டெலிவரி செய்யப்பட்டது",
    "ml": "ഡെലിവർ ചെയ്തു",
    "kn": "ವಿತರಿಸಲಾಗಿದೆ",
    "mr": "पोहोचवले",
    "bn": "বিতরিত"
  },
  "wheat": {
    "hi": "गेहूं",
    "ta": "கோதுமை",
    "ml": "ഗോതമ്പ്",
    "kn": "ಗೋಧಿ",
    "mr": "गहू",
    "bn": "গম"
  },
  "paddy": {
    "hi": "धान",
    "ta": "நெல்",
    "ml": "നെല്ല്",
    "kn": "ಭತ್ತ",
    "mr": "भात / धान",
    "bn": "ধান"
  },
  "rice": {
    "hi": "चावल",
    "ta": "அரிசி",
    "ml": "അരി",
    "kn": "ಅಕ್ಕಿ",
    "mr": "तांदूळ",
    "bn": "চাল"
  },
  "tomato": {
    "hi": "टमाटर",
    "ta": "தக்காளி",
    "ml": "தக்காளி",
    "kn": "ಟೊಮೇಟೊ",
    "mr": "टोमॅटो",
    "bn": "টমেটো"
  },
  "tomatoes": {
    "hi": "टमाटर",
    "ta": "தக்காளி",
    "ml": "தக்காளி",
    "kn": "ಟೊಮೇಟೊ",
    "mr": "टोमॅटो",
    "bn": "টমেটো"
  },
  "onion": {
    "hi": "प्याज",
    "ta": "வெங்காயம்",
    "ml": "സവാള",
    "kn": "ಈರುಳ್ಳಿ",
    "mr": "कांदा",
    "bn": "পেঁয়াজ"
  },
  "onions": {
    "hi": "प्याज",
    "ta": "வெங்காயம்",
    "ml": "സവാള",
    "kn": "ಈರುಳ್ಳಿ",
    "mr": "कांदे",
    "bn": "পেঁয়াজ"
  },
  "potato": {
    "hi": "आलू",
    "ta": "உருளைக்கிழங்கு",
    "ml": "உരുളക്കിഴങ്ങ്",
    "kn": "ಆಲೂಗಡ್ಡೆ",
    "mr": "बटाटा",
    "bn": "আলু"
  },
  "potatoes": {
    "hi": "आलू",
    "ta": "உருளைக்கிழங்கு",
    "ml": "உരുളക്കിഴങ്ങ്",
    "kn": "ಆಲೂಗಡ್ಡೆ",
    "mr": "बटाटे",
    "bn": "আলু"
  },
  "cotton": {
    "hi": "कपास",
    "ta": "பருத்தி",
    "ml": "പരുത്തി",
    "kn": "ಹತ್ತಿ",
    "mr": "कापूस",
    "bn": "তুলা"
  },
  "sugarcane": {
    "hi": "गन्ना",
    "ta": "கரும்பு",
    "ml": "കരിമ്പ്",
    "kn": "ಕಬ್ಬು",
    "mr": "ऊस",
    "bn": "আখ"
  },
  "maize": {
    "hi": "मक्का",
    "ta": "மக்காச்சோளம்",
    "ml": "മക്കച്ചോളം",
    "kn": "ಮೆಕ್ಕೆಜೋಳ",
    "mr": "मका",
    "bn": "ভুট্টা"
  },
  "fresh": {
    "hi": "ताजा",
    "ta": "புதிய",
    "ml": "ഫ്രഷ്",
    "kn": "ತಾಜಾ",
    "mr": "ताजे",
    "bn": "তাজা"
  },
  "premium": {
    "hi": "प्रीमियम",
    "ta": "சிறந்த",
    "ml": "പ്രീമിയം",
    "kn": "ಪ್ರೀಮಿಯಂ",
    "mr": "उत्कृष्ट",
    "bn": "প্রিমিয়াম"
  },
  "pure": {
    "hi": "शुद्ध",
    "ta": "தூய",
    "ml": "ശുദ്ധമായ",
    "kn": "ಶುದ್ಧ",
    "mr": "शुद्ध",
    "bn": "খাঁটি"
  },
  "quality": {
    "hi": "गुणवत्ता",
    "ta": "தரம்",
    "ml": "ഗുണനിലവാരം",
    "kn": "ಗುಣಮಟ್ಟ",
    "mr": "गुणवत्ता",
    "bn": "গুণমান"
  },
  "fair": {
    "hi": "उचित",
    "ta": "நியாயமான",
    "ml": "ന്യായമായ",
    "kn": "ನ್ಯಾಯಯುತ",
    "mr": "रास्त / योग्य",
    "bn": "ন্যায্য"
  },
  "direct": {
    "hi": "सीधा",
    "ta": "நேரடி",
    "ml": "നേരിട്ടുള്ള",
    "kn": "ನೇರ",
    "mr": "थेट",
    "bn": "সরাসরি"
  },
  "market": {
    "hi": "बाजार",
    "ta": "சந்தை",
    "ml": "വിപണി",
    "kn": "ಮಾರುಕಟ್ಟೆ",
    "mr": "बाजारपेठ",
    "bn": "বাজার"
  },
  "connect": {
    "hi": "जुड़ें",
    "ta": "இணையுங்கள்",
    "ml": "ബന്ധപ്പെടുക",
    "kn": "ಸಂಪರ್ಕಿಸಿ",
    "mr": "जोडा",
    "bn": "যুক্ত হোন"
  },
  "grow": {
    "hi": "आगे बढ़ें",
    "ta": "வளருங்கள்",
    "ml": "വളരുക",
    "kn": "ಬೆಳೆಯಿರಿ",
    "mr": "प्रगती करा",
    "bn": "এগিয়ে যান"
  },
  "today": {
    "hi": "आज",
    "ta": "இன்று",
    "ml": "ഇന്ന്",
    "kn": "ಇಂದು",
    "mr": "आज",
    "bn": "আজ"
  },
  "ready": {
    "hi": "तैयार",
    "ta": "தயார்",
    "ml": "തയ്യാറാണ്",
    "kn": "ಸಿದ್ಧ",
    "mr": "तयार",
    "bn": "প্রস্তুত"
  },
  "available": {
    "hi": "उपलब्ध",
    "ta": "கிடைக்கும்",
    "ml": "ലഭ്യമാണ്",
    "kn": "ಲಭ್ಯವಿದೆ",
    "mr": "उपलब्ध",
    "bn": "উপলব্ধ"
  },
  "upcoming": {
    "hi": "आगामी",
    "ta": "வரவிருக்கும்",
    "ml": "വരാനിരിക്കുന്നത്",
    "kn": "ಮುಂಬರುವ",
    "mr": "आगामी",
    "bn": "আসন্ন"
  },
  "session": {
    "hi": "सत्र",
    "ta": "அமர்வு",
    "ml": "സെഷൻ",
    "kn": "ಅಧಿವೇಶನ",
    "mr": "सत्र",
    "bn": "অধিবেশন"
  },
  "sessions": {
    "hi": "सत्र",
    "ta": "அமர்வுகள்",
    "ml": "സെഷനുകൾ",
    "kn": "ಅಧಿವೇಶನಗಳು",
    "mr": "सत्रे",
    "bn": "অধিবেশনসমূহ"
  },
  "network": {
    "hi": "नेटवर्क",
    "ta": "நெட்வொர்க்",
    "ml": "നെറ്റ്‌വർക്ക്",
    "kn": "ನೆಟ್‌ವರ್ಕ್",
    "mr": "नेटवर्क",
    "bn": "নেটওয়ার্ক"
  },
  "bulk": {
    "hi": "थोक",
    "ta": "மொத்த",
    "ml": "ബൾക്ക്",
    "kn": "ಬೃಹತ್",
    "mr": "घाऊक",
    "bn": "পাইকারি"
  },
  "sale": {
    "hi": "बिक्री",
    "ta": "விற்பனை",
    "ml": "വിൽപന",
    "kn": "ಮಾರಾಟ",
    "mr": "विक्री",
    "bn": "বিক্রয়"
  },
  "sales": {
    "hi": "बिक्री",
    "ta": "விற்பனை",
    "ml": "വിൽപന",
    "kn": "ಮಾರಾಟಗಳು",
    "mr": "विक्री",
    "bn": "বিক্রয়সমূহ"
  },
  "sell": {
    "hi": "बेचें",
    "ta": "விற்க",
    "ml": "വിൽക്കുക",
    "kn": "ಮಾರಿ",
    "mr": "विका",
    "bn": "বিক্রি করুন"
  },
  "buy": {
    "hi": "खरीदें",
    "ta": "வாங்க",
    "ml": "വാങ്ങുക",
    "kn": "ಖರೀದಿಸಿ",
    "mr": "खरेदी करा",
    "bn": "কিনুন"
  },
  "create": {
    "hi": "बनाएं",
    "ta": "உருவாக்கு",
    "ml": "ഉണ്ടാക്കുക",
    "kn": "ರಚಿಸಿ",
    "mr": "तयार करा",
    "bn": "তৈরি করুন"
  },
  "add": {
    "hi": "जोड़ें",
    "ta": "சேர்",
    "ml": "ചേർക്കുക",
    "kn": "ಸೇರಿಸಿ",
    "mr": "जोडा",
    "bn": "যোগ করুন"
  },
  "list": {
    "hi": "सूचीबद्ध करें",
    "ta": "பட்டியலிடு",
    "ml": "പട്ടികപ്പെടുത്തുക",
    "kn": "ಪಟ್ಟಿ ಮಾಡಿ",
    "mr": "नोंदवा",
    "bn": "তালিকাভুক্ত করুন"
  },
  "listed": {
    "hi": "सूचीबद्ध",
    "ta": "பட்டியலிடப்பட்டது",
    "ml": "പട്ടികപ്പെടുത്തി",
    "kn": "ಪಟ್ಟಿಮಾಡಲಾಗಿದೆ",
    "mr": "नोंदवलेले",
    "bn": "তালিকাভুক্ত"
  },
  "minimum": {
    "hi": "न्यूनतम",
    "ta": "குறைந்தபட்ச",
    "ml": "കുറഞ്ഞത്",
    "kn": "ಕನಿಷ್ಠ",
    "mr": "किमान",
    "bn": "ন্যূনতম"
  },
  "maximum": {
    "hi": "अधिकतम",
    "ta": "அதிகபட்ச",
    "ml": "പരമാവധി",
    "kn": "ಗರಿಷ್ಠ",
    "mr": "कमाल",
    "bn": "সর্বোচ্চ"
  },
  "highest": {
    "hi": "उच्चतम",
    "ta": "அதிகபட்ச",
    "ml": "ഏറ്റവും ഉയർന്നത്",
    "kn": "ಅತಿ ಹೆಚ್ಚು",
    "mr": "सर्वोच्च",
    "bn": "সর্বোচ্চ"
  },
  "lowest": {
    "hi": "न्यूनतम",
    "ta": "குறைந்தபட்ச",
    "ml": "ഏറ്റവും കുറഞ്ഞത്",
    "kn": "ಅತಿ ಕಡಿಮೆ",
    "mr": "किमान / सर्वात कमी",
    "bn": "সর্বনিম্ন"
  },
  "floor": {
    "hi": "आधार मूल्य",
    "ta": "அடிப்படை விலை",
    "ml": "അടിസ്ഥാന നിരക്ക്",
    "kn": "ಮೂಲ ಬೆಲೆ",
    "mr": "किमान आधार दर",
    "bn": "বেস প্রাইস"
  },
  "earnings": {
    "hi": "कमाई",
    "ta": "வருவாய்",
    "ml": "വരുമാനം",
    "kn": "ಗಳಿಕೆ",
    "mr": "उत्पन्न / कमाई",
    "bn": "উপার্জন"
  },
  "estimated": {
    "hi": "अनुमानित",
    "ta": "மதிப்பிடப்பட்ட",
    "ml": "കണക്കാക്കിയ",
    "kn": "ಅಂದಾಜು",
    "mr": "अंदाजे",
    "bn": "আনুমানিক"
  },
  "expected": {
    "hi": "अपेक्षित",
    "ta": "எதிர்பார்க்கப்படும்",
    "ml": "പ്രതീಕ್ಷിക്കുന്ന",
    "kn": "ನಿರೀಕ್ಷಿತ",
    "mr": "अपेक्षित",
    "bn": "প্রত্যাশিত"
  },
  "incoming": {
    "hi": "आगामी",
    "ta": "உள்வரும்",
    "ml": "വരുന്ന",
    "kn": "ಆಗಮಿಸುವ",
    "mr": "येणारा",
    "bn": "আসন্ন"
  },
  "fulfillment": {
    "hi": "पूर्ति",
    "ta": "நிறைவேற்றம்",
    "ml": "നിറവേറ്റൽ",
    "kn": "ಪೂರೈಕೆ",
    "mr": "पूर्तता",
    "bn": "পূরণ"
  },
  "logistics": {
    "hi": "लॉजिस्टिक्स",
    "ta": "லாஜிஸ்டிக்ஸ்",
    "ml": "ലോജിസ്റ്റിക്സ്",
    "kn": "ಲಾಜಿಸ್ಟಿಕ್ಸ್",
    "mr": "लॉजिस्टिक्स",
    "bn": "লজিস্টিক"
  },
  "tracking": {
    "hi": "ट्रैकिंग",
    "ta": "கண்காணிப்பு",
    "ml": "ട്രാക്കിംഗ്",
    "kn": "ಟ್ರ್ಯಾಕಿಂಗ್",
    "mr": "ट्रॅकिंग",
    "bn": "ট্র্যাকিং"
  },
  "route": {
    "hi": "मार्ग",
    "ta": "பாதை",
    "ml": "റൂട്ട്",
    "kn": "ಮಾರ್ಗ",
    "mr": "मार्ग",
    "bn": "রুট"
  },
  "bays": {
    "hi": "कक्ष",
    "ta": "பகுதிகள்",
    "ml": "ബേകൾ",
    "kn": "ಭಾಗಗಳು",
    "mr": "कक्ष / भाग",
    "bn": "বে"
  },
  "shipments": {
    "hi": "खेप",
    "ta": "சரக்குகள்",
    "ml": "ഷിപ്പ്മെന്റുകൾ",
    "kn": "ಸಾಗಣೆಗಳು",
    "mr": "माल खेपा",
    "bn": "চালান"
  },
  "arriving": {
    "hi": "पहुंचने वाली",
    "ta": "வரும்",
    "ml": "എത്തിച്ചേരുന്ന",
    "kn": "ಆಗಮಿಸುತ್ತಿದೆ",
    "mr": "येणारे",
    "bn": "আসছে"
  },
  "soon": {
    "hi": "जल्द",
    "ta": "விரைவில்",
    "ml": "ഉടൻ",
    "kn": "ಶೀಘ್ರದಲ್ಲೇ",
    "mr": "लवकरच",
    "bn": "শীঘ্রই"
  },
  "across": {
    "hi": "भर में",
    "ta": "முழுவதும்",
    "ml": "ഉടനീളം",
    "kn": "ವ್ಯಾಪ್ತಿಯಲ್ಲಿ",
    "mr": "सर्वत्र",
    "bn": "জুড়ে"
  },
  "tap": {
    "hi": "टैप करें",
    "ta": "தட்டவும்",
    "ml": "ടാപ്പ് ചെയ്യുക",
    "kn": "ಟ್ಯಾಪ್ ಮಾಡಿ",
    "mr": "टॅप करा",
    "bn": "ট্যাপ করুন"
  },
  "review": {
    "hi": "समीक्षा करें",
    "ta": "மதிப்பாய்வு செய்",
    "ml": "അവലോകനം ചെയ്യുക",
    "kn": "ಪರಿಶೀಲಿಸಿ",
    "mr": "पुनरावलोकन करा",
    "bn": "পর্যালোচনা করুন"
  },
  "required": {
    "hi": "आवश्यक",
    "ta": "தேவை",
    "ml": "ആവശ്യമാണ്",
    "kn": "ಅಗತ್ಯವಿದೆ",
    "mr": "आवश्यक",
    "bn": "প্রয়োজনীয়"
  },
  "benchmark": {
    "hi": "मानक",
    "ta": "அளவுகோல்",
    "ml": "മാനദണ്ഡം",
    "kn": "ಮಾನದಂಡ",
    "mr": "मानक",
    "bn": "বেঞ্চমার্ক"
  },
  "linked": {
    "hi": "जुड़ा हुआ",
    "ta": "இணைக்கப்பட்டது",
    "ml": "ബന്ധിപ്പിച്ചു",
    "kn": "ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ",
    "mr": "जोडलेले",
    "bn": "সংযুক্ত"
  },
  "settled": {
    "hi": "निपटारा हुआ",
    "ta": "செட்டில் செய்யப்பட்டது",
    "ml": "സെറ്റിൽ ചെയ്തു",
    "kn": "ಇತ್ಯರ್ಥಗೊಂಡಿದೆ",
    "mr": "जमा झाले",
    "bn": "নিষ্পন্ন"
  },
  "bhav": {
    "hi": "भाव",
    "ta": "விலை",
    "ml": "നിരക്ക്",
    "kn": "ದರ",
    "mr": "भाव",
    "bn": "দর"
  },
  "source": {
    "hi": "स्रोत / खरीद",
    "ta": "மூலம்",
    "ml": "உറവിടം",
    "kn": "ಮೂಲ",
    "mr": "स्रोत / खरेदी",
    "bn": "উৎস"
  },
  "purchase": {
    "hi": "खरीदें",
    "ta": "வாங்குதல்",
    "ml": "വാങ്ങൽ",
    "kn": "ಖರೀದಿ",
    "mr": "खरेदी",
    "bn": "ক্রয়"
  },
  "receive": {
    "hi": "प्राप्त करें",
    "ta": "பெறுங்கள்",
    "ml": "സ്വീകരിക്കുക",
    "kn": "ಸ್ವೀಕರಿಸಿ",
    "mr": "स्वीकारा",
    "bn": "গ্রহণ করুন"
  },
  "store": {
    "hi": "भंडार",
    "ta": "சேமிக்கவும்",
    "ml": "സംഭരിക്കുക",
    "kn": "ದಾಸ್ತಾನು ಮಾಡಿ",
    "mr": "साठवा",
    "bn": "সঞ্চয় করুন"
  },
  "distribute": {
    "hi": "वितरित करें",
    "ta": "விநியோகிக்கவும்",
    "ml": "വിതരണം ചെയ്യുക",
    "kn": "ವಿತರಿಸಿ",
    "mr": "वितरित करा",
    "bn": "বিতরণ করুন"
  },
  "match": {
    "hi": "मिलान",
    "ta": "பொருத்தம்",
    "ml": "പொருത്തം",
    "kn": "ಹೊಂದಾಣಿಕೆ",
    "mr": "जुळणी",
    "bn": "মিল"
  },
  "strong": {
    "hi": "मजबूत",
    "ta": "வலுவான",
    "ml": "ശക്തമായ",
    "kn": "ಬಲವಾದ",
    "mr": "मजबूत",
    "bn": "শক্তিশালী"
  },
  "nearest": {
    "hi": "निकटतम",
    "ta": "அருகில் உள்ள",
    "ml": "ഏറ്റവും അടുത്തുള്ളത്",
    "kn": "ಅತಿ ಸಮೀಪದ",
    "mr": "सर्वात जवळचे",
    "bn": "নিকটতম"
  },
  "largest": {
    "hi": "सबसे बड़ा",
    "ta": "மிகப்பெரிய",
    "ml": "ഏറ്റവും വലിയ",
    "kn": "ದೊಡ್ಡ",
    "mr": "सर्वात मोठा",
    "bn": "বৃহত্তম"
  },
  "recommended": {
    "hi": "अनुशंसित",
    "ta": "பரிந்துரைக்கப்பட்ட",
    "ml": "ശുപാർശ ചെയ്ത",
    "kn": "ಶಿಫಾರಸು ಮಾಡಿದ",
    "mr": "शिफारस केलेले",
    "bn": "সুপারিশকৃত"
  },
  "commission": {
    "hi": "कमीशन",
    "ta": "கம்மிஷன்",
    "ml": "കമ്മീഷൻ",
    "kn": "ಕಮಿಷನ್",
    "mr": "दलाली / कमिशन",
    "bn": "কমিশন"
  },
  "zero": {
    "hi": "शून्य",
    "ta": "பூஜ்ஜியம்",
    "ml": "പൂജ്യം",
    "kn": "ಶೂನ್ಯ",
    "mr": "शून्य",
    "bn": "শূন্য"
  },
  "credit": {
    "hi": "क्रेडिट",
    "ta": "கடன்",
    "ml": "ക്രെഡിറ്റ്",
    "kn": "ಕ್ರೆಡಿಟ್",
    "mr": "पतपुरवठा / कर्ज",
    "bn": "ক্রেডিট"
  },
  "support": {
    "hi": "सहायता",
    "ta": "ஆதரவு",
    "ml": "പിന്തുണ",
    "kn": "ಬೆಂಬಲ",
    "mr": "मदत / पाठिंबा",
    "bn": "সহায়তা"
  },
  "freshfoods": {
    "hi": "ताजा खाद्य",
    "ta": "புதிய உணவுகள்",
    "ml": "ഫ്രഷ് ഫുഡ്സ്",
    "kn": "ತಾಜಾ ಆಹಾರ",
    "mr": "ताजे अन्न",
    "bn": "তাজা খাবার"
  },
  "wholesale": {
    "hi": "थोक",
    "ta": "மொத்த",
    "ml": "മൊത്ത",
    "kn": "ಸಗಟು",
    "mr": "घाऊक",
    "bn": "পাইকারি"
  },
  "retail": {
    "hi": "खुदरा",
    "ta": "சில்லறை",
    "ml": "റീട്ടെയിൽ",
    "kn": "ಚಿಲ್ಲರೆ",
    "mr": "किरकोळ",
    "bn": "খুচরা"
  },
  "commodities": {
    "hi": "वस्तुएं / फसलें",
    "ta": "பொருட்கள்",
    "ml": "സാധനങ്ങൾ",
    "kn": "ಸರಕುಗಳು",
    "mr": "कृषी माल",
    "bn": "পণ্যসমূহ"
  },
  "commodity": {
    "hi": "वस्तु / उपज",
    "ta": "பொருள்",
    "ml": "സാധനം",
    "kn": "ಸರಕು",
    "mr": "कृषी माल",
    "bn": "পণ্য"
  },
  "and": {
    "hi": "और",
    "ta": "மற்றும்",
    "ml": "ഒപ്പം",
    "kn": "ಮತ್ತು",
    "mr": "आणि",
    "bn": "এবং"
  },
  "or": {
    "hi": "या",
    "ta": "அல்லது",
    "ml": "അല്ലെങ്കിൽ",
    "kn": "ಅಥವಾ",
    "mr": "किंवा",
    "bn": "বা"
  },
  "in": {
    "hi": "में",
    "ta": "இல்",
    "ml": "ൽ",
    "kn": "ನಲ್ಲಿ",
    "mr": "मध्ये",
    "bn": "मध्ये"
  },
  "of": {
    "hi": "का",
    "ta": "இன்",
    "ml": "ന്റെ",
    "kn": "ರ",
    "mr": "चे",
    "bn": "এর"
  },
  "to": {
    "hi": "को",
    "ta": "க்கு",
    "ml": "ലേക്ക്",
    "kn": "ಗೆ",
    "mr": "कडे",
    "bn": "প্রতি"
  },
  "for": {
    "hi": "के लिए",
    "ta": "க்காக",
    "ml": "വേണ്ടി",
    "kn": "ಗಾಗಿ",
    "mr": "साठी",
    "bn": "জন্য"
  },
  "with": {
    "hi": "के साथ",
    "ta": "உடன்",
    "ml": "കൂടെ",
    "kn": "ಜೊತೆಗೆ",
    "mr": "सह",
    "bn": "সাথে"
  },
  "from": {
    "hi": "से",
    "ta": "இருந்து",
    "ml": "നിന്ന്",
    "kn": "ಇಂದ",
    "mr": "पासून",
    "bn": "থেকে"
  },
  "at": {
    "hi": "पर",
    "ta": "இல்",
    "ml": "ൽ",
    "kn": "ನಲ್ಲಿ",
    "mr": "येथे",
    "bn": "এ"
  },
  "per": {
    "hi": "प्रति",
    "ta": "ஒரு",
    "ml": "ഒരു",
    "kn": "ಪ್ರತಿ",
    "mr": "प्रति",
    "bn": "প্রতি"
  },
  "by": {
    "hi": "द्वारा",
    "ta": "மூலம்",
    "ml": "വഴി",
    "kn": "ಮೂಲಕ",
    "mr": "द्वारे",
    "bn": "দ্বারা"
  },
  "on": {
    "hi": "पर",
    "ta": "மீது",
    "ml": "ൽ",
    "kn": "ಮೇಲೆ",
    "mr": "वर",
    "bn": "উপর"
  },
  "is": {
    "hi": "है",
    "ta": "உள்ளது",
    "ml": "ആണ്",
    "kn": "ಆಗಿದೆ",
    "mr": "आहे",
    "bn": "হয়"
  },
  "are": {
    "hi": "हैं",
    "ta": "உள்ளன",
    "ml": "ആണ്",
    "kn": "ಇವೆ",
    "mr": "आहेत",
    "bn": "হয়"
  },
  "your": {
    "hi": "आपका",
    "ta": "உங்கள்",
    "ml": "നിങ്ങളുടെ",
    "kn": "ನಿಮ್ಮ",
    "mr": "तुमचे",
    "bn": "আপনার"
  },
  "my": {
    "hi": "मेरा",
    "ta": "எனது",
    "ml": "എന്റെ",
    "kn": "ನನ್ನ",
    "mr": "माझे",
    "bn": "আমার"
  },
  "our": {
    "hi": "हमारा",
    "ta": "எங்கள்",
    "ml": "ഞങ്ങളുടെ",
    "kn": "ನಮ್ಮ",
    "mr": "आमचे",
    "bn": "আমাদের"
  },
  "welcome": {
    "hi": "स्वागत",
    "ta": "வரவேற்பு",
    "ml": "സ്വാഗതം",
    "kn": "ಸ್ವಾಗತ",
    "mr": "स्वागत",
    "bn": "স্বাগতম"
  },
  "secure": {
    "hi": "सुरक्षित",
    "ta": "பாதுகாப்பான",
    "ml": "സുരക്ഷിതം",
    "kn": "ಸುರಕ್ಷಿತ",
    "mr": "सुरक्षित",
    "bn": "নিরাপদ"
  },
  "fast": {
    "hi": "तेज",
    "ta": "வேகமான",
    "ml": "വേഗത്തിൽ",
    "kn": "ವೇಗದ",
    "mr": "वेगवान",
    "bn": "দ্রুত"
  },
  "instant": {
    "hi": "त्वरित",
    "ta": "உடனடி",
    "ml": "തൽക്ഷണം",
    "kn": "ತಕ್ಷಣದ",
    "mr": "झटपट",
    "bn": "তাত্ক্ষণিক"
  },
  "portal": {
    "hi": "पोर्टल",
    "ta": "போர்டல்",
    "ml": "പോർട്ടൽ",
    "kn": "ಪೋರ್ಟಲ್",
    "mr": "पोर्टल",
    "bn": "পোর্টাল"
  },
  "platform": {
    "hi": "मंच / प्लेटफॉर्म",
    "ta": "தளம்",
    "ml": "പ്ലാറ്റ്ഫോം",
    "kn": "ವೇದಿಕೆ",
    "mr": "प्लॅटफॉर्म",
    "bn": "প্ল্যাটফর্ম"
  },
  "system": {
    "hi": "प्रणाली",
    "ta": "அமைப்பு",
    "ml": "സംവിധാനം",
    "kn": "ವ್ಯವಸ್ಥೆ",
    "mr": "प्रणाली",
    "bn": "সিস্টেম"
  },
  "india": {
    "hi": "भारत",
    "ta": "இந்தியா",
    "ml": "ഇന്ത്യ",
    "kn": "ಭಾರತ",
    "mr": "भारत",
    "bn": "ভারত"
  }
};

  function ensureIndicFontsLoaded() {
    if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return;
    if (typeof document.getElementById !== 'function') return;
    if (!document.getElementById('agrimitra-indic-fonts')) {
      const link = document.createElement('link');
      link.id = 'agrimitra-indic-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&family=Noto+Sans+Malayalam:wght@400;500;600;700&family=Noto+Sans+Kannada:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }

  function translateWord(w, lang) {
    if (!w || w.length < 2) return w;

    if (/^agrimitra$/i.test(w) || (/^mitra$/i.test(w) && /agri/i.test(w))) {
      return 'AgriMitra';
    }
    const lower = w.toLowerCase();
    if (WORD_DICTIONARY[lower] && WORD_DICTIONARY[lower][lang]) {
      return WORD_DICTIONARY[lower][lang];
    }
    return w;
  }

  const SORTED_PHRASES = Object.keys(PHRASE_DICTIONARY).sort(function (a, b) {
    return b.length - a.length;
  });

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function translateTextDeep(text, lang) {
    if (!text || text.length < 2) return text;
    const trimmed = text.trim();

    if (PHRASE_DICTIONARY[trimmed] && PHRASE_DICTIONARY[trimmed][lang]) {
      return text.replace(trimmed, PHRASE_DICTIONARY[trimmed][lang]);
    }

    const lowerTrimmed = trimmed.toLowerCase();
    for (const phrase in PHRASE_DICTIONARY) {
      if (phrase.toLowerCase() === lowerTrimmed && PHRASE_DICTIONARY[phrase][lang]) {
        return text.replace(trimmed, PHRASE_DICTIONARY[phrase][lang]);
      }
    }

    let result = text;
    for (let i = 0; i < SORTED_PHRASES.length; i++) {
      const phrase = SORTED_PHRASES[i];
      if (phrase === 'AgriMitra' || phrase.length < 3) continue;
      if (PHRASE_DICTIONARY[phrase] && PHRASE_DICTIONARY[phrase][lang]) {
        const isAlphanumeric = /^[A-Za-z0-9\s]+$/.test(phrase);
        const pattern = isAlphanumeric ? ('\\b' + escapeRegex(phrase) + '\\b') : escapeRegex(phrase);
        const re = new RegExp(pattern, 'g');
        if (re.test(result)) {
          result = result.replace(re, PHRASE_DICTIONARY[phrase][lang]);
        }
      }
    }

    result = result.replace(/[A-Za-z]+(?:-[A-Za-z]+)*/g, function (match) {
      if (match.toLowerCase() === 'agrimitra') return 'AgriMitra';
      if (match.toLowerCase() === 'agri') return 'Agri';
      if (match.toLowerCase() === 'mitra') return 'Mitra';

      return translateWord(match, lang);
    });

    return result;
  }

  function autoTranslateDOM(container, lang) {
    if (!container || typeof document === 'undefined' || !document.createTreeWalker) return;
    const SHOW_TEXT = (typeof NodeFilter !== 'undefined' && NodeFilter.SHOW_TEXT) || 4;
    const FILTER_ACCEPT = (typeof NodeFilter !== 'undefined' && NodeFilter.FILTER_ACCEPT) || 1;
    const FILTER_REJECT = (typeof NodeFilter !== 'undefined' && NodeFilter.FILTER_REJECT) || 2;
    const FILTER_SKIP = (typeof NodeFilter !== 'undefined' && NodeFilter.FILTER_SKIP) || 3;

    const walker = document.createTreeWalker(
      container,
      SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!node || !node.parentElement) return FILTER_REJECT;
          const tag = node.parentElement.tagName.toLowerCase();
          if (['script', 'style', 'code', 'pre', 'noscript', 'textarea'].includes(tag)) {
            return FILTER_REJECT;
          }

          if (tag === 'input' || node.parentElement.isContentEditable) {
            return FILTER_REJECT;
          }

          if (node.parentElement.closest && node.parentElement.closest('[data-i18n]')) {
            return FILTER_SKIP;
          }
          const text = node.nodeValue.trim();
          if (!text || text.length < 2) return FILTER_SKIP;
          return FILTER_ACCEPT;
        }
      }
    );

    const nodesToReplace = [];
    let currentTextNode;
    while ((currentTextNode = walker.nextNode())) {
      if (currentTextNode && currentTextNode.nodeValue) {
        nodesToReplace.push(currentTextNode);
      }
    }

    nodesToReplace.forEach(function(node) {
      if (!node || !node.nodeValue || !node.parentElement) return;
      const rawText = node.nodeValue;

      if (!node.parentElement._i18nOriginalText) {
        node.parentElement._i18nOriginalText = rawText;
      }

      const original = node.parentElement._i18nOriginalText;

      if (lang === 'en') {
        if (original && node.nodeValue !== original) {
          node.nodeValue = original;
        }
        return;
      }

      const translated = translateTextDeep(original, lang);
      if (translated && translated !== original) {
        node.nodeValue = translated;
      }
    });

    const inputs = container.querySelectorAll('input[placeholder], textarea[placeholder]');
    inputs.forEach(function(inp) {
      if (!inp.getAttribute('data-i18n-placeholder')) {
        const ph = inp.getAttribute('placeholder');
        if (!inp._i18nOriginalPh) {
          inp._i18nOriginalPh = ph;
        }
        const origPh = inp._i18nOriginalPh;
        if (lang === 'en') {
          inp.setAttribute('placeholder', origPh);
        } else {
          inp.setAttribute('placeholder', translateTextDeep(origPh, lang));
        }
      }
    });

    if (document.title && lang !== 'en') {
      if (!document._i18nOriginalTitle) {
        document._i18nOriginalTitle = document.title;
      }
      document.title = translateTextDeep(document._i18nOriginalTitle, lang);
    } else if (document._i18nOriginalTitle && lang === 'en') {
      document.title = document._i18nOriginalTitle;
    }
  }

  function syncGoogleTranslate(langCode) {
    if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return;
    try {
      const domain = (typeof location !== 'undefined' && location.hostname) ? ('; domain=' + location.hostname) : '';
      if (langCode === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;' + domain;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      } else {
        const cookieVal = '/en/' + langCode;
        document.cookie = 'googtrans=' + cookieVal + '; path=/;' + domain;
        document.cookie = 'googtrans=' + cookieVal + '; path=/;';
      }

      if (langCode !== 'en' && typeof document.getElementById === 'function' && !document.getElementById('google-translate-script')) {
        let el = document.getElementById('google_translate_element');
        if (!el) {
          el = document.createElement('div');
          el.id = 'google_translate_element';
          el.style.display = 'none';
          (document.body || document.documentElement).appendChild(el);
        }
        window.googleTranslateElementInit = function() {
          try {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'hi,ta,ml,kn,mr,bn,en',
              autoDisplay: false
            }, 'google_translate_element');
          } catch(e) {}
        };
        const s = document.createElement('script');
        s.id = 'google-translate-script';
        s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(s);
      }
    } catch(e) {}
  }

  function setLanguage(langCode) {
    if (!LANGUAGES[langCode]) {
      console.warn('[AgriMitra i18n] Unsupported language:', langCode);
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, langCode);
    } catch (e) {
      console.warn('[AgriMitra i18n] Failed saving language preference:', e);
    }

    applyTranslations(document);

    syncGoogleTranslate(langCode);

    try {
      window.dispatchEvent(new CustomEvent('agrimitra:languageChange', {
        detail: { language: langCode, meta: LANGUAGES[langCode] }
      }));
    } catch (e) {}

    try {
      if (typeof fetch === 'function') {
        fetch('/api/auth/language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ preferred_language: langCode })
        }).catch(function () {});
      }
    } catch (e) {}
  }

  function init() {
    applyTranslations(document);
    syncGoogleTranslate(getCurrentLanguage());
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  const exportObj = {
    LANGUAGES: LANGUAGES,
    translations: translations,
    getCurrentLanguage: getCurrentLanguage,
    setLanguage: setLanguage,
    t: t,
    applyTranslations: applyTranslations,
    translateWord: translateWord,
    translateTextDeep: translateTextDeep,
    autoTranslateDOM: autoTranslateDOM,
    syncGoogleTranslate: syncGoogleTranslate,
    PHRASE_DICTIONARY: PHRASE_DICTIONARY,
    WORD_DICTIONARY: WORD_DICTIONARY,
    init: init
  };

  if (typeof window !== 'undefined') {
    window.AgriMitraI18n = exportObj;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportObj;
  }

})();
