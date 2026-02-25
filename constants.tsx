
import React from 'react';
import { 
  Building2, 
  Zap, 
  Flame, 
  FileText, 
  HeartPulse, 
  ShoppingBasket, 
  Bot,
  Store
} from 'lucide-react';
import { ServiceInfo, ServiceType, Language } from './types';

export const DEPARTMENTS = [
  { id: ServiceType.GRAMPANCHAYAT, label: "Gram Panchayat" },
  { id: ServiceType.CHAVDI, label: "E-Chavdi / Revenue" },
  { id: ServiceType.ELECTRICITY, label: "Electricity (MSEB)" },
  { id: ServiceType.GAS, label: "Gas Agency" },
  { id: ServiceType.HEALTH, label: "Public Health (PHC)" },
  { id: ServiceType.MARKET, label: "Agricultural Mandi" },
  { id: ServiceType.BUSINESS, label: "Local Business Directory" }
];

export const INDIA_LOCATIONS = {
  states: [
    "Maharashtra", "Gujarat", "Karnataka", "Rajasthan", "Uttar Pradesh", "Delhi", "Tamil Nadu", "Kerala"
  ],
  districts: {
    "Maharashtra": [
      "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", 
      "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", 
      "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
      "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", 
      "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
    ],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Gandhinagar", "Jamnagar", "Junagadh", "Kutch", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Surat", "Vadodara", "Valsad"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"]
  },
  subDistricts: {
    "Pune": ["Haveli", "Mulshi", "Shirur", "Maval", "Bhor", "Daund", "Indapur", "Junnar", "Khed", "Ambegaon", "Purandar", "Velhe", "Baramati"],
    "Nashik": ["Nashik", "Sinnar", "Igatpuri", "Dindori", "Niphad", "Yeola", "Nandgaon", "Chandwad", "Kalwan", "Baglan", "Surgana", "Peint", "Trimbakeshwar", "Deola"],
    "Nagpur": ["Nagpur", "Kamptee", "Hingna", "Katol", "Kalameshwar", "Savner", "Ramtek", "Mauda", "Umred", "Bhiwapur", "Kuhi", "Narkhed"],
    "Aurangabad": ["Aurangabad", "Kannad", "Soegaon", "Sillod", "Phulambri", "Khultabad", "Vaijapur", "Gangapur", "Paithan"],
    "Ahmednagar": ["Ahmednagar", "Rahuri", "Shrirampur", "Sangamner", "Kopargaon", "Akole", "Nevasa", "Shevgaon", "Pathardi", "Parner", "Karjat", "Jamkhed", "Shrigonda"],
    "Satara": ["Satara", "Karad", "Wai", "Mahabaleshwar", "Phaltan", "Maan", "Khatav", "Koregaon", "Patan", "Jawali", "Khandala"],
    "Solapur": ["Solapur North", "Solapur South", "Barshi", "Akkalkot", "Mohol", "Madha", "Karmala", "Pandharpur", "Sangola", "Malshiras", "Mangalwedhe"],
    "Thane": ["Thane", "Kalyan", "Murbad", "Bhiwandi", "Shahapur", "Ulhasnagar", "Ambarnath"],
    "Raigad": ["Alibag", "Pen", "Murud", "Panvel", "Uran", "Karjat", "Khalapur", "Mangaon", "Roha", "Tala", "Mahad", "Poladpur", "Shrivardhan", "Mhasala"],
    "Ratnagiri": ["Ratnagiri", "Sangameshwar", "Lanja", "Rajapur", "Chiplun", "Guhagar", "Khed", "Dapoli", "Mandangad"],
    "Kolhapur": ["Karveer", "Panhala", "Shahuwadi", "Kagal", "Gadhinglaj", "Shirol", "Hatkanangale", "Radhanagari", "Gaganbawada", "Bhudargad", "Ajara", "Chandgad"],
    "Nanded": ["Nanded", "Mudkhed", "Ardhapur", "Bhokar", "Umri", "Loha", "Kandhar", "Naigaon", "Biloli", "Dharmabad", "Mukhed", "Hadgaon", "Himayatnagar", "Mahoor", "Degloor"],
    "Jalgaon": ["Jalgaon", "Bhusawal", "Raver", "Muktainagar", "Bodwad", "Yawal", "Chopda", "Amalner", "Parola", "Erandol", "Pachora", "Bhadgaon", "Chalisgaon", "Jamner", "Dharangaon"],
    "Sangli": ["Miraj", "Jat", "Khanapur", "Walwa", "Tasgaon", "Shirala", "Atpadi", "Kavathe Mahankal", "Palus", "Kadegaon"],
    "Latur": ["Latur", "Udgir", "Ahmedpur", "Nilanga", "Ausa", "Chakur", "Jalkot", "Shirur Anantpal", "Deoni", "Renapur"],
    "Beed": ["Beed", "Ashti", "Patoda", "Shirur Kasar", "Georai", "Majalgaon", "Wadwani", "Kaij", "Dharur", "Parli", "Ambejogai"],
    "Amravati": ["Amravati", "Bhatkuli", "Nandgaon Khandeshwar", "Dharni", "Chikhaldara", "Achalpur", "Chandur Bazar", "Morshi", "Warud", "Daryapur", "Anjangaon Surji", "Chandur Railway", "Dhamangaon Railway", "Teosa"],
    "Akola": ["Akola", "Akot", "Telhara", "Balapur", "Patur", "Murtijapur", "Barshitakli"],
    "Buldhana": ["Buldhana", "Chikhli", "Deulgaon Raja", "Jalgaon Jamod", "Sangrampur", "Malkapur", "Motala", "Nandura", "Khamgaon", "Shegaon", "Mehkar", "Sindkhed Raja", "Lonar"],
    "Ahmedabad": ["Ahmedabad City", "Daskroi", "Sanand", "Bavla", "Dholka", "Viramgam", "Mandal", "Detroj-Rampura", "Dhandhuka", "Ranpur", "Barwala"],
    "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal"]
  },
  villages: {
    "Haveli": ["Sukhawadi", "Hadapsar", "Loni Kalbhor", "Wagholi", "Kharadi", "Manjari", "Dhayari", "Nanded", "Shivane", "Uruli Kanchan", "Theur", "Bakori", "Kadamwak Vasti"],
    "Mulshi": ["Hinjewadi", "Pirangut", "Bhugaon", "Bavdhan", "Paud", "Lavasa", "Male", "Mutha", "Kashig", "Kothurne", "Nande", "Sus", "Marunji"],
    "Baramati": ["Baramati City", "Malegaon", "Gunjalwadi", "Pimpali", "Khandaj", "Shirsuphal", "Dundewadi", "Loni Bhapkar"],
    "Nashik": ["Mhasrul", "Adgaon", "Makhmalabad", "Panchavati", "Satpur", "Ambad", "Pathardi", "Deolali", "Bhagur", "Eklahare", "Pimpalgaon Najik"],
    "Thane": ["Thane City", "Majiwada", "Kopri", "Kalwa", "Mumbra", "Diva", "Kolshet", "Balkum"],
    "Panvel": ["Panvel City", "Kamothe", "Kalamboli", "Khandeshwar", "New Panvel", "Taloja", "Vichumbe", "Koproli"],
    "Miraj": ["Arag", "Bedag", "Belanki", "Bolwad", "Erandoli", "Gundewadi", "Kalambi", "Kanadewadi", "Khanderajuri", "Lingnur", "Malgaon", "Mallewadi", "Mhaishal", "Nilji", "Salgare", "Siddhewadi", "Tanang", "Yerla", "Bisur", "Inam Dhamani", "Kavalapur", "Kharsing", "Kumthe", "Miraj Rural", "Nandra", "Padamale", "Patgaon", "Shipur", "Takari", "Vaddi"],
    "Jat": ["Jat City", "Antral", "Asangi", "Babhlad", "Balanwad", "Basargi", "Belondgi", "Dafalapur", "Ghugechiwadi", "Gulvanchi", "Halli", "Jaliyal", "Kanthi", "Loni", "Madgyal", "Sankh", "Tikondi", "Umadi", "Vajrawad", "Walanwadi"],
    "Walwa": ["Islampur", "Ashta", "Bahe", "Boregaon", "Chikurde", "Dhavali", "Hubli", "Kameri", "Kasegaon", "Kurundwad", "Narsingpur", "Peth", "Rethare", "Sakharale", "Shirgaon", "Tandulwadi", "Walwa Village", "Yede Nipani"],
    "Tasgaon": ["Tasgaon City", "Anjani", "Balgavade", "Bhilawadi", "Borgaon", "Chinchani", "Dahivadi", "Hatnur", "Kavathe", "Kundal", "Limb", "Manerajuri", "Nimani", "Ped", "Savarde", "Visapur", "Yeralewadi"],
    "Kavathe Mahankal": ["Kavathe Mahankal City", "Agar", "Arivali", "Borgaon", "Deshing", "Gharandi", "Hingangade", "Irali", "Kuchi", "Langarhpeth", "Nimbavade"],
    "default": ["Gaothan", "Ward No 1", "Ward No 2", "Station Area", "Market Yard", "Gram Panchayat Area"]
  }
};

