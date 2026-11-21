// VillageVerse AI: Government-Grade Full-Stack Backend Server
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { villageStore } from './data/villageStore.js';
import { supabase, checkSupabaseConnection } from './services/supabase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Setup Socket.IO for live digital twin telemetry
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration for Image & Audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `upload-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// File Upload endpoint for Grievance photo/voice
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});

// Mount Main API Router
app.use('/api', apiRouter);

// Health check
const healthHandler = async (req, res) => {
  const sbStatus = await checkSupabaseConnection();
  res.json({
    status: 'Healthy',
    platform: 'VillageVerse AI Backend',
    region: 'Shivalli Gram Panchayat, Mandya, Karnataka',
    supabase: {
      url: process.env.SUPABASE_URL || 'https://phfrwlxssexgltvpvgap.supabase.co',
      status: sbStatus.connected ? 'Connected' : 'Disconnected',
      tablesMigrated: sbStatus.tablesMigrated,
      message: sbStatus.message
    },
    timestamp: new Date().toISOString(),
    version: '1.0.0-production'
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background: #0f172a; color: #f8fafc; min-height: 100vh;">
      <h1 style="color: #38bdf8;">VillageVerse AI – Backend Server</h1>
      <p style="color: #94a3b8; font-size: 1.1rem;">AI-Powered Digital Twin for Intelligent Village Development</p>
      <div style="background: #1e293b; padding: 20px; border-radius: 8px; max-width: 600px; margin: 30px auto; border: 1px solid #334155; text-align: left;">
        <p><strong>Status:</strong> <span style="color: #4ade80;">Active & Ready</span></p>
        <p><strong>Panchayat:</strong> Shivalli Gram Panchayat, Mandya, Karnataka</p>
        <p><strong>API Endpoint:</strong> <code>/api</code></p>
        <p><strong>Socket.IO:</strong> Active for real-time telemetry updates</p>
      </div>
    </div>
  `);
});

// Socket.io Events & Live Telemetry Simulation
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Broadcast initial telemetry
  socket.emit('telemetry:update', {
    timestamp: new Date().toISOString(),
    power_kw: 120 + Math.floor(Math.random() * 8),
    water_flow_lpm: 420 + Math.floor(Math.random() * 20),
    aqi: 42 + Math.floor(Math.random() * 3),
    soil_moisture: 64 + (Math.random() * 2 - 1).toFixed(1)
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Periodic live sensor telemetry simulation (every 10 seconds)
setInterval(() => {
  const telemetry = {
    timestamp: new Date().toISOString(),
    power_kw: 118 + Math.floor(Math.random() * 12),
    water_flow_lpm: 415 + Math.floor(Math.random() * 30),
    aqi: 40 + Math.floor(Math.random() * 6),
    soil_moisture: (63.5 + Math.random() * 2).toFixed(1),
    active_complaints: villageStore.complaints.filter(c => c.status !== 'Resolved').length
  };
  io.emit('telemetry:update', telemetry);
}, 10000);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` VillageVerse AI - Digital Twin Backend Running`);
  console.log(` Port: ${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Region: Shivalli Gram Panchayat, Mandya, Karnataka`);
  console.log(`=======================================================`);
});
