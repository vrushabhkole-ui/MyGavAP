
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: any = null;
try {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
  const firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
  console.log("Firebase initialized successfully in server");
} catch (e) {
  console.error("Failed to initialize Firebase in server:", e);
}

const getAccounts = async () => {
  if (!db) return readData(REGISTRY_FILE);
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => doc.data());
  } catch (e) {
    console.error("Error fetching accounts from Firestore:", e);
    return readData(REGISTRY_FILE);
  }
};

const saveAccount = async (account: any) => {
  if (!db) {
    const accounts = readData(REGISTRY_FILE);
    accounts.push(account);
    saveData(REGISTRY_FILE, accounts);
    return accounts;
  }
  try {
    await setDoc(doc(db, 'users', account.id), account);
    return await getAccounts();
  } catch (e) {
    console.error("Error saving account to Firestore:", e);
    throw e;
  }
};

const DATA_DIR = (() => {
  const defaultDir = path.join(__dirname, "data");
  try {
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir);
    }
    fs.accessSync(defaultDir, fs.constants.W_OK);
    return defaultDir;
  } catch (e) {
    console.warn("Cannot write to default data directory, using /tmp/data");
    const tmpDir = path.join("/tmp", "data");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }
    return tmpDir;
  }
})();

const REGISTRY_FILE = path.join(DATA_DIR, "registry.json");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");
const BILLS_FILE = path.join(DATA_DIR, "bills.json");
const TXNS_FILE = path.join(DATA_DIR, "transactions.json");
const NOTICES_FILE = path.join(DATA_DIR, "notices.json");
const NOTIFS_FILE = path.join(DATA_DIR, "notifications.json");
const BIZ_FILE = path.join(DATA_DIR, "businesses.json");
const KEYS_FILE = path.join(DATA_DIR, "officer_keys.json");
const OTP_STORE: Record<string, { code: string, expires: number }> = {};

// Ensure data directory exists (double check)
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR);
  } catch (e) {
    console.error("Failed to create data directory:", e);
  }
}