export const DICTIONARY: Record<string, Record<Language, string>> = {
  appName: { en: 'MyGaav', hi: 'मेरा गाँव', mr: 'माझे गाव' },
  welcome: { en: 'Welcome', hi: 'स्वागत है', mr: 'स्वागत आहे' },
  home: { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  tickets: { en: 'Tickets', hi: 'तिकीट', mr: 'तक्रार निवारण' },
  sahayak: { en: 'Sahayak', hi: 'सहायक', mr: 'सहाय्यक' },
  profile: { en: 'Profile', hi: 'प्रोफाइल', mr: 'प्रोफाइल' },
  about: { en: 'About', hi: 'जानकारी', mr: 'बद्दल' },
  logout: { en: 'Sign Out', hi: 'लॉग आउट', mr: 'बाहेर पडा' },
  askAi: { en: 'Ask AI Assistant', hi: 'AI सहायक से पूछें', mr: 'AI सहाय्यकाला विचारा' },
  typeQ: { en: 'Type your question...', hi: 'अपना प्रश्न लिखें...', mr: 'तुमचा प्रश्न लिहा...' },
  thinking: { en: 'Sahayak is thinking...', hi: 'सहायक सोच रहा है...', mr: 'सहाय्यक विचार करत आहे...' },
  recentNotices: { en: 'Recent Notices', hi: 'हालिया सूचनाएं', mr: 'नुकत्याच आलेल्या सूचना' },
  pendingBills: { en: 'Pending Bills', hi: 'बकाया बिल', mr: 'प्रलंबित बिले' },
  mainPortals: { en: 'Main Service Portals', hi: 'मुख्य सेवा पोर्टल', mr: 'मुख्य सेवा पोर्टल' },
  enterPortal: { en: 'Enter Portal', hi: 'पोर्टल में प्रवेश करें', mr: 'पोर्टल उघडा' },
  payNow: { en: 'Pay Now', hi: 'अभी भुगतान करें', mr: 'आता भरा' },
  activeAssessments: { en: 'Active Assessments', hi: 'सक्रिय आकलन', mr: 'सक्रिय मूल्यांकन' },
  recentSettlements: { en: 'Recent Settlements', hi: 'हालिया निपटान', mr: 'अलीकडील भरणा' },
  availablePortals: { en: 'Available Portals', hi: 'उपलब्ध पोर्टल', mr: 'उपलब्ध सेवा' },
  aiConsult: { en: 'AI Consultation', hi: 'AI परामर्श', mr: 'AI सल्ला' },
  needHelp: { en: 'Need Help?', hi: 'क्या आपको मदद चाहिए?', mr: 'मदत हवी आहे का?' },
  reportIssue: { en: 'Report Issue', hi: 'समस्या की रिपोर्ट करें', mr: 'तक्रार नोंदवा' },
  gramPanchayat: { en: 'Gram Panchayat', hi: 'ग्राम पंचायत', mr: 'ग्रामपंचायत' },
  electricity: { en: 'Electricity', hi: 'बिजली', mr: 'वीज' },
  gas: { en: 'Gas Services', hi: 'गैस सेवाएँ', mr: 'गॅस सेवा' },
  chavdi: { en: 'E-Chavdi', hi: 'ई-चावड़ी', mr: 'ई-चावडी' },
  officialVillageAnnouncement: { en: 'Official Village Announcement', hi: 'आधिकारिक गांव घोषणा', mr: 'अधिकृत ग्राम घोषणा' },
  acknowledge: { en: 'Acknowledge', hi: 'स्वीकार करें', mr: 'समजले' },
  allTaxesPaid: { en: 'All Taxes Paid', hi: 'सभी करों का भुगतान किया गया', mr: 'सर्व कर भरले गेले आहेत' },
  noPendingDues: { en: 'No Pending Dues', hi: 'कोई बकाया नहीं', mr: 'कोणतीही थकबाकी नाही' },
  taxInvoice: { en: 'Tax Invoice', hi: 'टैक्स इनवॉइस', mr: 'कर बीजक' },
  paymentReceipt: { en: 'Payment Receipt', hi: 'भुगतान रसीद', mr: 'पेमेंट पावती' },
  totalPaid: { en: 'Total Paid', hi: 'कुल भुगतान', mr: 'एकूण भरणा' },
  amountDue: { en: 'Amount Due', hi: 'बकाया राशि', mr: 'देय रक्कम' },
  residentPortal: { en: 'Resident Portal', hi: 'निवासी पोर्टल', mr: 'निवासी पोर्टल' },
  officerPortal: { en: 'Officer Portal', hi: 'अधिकारी पोर्टल', mr: 'अधिकारी पोर्टल' },
  fullName: { en: 'Full Name', hi: 'पूरा नाम', mr: 'पूर्ण नाव' },
  emailAddress: { en: 'Email Address', hi: 'ईमेल पता', mr: 'ईमेल पत्ता' },
  mobileNumber: { en: 'Mobile Number', hi: 'मोबाइल नंबर', mr: 'मोबाईल नंबर' },
  password: { en: 'Password', hi: 'पासवर्ड', mr: 'पासवर्ड' },
  createAccount: { en: 'Create Account', hi: 'खाता बनाएँ', mr: 'खाते तयार करा' },
  signInSecurely: { en: 'Sign In Securely', hi: 'सुरक्षित रूप से साइन इन करें', mr: 'सुरक्षितपणे लॉग इन करा' },
  alreadyHaveAccount: { en: 'Already have an account? Login', hi: 'क्या आपके पास पहले से खाता है? लॉगिन करें', mr: 'आधीच खाते आहे? लॉग इन करा' },
  dontHaveAccount: { en: "Don't have an account? Signup", hi: 'खाता नहीं है? साइन अप करें', mr: 'खाते नाही? साइन अप करा' },
  villageConnectivity: { en: 'Village Connectivity', hi: 'गांव कनेक्टिविटी', mr: 'ग्राम जोडणी' },
  district: { en: 'District', hi: 'जिला', mr: 'जिल्हा' },
  taluka: { en: 'Taluka', hi: 'तालुका', mr: 'तालुका' },
  village: { en: 'Village', hi: 'गांव', mr: 'गाव' },
  pincode: { en: 'Pincode', hi: 'पिनकोड', mr: 'पिनकोड' },
  physicalAddress: { en: 'Physical Address', hi: 'भौतिक पता', mr: 'राहण्याचा पत्ता' },
  gramPanchayatId: { en: 'Gram Panchayat ID', hi: 'ग्राम पंचायत आईडी', mr: 'ग्रामपंचायत आयडी' },
  electricityConsumerNo: { en: 'Electricity Consumer No', hi: 'बिजली उपभोक्ता संख्या', mr: 'वीज ग्राहक क्रमांक' },
  gasConsumerId: { en: 'Gas Consumer ID', hi: 'गैस उपभोक्ता आईडी', mr: 'गॅस ग्राहक आयडी' },
  chavdiAccountNo: { en: 'Chavdi Account No', hi: 'चावड़ी खाता संख्या', mr: 'चावडी खाते क्रमांक' },
  selectDepartment: { en: 'Select Your Department', hi: 'अपने विभाग का चयन करें', mr: 'आपला विभाग निवडा' }
};

export const SERVICES: ServiceInfo[] = [
  {
    id: ServiceType.GRAMPANCHAYAT,
    title: { en: "Gram Panchayat", hi: "ग्राम पंचायत", mr: "ग्रामपंचायत" },
    icon: "Building2",
    color: "bg-emerald-500",
    description: { en: "Governance & Administration", hi: "प्रशासन", mr: "प्रशासन" },
    details: [
      { en: "Birth/Death Certificates", hi: "जन्म/मृत्यु प्रमाणपत्र", mr: "जन्म/मृत्यू प्रमाणपत्र" },
      { en: "Property Taxes", hi: "संपत्ति कर", mr: "मालमत्ता कर" },
      { en: "NOC Requests", hi: "एनओसी अनुरोध", mr: "ना हरकत प्रमाणपत्र" }
    ]
  },
  {
    id: ServiceType.CHAVDI,
    title: { en: "E-Chavdi", hi: "ई-चावड़ी", mr: "ई-चावडी" },
    icon: "FileText",
    color: "bg-amber-500",
    description: { en: "Land Records Portal", hi: "भूमि रिकॉर्ड", mr: "जमिनीचे रेकॉर्ड" },
    details: [
      { en: "Satbara (7/12) Extract", hi: "सातबारा", mr: "सातबारा" },
      { en: "8A Holding", hi: "8अ होल्डिंग", mr: "८अ उतारा" },
      { en: "Ferfar (Mutation)", hi: "फेरफार", mr: "फेरफार" }
    ]
  },
  {
    id: ServiceType.BUSINESS,
    title: { en: "Local Directory", hi: "स्थानीय निर्देशिका", mr: "स्थानिक व्यवसाय" },
    icon: "Store",
    color: "bg-indigo-500",
    description: { en: "Village Business Directory", hi: "गांव व्यवसाय सूची", mr: "ग्राम व्यवसाय सूची" },
    details: [
      { en: "View Local Businesses", hi: "स्थानीय व्यवसाय देखें", mr: "स्थानिक व्यवसाय पहा" },
      { en: "Register My Service", hi: "मेरी सेवा पंजीकृत करें", mr: "माझी सेवा नोंदवा" }
    ]
  },
  {
    id: ServiceType.ELECTRICITY,
    title: { en: "Electricity", hi: "बिजली", mr: "वीज" },
    icon: "Zap",
    color: "bg-blue-500",
    description: { en: "Bill Payments & Issues", hi: "बिल और शिकायतें", mr: "बिल आणि तक्रारी" },
    details: [
      { en: "Pay Monthly Bill", hi: "मासिक बिल भरें", mr: "मासिक बिल भरा" },
      { en: "Report Power Cut", hi: "बिजली कटौती की सूचना", mr: "वीज खंडित तक्रार" }
    ]
  },
  {
    id: ServiceType.GAS,
    title: { en: "Gas Services", hi: "गैस सेवाएँ", mr: "गॅस सेवा" },
    icon: "Flame",
    color: "bg-orange-500",
    description: { en: "LPG Booking & Support", hi: "गैस बुकिंग", mr: "गॅस बुकिंग" },
    details: [
      { en: "Refill Booking", hi: "रीफिल बुकिंग", mr: "रीफिल बुकिंग" },
      { en: "New Connection", hi: "नया कनेक्शन", mr: "नवीन कनेक्शन" }
    ]
  }
];

export const getIcon = (iconName: string, size = 24, className = "") => {
  const icons: Record<string, React.ReactNode> = {
    Building2: <Building2 size={size} className={className} />,
    Zap: <Zap size={size} className={className} />,
    Flame: <Flame size={size} className={className} />,
    FileText: <FileText size={size} className={className} />,
    HeartPulse: <HeartPulse size={size} className={className} />,
    ShoppingBasket: <ShoppingBasket size={size} className={className} />,
    Bot: <Bot size={size} className={className} />,
    Store: <Store size={size} className={className} />
  };
  return icons[iconName] || null;
};
