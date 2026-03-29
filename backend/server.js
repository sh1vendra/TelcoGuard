require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const phoneRoutes = require('./routes/phoneRoutes');
const portingRoutes = require('./routes/portingRoutes');
const fraudRoutes = require('./routes/fraudRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.get('/api', (req, res) => {
  res.json({ name: 'TelcoGuard API', version: '1.0.0', docs: '/api-docs' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/porting', portingRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/audit', auditRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
