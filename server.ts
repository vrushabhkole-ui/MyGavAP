
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const REGISTRY_FILE = path.join(DATA_DIR, "registry.json");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");
const BILLS_FILE = path.join(DATA_DIR, "bills.json");
const TXNS_FILE = path.join(DATA_DIR, "transactions.json");
const NOTICES_FILE = path.join(DATA_DIR, "notices.json");
const NOTIFS_FILE = path.join(DATA_DIR, "notifications.json");
const BIZ_FILE = path.join(DATA_DIR, "businesses.json");
const KEYS_FILE = path.join(DATA_DIR, "officer_keys.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const initFile = (file: string, defaultData: any = []) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
  }
};

const SYSTEM_ACCOUNTS = [
  { id: 'SYS-GRAMPANCHAYAT', name: 'GP Officer', email: 'gp@mygaav.com', password: 'admin123', role: 'admin', department: 'grampanchayat', village: 'Sukhawadi', subDistrict: 'Haveli', district: 'Pune', state: 'Maharashtra', status: 'approved', joinedAt: 'System Config' },
  { id: 'SYS-ELECTRICITY', name: 'MSEB Officer', email: 'elec@mygaav.com', password: 'admin123', role: 'admin', department: 'electricity', village: 'Sukhawadi', subDistrict: 'Haveli', district: 'Pune', state: 'Maharashtra', status: 'approved', joinedAt: 'System Config' },
  { id: 'SYS-GAS', name: 'Gas Agency', email: 'gas@mygaav.com', password: 'admin123', role: 'admin', department: 'gas', village: 'Sukhawadi', subDistrict: 'Haveli', district: 'Pune', state: 'Maharashtra', status: 'approved', joinedAt: 'System Config' },
  { id: 'SYS-CHAVDI', name: 'Revenue Officer', email: 'chavdi@mygaav.com', password: 'admin123', role: 'admin', department: 'chavdi', village: 'Sukhawadi', subDistrict: 'Haveli', district: 'Pune', state: 'Maharashtra', status: 'approved', joinedAt: 'System Config' },
  { id: 'SYS-HEALTH', name: 'Health Officer', email: 'health@mygaav.com', password: 'admin123', role: 'admin', department: 'health', village: 'Sukhawadi', subDistrict: 'Haveli', district: 'Pune', state: 'Maharashtra', status: 'approved', joinedAt: 'System Config' },
  { id: 'SYS-MARKET', name: 'Mandi Supervisor', email: 'mandi@mygaav.com', password: 'admin123', role: 'admin', department: 'market', village: 'Sukhawadi', subDistrict: 'Haveli', district: 'Pune', state: 'Maharashtra', status: 'approved', joinedAt: 'System Config' }
];

initFile(REGISTRY_FILE, SYSTEM_ACCOUNTS);
initFile(REQUESTS_FILE);
initFile(BILLS_FILE, [
  { id: 'BL-9921', userId: 'DEMO-RES-1', village: 'Sukhawadi', subDistrict: 'Haveli', type: 'Home Tax', amount: 1250, dueDate: '25 Dec 2023', issuedAt: '01 Dec 2023', status: 'Unpaid', description: 'Property tax for Financial Year 2023-24' },
  { id: 'BL-8812', userId: 'DEMO-RES-1', village: 'Sukhawadi', subDistrict: 'Haveli', type: 'Water', amount: 450, dueDate: '20 Dec 2023', issuedAt: '05 Dec 2023', status: 'Unpaid', description: 'Monthly water consumption charges' }
]);
initFile(TXNS_FILE);
initFile(NOTICES_FILE, [
  { id: 'N1', village: 'Sukhawadi', subDistrict: 'Haveli', title: 'Monthly Gram Sabha', content: 'Discussion on new water supply project and road maintenance.', category: 'Meeting', date: '20 Oct 2023' },
  { id: 'N2', village: 'Sukhawadi', subDistrict: 'Haveli', title: 'Power Maintenance', content: 'Scheduled power cut on Sunday for substation cleaning.', category: 'Electricity', date: '18 Oct 2023' }
]);
initFile(NOTIFS_FILE);
initFile(BIZ_FILE, [
  { id: 'BZ-1', name: 'Shree Grocery Store', category: 'Grocery', contact: '9876543210', hours: '8 AM - 9 PM', description: 'Fresh farm produce and daily essentials.', ownerName: 'Rahul Deshmukh', village: 'Sukhawadi', subDistrict: 'Haveli', status: 'Approved' },
  { id: 'BZ-2', name: 'Mauli Hair Salon', category: 'Salon', contact: '9876543211', hours: '9 AM - 8 PM', description: 'Modern hair styling and grooming services.', ownerName: 'Sanjay Pawar', village: 'Sukhawadi', subDistrict: 'Haveli', status: 'Approved' }
]);

// Initialize Officer Keys if not present
if (!fs.existsSync(KEYS_FILE)) {
  const keys = new Set<string>();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const permanentKeys = [
    'OFFICER01', 'OFFICER02', 'OFFICER03', 'OFFICER04', 'OFFICER05',
    'MAHA7788', 'PUNE9900', 'GAAV1122', 'FIELD556', 'ADMIN889',
    'KEY2024X', 'KEY2025Y', 'VILLAGE1', 'GAAVHUB9',
    'K8J2M4P9', 'L7N3Q5R1', 'B6V9X2Z4', 'H1G5F8D3', 'S0A2W4E6'
  ];
  permanentKeys.forEach(k => keys.add(k));
  
  while (keys.size < 1000) { // Reduced for performance, can be larger
    let key = '';
    for (let i = 0; i < 8; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    keys.add(key);
  }
  fs.writeFileSync(KEYS_FILE, JSON.stringify(Array.from(keys), null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to read/write
  const readData = (file: string) => JSON.parse(fs.readFileSync(file, "utf-8"));
  const saveData = (file: string, data: any) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Generic Data Routes
  const dataRoutes = [
    { path: "accounts", file: REGISTRY_FILE },
    { path: "requests", file: REQUESTS_FILE },
    { path: "bills", file: BILLS_FILE },
    { path: "transactions", file: TXNS_FILE },
    { path: "notices", file: NOTICES_FILE },
    { path: "notifications", file: NOTIFS_FILE },
    { path: "businesses", file: BIZ_FILE },
  ];

  dataRoutes.forEach(route => {
    app.get(`/api/${route.path}`, (req, res) => {
      res.json(readData(route.file));
    });

    app.post(`/api/${route.path}`, (req, res) => {
      saveData(route.file, req.body);
      res.json({ success: true });
    });
  });

  app.get("/api/officer-keys", (req, res) => {
    res.json(readData(KEYS_FILE));
  });

  // Specific Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const newAccount = req.body;
    const accounts = readData(REGISTRY_FILE);
    
    const exists = accounts.find((a: any) => 
      a.email.toLowerCase() === newAccount.email.toLowerCase() || 
      (newAccount.mobile && a.mobile === newAccount.mobile)
    );

    if (exists) {
      return res.status(400).json({ error: "Account already exists." });
    }

    accounts.push(newAccount);
    saveData(REGISTRY_FILE, accounts);
    res.json({ success: true, account: newAccount });
  });

  // Clear all data
  app.post("/api/admin/clear-data", (req, res) => {
    dataRoutes.forEach(r => saveData(r.file, []));
    res.json({ message: "All data cleared successfully." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
