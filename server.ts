
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const REGISTRY_FILE = path.join(DATA_DIR, "registry.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Initialize registry if it doesn't exist
if (!fs.existsSync(REGISTRY_FILE)) {
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify([]));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Clear all data (as requested by user)
  app.post("/api/admin/clear-data", (req, res) => {
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify([]));
    res.json({ message: "All registration data cleared successfully." });
  });

  // Get all accounts (for matching)
  app.get("/api/auth/accounts", (req, res) => {
    const data = fs.readFileSync(REGISTRY_FILE, "utf-8");
    res.json(JSON.parse(data));
  });

  // Register new account
  app.post("/api/auth/register", (req, res) => {
    const newAccount = req.body;
    const data = fs.readFileSync(REGISTRY_FILE, "utf-8");
    const accounts = JSON.parse(data);
    
    // Check if already exists
    const exists = accounts.find((a: any) => 
      a.email.toLowerCase() === newAccount.email.toLowerCase() || 
      (newAccount.mobile && a.mobile === newAccount.mobile)
    );

    if (exists) {
      return res.status(400).json({ error: "Account already exists." });
    }

    accounts.push(newAccount);
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(accounts, null, 2));
    res.json({ success: true, account: newAccount });
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
