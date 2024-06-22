const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
