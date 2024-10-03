// server.js

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'your-secret-key'; // In a real app, this should be an environment variable

let users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('password', 8) }
];

let devices = {
  thermostat: { temperature: 20 },
  humidity: 50,
  lights: { status: false },
  security: { status: 'Disarmed' }
};

// Generate mock historical data
const generateHistoricalData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toISOString(),
      temperature: Math.floor(Math.random() * (25 - 18 + 1) + 18), // Random temperature between 18-25
      humidity: Math.floor(Math.random() * (60 - 40 + 1) + 40), // Random humidity between 40-60
    });
  }
  return data;
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ error: 'Invalid username or password' });
  }
});

app.get('/api/devices', authenticateToken, (req, res) => {
  res.json(devices);
});

app.get('/api/historical-data', authenticateToken, (req, res) => {
  res.json(generateHistoricalData());
});

app.post('/api/control', authenticateToken, (req, res) => {
  const { device, action, value } = req.body;
  
  if (device === 'thermostat') {
    devices.thermostat.temperature = value;
  } else if (device === 'lights') {
    devices.lights.status = value;
  } else if (device === 'security') {
    devices.security.status = value;
  } else {
    return res.status(400).json({ error: 'Invalid device' });
  }
  
  res.json({ success: true, devices });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});