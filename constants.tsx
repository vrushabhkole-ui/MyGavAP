
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
    "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal"],
    "Bhandara": ["Bhandara", "Tumsar", "Pauni", "Mohadi", "Sakoli", "Lakhani", "Lakhandur"],
    "Chandrapur": ["Chandrapur", "Bhadravati", "Warora", "Chimur", "Nagbhir", "Brahmapuri", "Sindewahi", "Mul", "Sawali", "Gondpipri", "Korpana", "Rajura", "Ballarpur", "Pombhurna", "Jiwati"],
    "Dhule": ["Dhule", "Sakri", "Sindkhede", "Shirpur"],
    "Gadchiroli": ["Gadchiroli", "Dhanora", "Chamorshi", "Mulchera", "Aheri", "Sironcha", "Etapalli", "Bhamragad", "Kurkheda", "Armori", "Korchi", "Desaiganj"],
    "Gondia": ["Gondia", "Tirora", "Goregaon", "Arjuni Morgaon", "Amgaon", "Salekasa", "Sadak Arjuni", "Deori"],
    "Hingoli": ["Hingoli", "Kalnuri", "Sengon", "Basmath", "Aundha Nagnath"],
    "Jalna": ["Jalna", "Bhokardan", "Jafrabad", "Badnapur", "Ambad", "Ghansawangi", "Partur", "Mantha"],
    "Nandurbar": ["Nandurbar", "Navapur", "Shahada", "Taloda", "Akkalkuwa", "Akrani"],
    "Osmanabad": ["Osmanabad", "Tuljapur", "Umarga", "Lohara", "Kalamb", "Bhum", "Paranda", "Washi"],
    "Palghar": ["Palghar", "Vasai", "Dahanu", "Talasari", "Jawhar", "Mokhada", "Wada", "Vikramgad"],
    "Parbhani": ["Parbhani", "Jintur", "Sailu", "Manwath", "Pathri", "Sonpeth", "Gangakhed", "Palam", "Purna"],
    "Sindhudurg": ["Sawantwadi", "Kudal", "Vengurla", "Malvan", "Kankavli", "Devgad", "Vaibhavwadi", "Dodamarg"],
    "Wardha": ["Wardha", "Seloo", "Arvi", "Ashti", "Karanja", "Hinganghat", "Samudrapur", "Deoli"],
    "Washim": ["Washim", "Risod", "Malegaon", "Mangrulpir", "Karanja", "Manora"],
    "Yavatmal": ["Yavatmal", "Babulgaon", "Kalamb", "Darwha", "Digras", "Arni", "Umarkhed", "Hadgaon", "Mahagaon", "Pusad", "Wani", "Maregaon", "Zari Jamani", "Kelapur", "Ghatanji", "Ralegaon"]
  },
  "villages": {
    "Haveli": ["Sukhawadi", "Hadapsar", "Loni Kalbhor", "Wagholi", "Kharadi", "Manjari", "Dhayari", "Nanded", "Shivane", "Uruli Kanchan", "Theur", "Bakori", "Kadamwak Vasti", "Kunjirwadi", "Sortapwadi", "Naigaon", "Loni-Kalbhor", "Phursungi"],
    "Mulshi": ["Hinjewadi", "Pirangut", "Bhugaon", "Bavdhan", "Paud", "Lavasa", "Male", "Mutha", "Kashig", "Kothurne", "Nande", "Sus", "Marunji", "Maan", "Gherane", "Kule", "Rihe"],
    "Shirur": ["Shirur", "Shikrapur", "Sanamwadi", "Koregaon Bhima", "Pabal", "Talegaon Dhamdhere", "Nhavare", "Kanhur Mesai", "Ranjangaon Ganpati", "Kardelwadi", "Nimgaon Mhalungi"],
    "Maval": ["Lonavala", "Khandala", "Talegaon Dabhade", "Kamshet", "Kanhe", "Vadgaon", "Malavli", "Karla", "Kusgaon", "Pimpri", "Sate"],
    "Bhor": ["Bhor", "Nasrapur", "Kapurhol", "Kikvi", "Rajgad", "Sangvi", "Nigade", "Kenjal", "Wing", "Ambavade"],
    "Daund": ["Daund", "Patas", "Kurkumbh", "Yavat", "Kedgaon", "Kashti", "Varvand", "Khor", "Rahu", "Gopalwadi"],
    "Indapur": ["Indapur", "Bhigwan", "Bawada", "Nimgaon Ketki", "Anthurne", "Lasurne", "Kalas", "Shetphal", "Loni Devkar"],
    "Junnar": ["Junnar", "Otur", "Narayangaon", "Alephata", "Belhe", "Aptale", "Ghodegaon", "Rajur", "Dingore"],
    "Khed": ["Chakan", "Rajgurunagar", "Alandi", "Mahalunge", "Khed City", "Pait", "Shel-Pimpalgaon", "Koye", "Waki"],
    "Ambegaon": ["Manchar", "Ghodegaon", "Pargaon", "Nirud", "Shinoli", "Loni", "Walunj", "Kalamb"],
    "Purandar": ["Saswad", "Jejuri", "Neera", "Walha", "Pimpale", "Diva", "Garade", "Kumbharvalan"],
    "Velhe": ["Velhe", "Panshet", "Gunjavane", "Margasani", "Pasali", "Kuran", "Ambavane"],
    "Nagpur": ["Nagpur City", "Hudkeshwar", "Besa", "Beltarodi", "Wadi", "Digdoh", "Nildoh", "Parsodi"],
    "Kamptee": ["Kamptee City", "Kanhan", "Yerkheda", "Bhilgaon", "Gumthala", "Mahadula"],
    "Hingna": ["Hingna", "Wanadongri", "Raipur", "Mandwa", "Sukali", "Takalghat"],
    "Aurangabad": ["Aurangabad City", "Waluj", "Bajaj Nagar", "Chitegaon", "Pandharpur", "Tisgaon", "Maliwada"],
    "Kannad": ["Kannad City", "Pishore", "Chapaner", "Nagad", "Amba"],
    "Paithan": ["Paithan City", "Bidkin", "Dhupkhed", "Mudhalwadi", "Pachod"],
    "Ahmednagar": ["Ahmednagar City", "Kedgaon", "Burudgaon", "Nimbodi", "Nagapur", "Vilad Ghat"],
    "Rahuri": ["Rahuri City", "Vambori", "Deolali Pravara", "Taklibhan", "Guhar"],
    "Sangamner": ["Sangamner City", "Ashwi", "Loni", "Sakur", "Talegaon Digar"],
    "Satara": ["Satara City", "Kodoli", "Khed", "Wadhe", "Limb", "Padali"],
    "Karad": ["Karad City", "Ogalewadi", "Malkapur", "Umbraj", "Kole", "Masur"],
    "Wai": ["Wai City", "Panchgani", "Bhuinj", "Surur", "Dhom"],
    "Solapur North": ["Solapur City", "Kegaon", "Bale", "Haglur", "Degaon"],
    "Solapur South": ["Mandrup", "Vairag", "Kumbhari", "Hotgi", "Valsang"],
    "Pandharpur": ["Pandharpur City", "Bhalwani", "Karkamb", "Shetphal", "Wakhari", "Kasegaon", "Tandulwadi", "Bhandishegaon"],
    "Barshi": ["Barshi City", "Vairag", "Pangri", "Gaudgaon", "Kari"],
    "Akkalkot": ["Akkalkot City", "Maindargi", "Dudhani", "Chapalgaon", "Wagdari"],
    "Mohol": ["Mohol City", "Kurul", "Kamti", "Shetphal", "Penur"],
    "Madha": ["Madha City", "Kurduwadi", "Tembhurni", "Modnimb", "Shetphal"],
    "Phaltan": ["Phaltan City", "Taradgaon", "Sakharwadi", "Barad", "Vathar"],
    "Koregaon": ["Koregaon City", "Rahimatpur", "Kumthe", "Wathar", "Pimpode"],
    "Murbad": ["Murbad City", "Saralgaon", "Dhasai", "Tokawade", "Kudavali"],
    "Shahapur": ["Shahapur City", "Asangaon", "Vashind", "Dolkhamb", "Kasara"],
    "Pen": ["Pen City", "Jite", "Kamarly", "Dadara", "Vat"],
    "Karjat": ["Karjat City", "Neral", "Matheran", "Khandas", "Kashele"],
    "Mangaon": ["Mangaon City", "Nizampur", "Lonere", "Indapur", "Goregaon"],
    "Sangameshwar": ["Sangameshwar City", "Derukh", "Makhajan", "Phungus", "Tural"],
    "Rajapur": ["Rajapur City", "Nate", "Pachal", "Oni", "Jaitapur"],
    "Panhala": ["Panhala City", "Kodoli", "Bambavade", "Kotoli", "Kale"],
    "Kagal": ["Kagal City", "Murgud", "Bidri", "Kapshi", "Sangaon"],
    "Shirol": ["Shirol City", "Jaisingpur", "Kurundwad", "Nandani", "Dharangutti"],
    "Mudkhed": ["Mudkhed City", "Barad", "Mugdha", "Chikhalwadi"],
    "Bhokar": ["Bhokar City", "Kini", "Matul", "Lagul"],
    "Loha": ["Loha City", "Sonkhed", "Malakoli", "Kapra"],
    "Raver": ["Raver City", "Khanpur", "Waghoda", "Kharda"],
    "Chopda": ["Chopda City", "Adavad", "Hated", "Dhanora"],
    "Amalner": ["Amalner City", "Marwad", "Dahiwad", "Pali"],
    "Tasgaon": ["Tasgaon City", "Anjani", "Balgavade", "Bhilawadi", "Borgaon", "Chinchani", "Dahivadi", "Hatnur", "Kavathe", "Kundal", "Limb", "Manerajuri", "Nimani", "Ped", "Savarde", "Visapur", "Yeralewadi", "Yeral", "Kumathe"],
    "Atpadi": ["Atpadi City", "Dighanchi", "Nimbavade", "Palsi"],
    "Kadegaon": ["Kadegaon City", "Wangi", "Nerli", "Talsangi"],
    "Ahmedpur": ["Ahmedpur City", "Kingaon", "Shirur", "Hadolti"],
    "Nilanga": ["Nilanga City", "Aurad Shahajani", "Kasarsirsi", "Madansuri"],
    "Ausa": ["Ausa City", "Killari", "Lamjana", "Bhada"],
    "Ashti": ["Ashti City", "Kada", "Amalner", "Doithan"],
    "Georai": ["Georai City", "Umapur", "Chakala", "Madalmohi"],
    "Majalgaon": ["Majalgaon City", "Talkhed", "Nittur", "Pimpri"],
    "Morshi": ["Morshi City", "Hiwarkhed", "Rithpur", "Ner Pinglai"],
    "Warud": ["Warud City", "Shendurjana Ghat", "Benoda", "Loni"],
    "Daryapur": ["Daryapur City", "Yeoda", "Khallar", "Sanglud"],
    "Akot": ["Akot City", "Chohatta", "Hiwarkhed", "Adgaon"],
    "Telhara": ["Telhara City", "Hivarkhed", "Panchgavan", "Warwat"],
    "Chikhli": ["Chikhli City", "Amrapur", "Undri", "Eklara"],
    "Malkapur": ["Malkapur City", "Nandura", "Motala", "Wadner"],
    "Mehkar": ["Mehkar City", "Janephal", "Dongaon", "Loni"],
    "Thane": ["Thane City", "Majiwada", "Kopri", "Kalwa", "Mumbra", "Diva", "Kolshet", "Balkum", "Ghodbunder", "Waghbil"],
    "Kalyan": ["Kalyan City", "Dombivli", "Titwala", "Mohone", "Shahad", "Ambivli"],
    "Bhiwandi": ["Bhiwandi City", "Padgha", "Khoni", "Anjur", "Pise"],
    "Alibag": ["Alibag", "Revdanda", "Chaul", "Akshi", "Nagaon", "Kihim", "Vadavali", "Khandala"],
    "Panvel": ["Panvel City", "Kamothe", "Kalamboli", "Khandeshwar", "New Panvel", "Taloja", "Vichumbe", "Koproli", "Kharghar", "Ulwe", "Dronagiri", "Palaspe", "Shirdhon"],
    "Ratnagiri": ["Ratnagiri City", "Mirya", "Pawas", "Ganpatipule", "Malgund", "Shirgaon", "Nachane"],
    "Chiplun": ["Chiplun City", "Sawarde", "Kherdi", "Pophali", "Dhamandevi"],
    "Karveer": ["Kolhapur", "Uchgaon", "Gandhinagar", "Mudshingi", "Sarnobatwadi", "Vashi", "Shiroli", "Gokul Shirgaon"],
    "Hatkanangale": ["Ichalkaranji", "Hatkanangale", "Peth Vadgaon", "Rukadi", "Herle"],
    "Nanded": ["Nanded City", "Waghala", "Vishnupuri", "Tuppa", "CIDCO"],
    "Mukhed": ["Mukhed City", "Jahoor", "Barahali", "Ravi"],
    "Jalgaon": ["Jalgaon City", "Nashirabad", "Pimprala", "Mehrun", "Kusumba"],
    "Bhusawal": ["Bhusawal City", "Varangaon", "Kandari", "Sakegaon"],
    "Miraj": ["Arag", "Bedag", "Belanki", "Bolwad", "Erandoli", "Gundewadi", "Kalambi", "Kanadewadi", "Khanderajuri", "Lingnur", "Malgaon", "Mallewadi", "Mhaishal", "Nilji", "Salgare", "Siddhewadi", "Tanang", "Yerla", "Bisur", "Inam Dhamani", "Kavalapur", "Kharsing", "Kumthe", "Miraj Rural", "Nandra", "Padamale", "Patgaon", "Shipur", "Takari", "Vaddi", "Sangli City", "Kupwad"],
    "Walwa": ["Islampur", "Ashta", "Bahe", "Boregaon", "Chikurde", "Dhavali", "Hubli", "Kameri", "Kasegaon", "Kurundwad", "Narsingpur", "Peth", "Rethare", "Sakharale", "Shirgaon", "Tandulwadi", "Walwa Village", "Yede Nipani"],
    "Latur": ["Latur City", "Pakharsangvi", "Arvi", "Kanheri", "Harangul"],
    "Udgir": ["Udgir City", "Deoni", "Nalegaon", "Wadhwana"],
    "Beed": ["Beed City", "Nalwandi", "Pali", "Limba"],
    "Parli": ["Parli City", "Pangri", "Dharmapuri", "Sirala"],
    "Amravati": ["Amravati City", "Badnera", "Walgaon", "Loni", "Kathora"],
    "Achalpur": ["Paratwada", "Achalpur City", "Chandur Bazar", "Shirala"],
    "Akola": ["Akola City", "Shivani", "Malkapur", "Kharda", "Umri"],
    "Buldhana": ["Buldhana City", "Warwand", "Dhad", "Padli"],
    "Khamgaon": ["Khamgaon City", "Shegaon", "Pala", "Ganeshpur"],
    "default": ["Gaothan", "Ward No 1", "Ward No 2", "Station Area", "Market Yard", "Gram Panchayat Area", "Main Road", "Vikas Nagar", "Shivaji Chowk", "Adarsh Nagar", "Hanuman Mandir Area"]
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
  payMonthlyBill: { en: 'Pay Monthly Bill', hi: 'मासिक बिल का भुगतान करें', mr: 'मासिक बिल भरा' },
  paymentPending: { en: 'Payment Pending', hi: 'भुगतान लंबित', mr: 'पेमेंट प्रलंबित' },
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
  healthId: { en: 'Health ID / ABHA ID', hi: 'स्वास्थ्य आईडी / आभा आईडी', mr: 'आरोग्य आयडी / आभा आयडी' },
  selectDepartment: { en: 'Select Your Department', hi: 'अपने विभाग का चयन करें', mr: 'आपला विभाग निवडा' },
  moreServices: { en: 'More Services', hi: 'अधिक सेवाएँ', mr: 'अधिक सेवा' },
  lessServices: { en: 'Show Less', hi: 'कम दिखाएं', mr: 'कमी दाखवा' }
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
      { en: "Pay Monthly Bill", hi: "मासिक बिल भरें", mr: "मासिक बिल भरा" }
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
  },
  {
    id: ServiceType.HEALTH,
    title: { en: "Health Services", hi: "स्वास्थ्य सेवाएँ", mr: "आरोग्य सेवा" },
    icon: "HeartPulse",
    color: "bg-rose-500",
    description: { en: "Public Health & Wellness", hi: "जन स्वास्थ्य", mr: "सार्वजनिक आरोग्य" },
    details: [
      { en: "OPD Registration", hi: "ओपीडी पंजीकरण", mr: "ओपीडी नोंदणी" }
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