const initFile = (file: string, defaultData: any = []) => {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
    }
  } catch (e) {
    console.error(`Failed to init file ${file}:`, e);
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
try {
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
} catch (e) {
  console.error("Failed to initialize officer keys:", e);
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }
  });
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Request logging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

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
  
  const saveData = (file: string, data: any) => {
    try {
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(`Error writing to ${file}:`, e);
      throw e;
    }
  };

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // API Routes
  app.get(["/api/health", "/api/health/"], (req, res) => {
    console.log("Health check request received");
    res.json({ status: "ok", version: "1.0.3", time: new Date().toISOString() });
  });

  app.get(["/api/ping", "/api/ping/"], (req, res) => {
    res.json({ message: "pong" });
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
    app.get([`/api/${route.path}`, `/api/${route.path}/`], async (req, res) => {
      if (route.path === 'accounts') {
        res.json(await getAccounts());
      } else {
        res.json(readData(route.file));
      }
    });

    app.post([`/api/${route.path}`, `/api/${route.path}/`], async (req, res) => {
      if (route.path === 'accounts') {
        // req.body is an array of accounts in this route
        // This is a bulk save, which is tricky. Let's just use the local file for bulk, or skip it.
        // Actually, the frontend might be sending the full array.
        // Let's just save the first one if it's an array, or iterate.
        // Wait, the frontend usually uses /sync for individual updates.
        // If it sends a full array, we can just save them all.
        if (Array.isArray(req.body)) {
          for (const acc of req.body) {
            if (db) await setDoc(doc(db, 'users', acc.id), acc);
          }
        }
        const accounts = await getAccounts();
        io.emit(`data-update-${route.path}`, accounts);
        res.json({ success: true });
      } else {
        saveData(route.file, req.body);
        io.emit(`data-update-${route.path}`, req.body);
        res.json({ success: true });
      }
    });

    app.post([`/api/${route.path}/sync`, `/api/${route.path}/sync/`], async (req, res) => {
      const { action, item } = req.body;
      
      if (route.path === 'accounts') {
        let currentData = await getAccounts();
        if (action === 'add' || action === 'update') {
          await saveAccount(item);
          currentData = await getAccounts();
        } else if (action === 'delete') {
          // We need a deleteAccount function, but for now we can just ignore delete or implement it
          // Let's just implement it inline
          if (db) {
            const { deleteDoc } = await import('firebase/firestore');
            await deleteDoc(doc(db, 'users', item.id));
          } else {
            currentData = currentData.filter((x: any) => x.id !== item.id);
            saveData(route.file, currentData);
          }
          currentData = await getAccounts();
        }
        io.emit(`data-update-${route.path}`, currentData);
        res.json({ success: true, data: currentData });
      } else {
        let currentData = readData(route.file);
        if (!Array.isArray(currentData)) currentData = [];
        
        if (action === 'add' || action === 'update') {
          const exists = currentData.findIndex((x: any) => x.id === item.id);
          if (exists >= 0) {
            currentData[exists] = { ...currentData[exists], ...item };
          } else {
            currentData.unshift(item);
          }
        } else if (action === 'delete') {
          currentData = currentData.filter((x: any) => x.id !== item.id);
        }
        
        saveData(route.file, currentData);
        io.emit(`data-update-${route.path}`, currentData);
        res.json({ success: true, data: currentData });
      }
    });
  });

  app.get(["/api/officer-keys", "/api/officer-keys/"], (req, res) => {
    res.json(readData(KEYS_FILE));
  });

  // OTP Auth Routes
  app.post(["/api/auth/otp/send", "/api/auth/otp/send/"], async (req, res) => {
    const { mobile, type } = req.body; // type: 'login' | 'register'
    if (!mobile || !/^\d{10}$/.test(String(mobile))) {
      return res.status(400).json({ error: "Invalid mobile number." });
    }

    const accounts = await getAccounts();
    const user = accounts.find((a: any) => String(a.mobile) === String(mobile));

    if (type === 'login' && !user) {
      return res.status(404).json({ error: "Mobile number not registered." });
    }
    if (type === 'register' && user) {
      return res.status(400).json({ error: "Mobile number already registered." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    OTP_STORE[mobile] = {
      code: otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    console.log(`[OTP] Sent to ${mobile}: ${otp}`);
    // In a real app, you would call an SMS gateway here (e.g., Twilio, Msg91)
    
    res.json({ success: true, message: "OTP sent successfully." });
  });

  app.post(["/api/auth/otp/verify", "/api/auth/otp/verify/"], async (req, res) => {
    const { mobile, otp, type, accountData } = req.body;
    const stored = OTP_STORE[mobile];

    if (!stored || stored.code !== otp || stored.expires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    delete OTP_STORE[mobile];

    const accounts = await getAccounts();
    if (type === 'login') {
      const user = accounts.find((a: any) => String(a.mobile) === String(mobile));
      if (!user) return res.status(404).json({ error: "User not found." });
      res.json({ success: true, account: user });
    } else {
      // For registration, we might want to actually create the account here or just return success
      // If accountData is provided, we create it
      if (accountData) {
        const exists = accounts.find((a: any) => 
          (a.email && accountData.email && a.email.toLowerCase() === accountData.email.toLowerCase()) || 
          (String(a.mobile) === String(mobile))
        );
        if (exists) return res.status(400).json({ error: "Account already exists." });
        
        const updatedAccounts = await saveAccount(accountData);
        io.emit('data-update-accounts', updatedAccounts);
        res.json({ success: true, account: accountData });
      } else {
        res.json({ success: true, message: "OTP verified." });
      }
    }
  });

  // Specific Auth Routes
  app.post(["/api/auth/login", "/api/auth/login/"], async (req, res) => {
    console.log("Login request received for:", req.body?.email);
    const { email, password, role, department } = req.body;
    const accounts = await getAccounts();
    
    const user = accounts.find((a: any) => 
      a.email && email && a.email.toLowerCase() === email.toLowerCase() && 
      a.password === password &&
      a.role === role
    );

    if (user) {
      console.log("Login successful for:", email);
      if (user.role === 'user' && user.status === 'rejected') {
        return res.status(403).json({ error: 'Your registration has been rejected. Please contact Grampanchayat.' });
      }
      res.json({ success: true, account: user });
    } else {
      res.status(401).json({ error: "Invalid credentials." });
    }
  });

  // Global error handler for uncaught exceptions to prevent server crash
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  app.post(["/api/auth/register", "/api/auth/register/"], async (req, res) => {
    console.log("Received registration request for:", req.body?.email);
    try {
      const newAccount = req.body;
      
      if (!newAccount || !newAccount.email) {
        console.error("Registration failed: Missing email");
        return res.status(400).json({ error: "Invalid data: Email is required" });
      }

      if (newAccount.mobile && !/^\d{10}$/.test(String(newAccount.mobile))) {
        return res.status(400).json({ error: "Invalid mobile number. Must be 10 digits." });
      }

      if (newAccount.pincode && !/^\d{6}$/.test(String(newAccount.pincode))) {
        return res.status(400).json({ error: "Invalid pincode. Must be 6 digits." });
      }

      // console.log("Registering:", newAccount.email, newAccount.role);
      let accounts = await getAccounts();
      if (!Array.isArray(accounts)) {
        accounts = [];
      }
      
      const exists = accounts.find((a: any) => 
        (a.email && newAccount.email && a.email.toLowerCase() === newAccount.email.toLowerCase()) || 
        (newAccount.mobile && a.mobile && String(a.mobile) === String(newAccount.mobile))
      );

      if (exists) {
        console.log("Registration failed: Account exists", newAccount.email);
        return res.status(400).json({ error: "Account already exists." });
      }

      const updatedAccounts = await saveAccount(newAccount);
      io.emit('data-update-accounts', updatedAccounts);
      console.log("Registration successful for:", newAccount.email);
      res.json({ success: true, account: newAccount, accounts: updatedAccounts });
    } catch (e: any) {
      console.error("Registration error:", e);
      res.status(500).json({ 
        error: "Registration failed due to server error.", 
        details: e.message,
        stack: process.env.NODE_ENV !== 'production' ? e.stack : undefined
      });
    }
  });

  // Clear all data
  app.post(["/api/admin/clear-data", "/api/admin/clear-data/"], (req, res) => {
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

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled server error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });

  // Catch-all for API 404s (Must be before frontend middleware)
  app.use("/api", (req, res) => {
    console.log(`404 API Request: ${req.method} ${req.url} (Original: ${req.originalUrl})`);
    res.status(404).json({ 
      error: "API endpoint not found", 
      method: req.method, 
      url: req.url,
      originalUrl: req.originalUrl,
      help: "Check if the route is defined in server.ts and if the method matches."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Failed to load Vite:", e);
    }
  } else {
    const distPath = path.join(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.use((_req, res) => {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send("Application not built (index.html missing)");
        }
      });
    } else {
      console.error("Dist folder not found at:", distPath);
      app.use((_req, res) => {
        res.status(500).send("Server Error: Dist folder missing. Please run build.");
      });
    }
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Data directory: ${DATA_DIR}`);
  });
}

startServer();
