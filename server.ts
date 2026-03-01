
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";

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

const SYSTEM_ACCOUNTS: any[] = [];

initFile(REGISTRY_FILE, SYSTEM_ACCOUNTS);
initFile(REQUESTS_FILE, []);
initFile(BILLS_FILE, []);
initFile(TXNS_FILE, []);
initFile(NOTICES_FILE, []);
initFile(NOTIFS_FILE, []);
initFile(BIZ_FILE, []);

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
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }
  });
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Helper to read/write
  const readData = (file: string) => {
    try {
      if (!fs.existsSync(file)) return [];
      const content = fs.readFileSync(file, "utf-8");
      if (!content.trim()) return [];
      return JSON.parse(content);
    } catch (e) {
      console.error(`Error reading ${file}:`, e);
      return [];
    }
  };
  const saveData = (file: string, data: any) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

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
      io.emit(`data-update-${route.path}`, req.body);
      res.json({ success: true });
    });
  });

  app.get("/api/officer-keys", (req, res) => {
    res.json(readData(KEYS_FILE));
  });

  // Specific Auth Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password, role, department } = req.body;
    const accounts = readData(REGISTRY_FILE);
    
    const user = accounts.find((a: any) => 
      a.email && email && a.email.toLowerCase() === email.toLowerCase() && 
      a.password === password &&
      a.role === role
    );

    if (user) {
      if (user.role === 'user' && user.status === 'pending') {
        return res.status(403).json({ error: 'Your account is pending approval from Grampanchayat. Please try again later.' });
      }
      if (user.role === 'admin' && user.status === 'pending') {
        return res.status(403).json({ error: 'Your account is pending approval from Developer. Please try again later.' });
      }
      if (user.role === 'user' && user.status === 'rejected') {
        return res.status(403).json({ error: 'Your registration has been rejected. Please contact Grampanchayat.' });
      }
      res.json({ success: true, account: user });
    } else {
      res.status(401).json({ error: "Invalid credentials." });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    try {
      const newAccount = req.body;
      // console.log("Registering:", newAccount.email, newAccount.role);
      let accounts = readData(REGISTRY_FILE);
      if (!Array.isArray(accounts)) {
        accounts = [];
      }
      
      const exists = accounts.find((a: any) => 
        (a.email && newAccount.email && a.email.toLowerCase() === newAccount.email.toLowerCase()) || 
        (newAccount.mobile && a.mobile && String(a.mobile) === String(newAccount.mobile))
      );

      if (exists) {
        return res.status(400).json({ error: "Account already exists." });
      }

      accounts.push(newAccount);
      saveData(REGISTRY_FILE, accounts);
      io.emit('data-update-accounts', accounts);
      res.json({ success: true, account: newAccount, accounts });
    } catch (e) {
      console.error("Registration error:", e);
      res.status(500).json({ error: "Registration failed due to server error." });
    }
  });

  // Clear all data
  app.post("/api/admin/clear-data", (req, res) => {
    dataRoutes.forEach(r => {
      if (r.path === 'accounts') {
        saveData(r.file, SYSTEM_ACCOUNTS);
        io.emit(`data-update-${r.path}`, SYSTEM_ACCOUNTS);
      } else {
        saveData(r.file, []);
        io.emit(`data-update-${r.path}`, []);
      }
    });
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
