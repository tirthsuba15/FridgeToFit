require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

const DIST_PATH = path.join(__dirname, '../client/dist');
const INDEX_PATH = path.join(DIST_PATH, 'index.html');

// Serve React client static assets
app.use(express.static(DIST_PATH));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/debug-paths', (req, res) => {
  const fs = require('fs');
  let appContents = [], clientContents = [];
  try { appContents = fs.readdirSync('/app'); } catch (_) {}
  try { clientContents = fs.readdirSync('/app/client'); } catch (_) {}
  res.json({
    __dirname,
    cwd: process.cwd(),
    DIST_PATH,
    distExists: fs.existsSync(DIST_PATH),
    indexExists: fs.existsSync(INDEX_PATH),
    appContents,
    clientContents,
  });
});

// Catch-all for React Router — serve index.html for all non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(INDEX_PATH);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
