require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5001',
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
app.use(express.urlencoded({ extended: true }));

// Serve React client
const DIST_PATH = path.join(__dirname, '../client/dist');
const INDEX_PATH = path.join(DIST_PATH, 'index.html');
app.use(express.static(DIST_PATH));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/mealplan', require('./routes/mealplan'));
app.use('/api/workout', require('./routes/workout'));
app.use('/api/grocery', require('./routes/grocery'));
app.use('/api/macro-summary', require('./routes/macroSummary'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Catch-all for React Router
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(INDEX_PATH);
});

// Run nutrition enrichment on startup (non-blocking)
try {
  const { enrichNutrition } = require('./scripts/enrichNutrition');
  enrichNutrition().catch(console.error);
} catch (_) {}

app.listen(PORT, () => console.log(`FridgeToFit backend running on :${PORT}`));
