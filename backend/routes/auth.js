const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const dotenv = require('dotenv');
const twilio = require('twilio');
dotenv.config();

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const client = new twilio(accountSid, authToken);

// Route to request OTP
router.post('/request-otp', [check('phone', 'Phone is required').not().isEmpty()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

try {
  let user = await User.findOne({ phone });

  if (!user) {
    user = new User({ phone });
  }

  user.otp = otp;
  user.otpExpire = Date.now() + 1 * 60 * 1000; // OTP valid for 1 minutes
  await user.save();

  await client.messages.create({
    body: `Your OTP is ${otp}`,
    to: phone,
    messagingServiceSid: messagingServiceSid,
  });

  res.status(200).json({ msg: 'OTP sent successfully' });
} catch (err) {
  console.error(err.message);
  res.status(500).send('Server error');
}
});

// Verify OTP and login
// Route to verify OTP and login
router.post('/verify-otp', [check('phone', 'Phone is required').not().isEmpty(), check('otp', 'OTP is required').not().isEmpty()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, otp } = req.body;

  try {
    let user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    if (Date.now() > user.otpExpire) {
      return res.status(400).json({ msg: 'OTP has expired' });
    }

    // Clear the OTP and OTP expiry after successful verification
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    // Generate JWT token
    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Register user
router.post(
  '/register',
  [
    check('phone', 'Phone is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { phone, email, name, password } = req.body;

    try {
      let user = await User.findOne({ phone });
      if (user) return res.status(400).json({ msg: 'User already exists' });

      user = new User({ phone, email, name, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = { user: { id: user.id } };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
        return res.status(400).json({ msg: 'Email already exists' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// Login user
router.post(
  '/login',
  [
    check('phone', 'Phone is required').exists(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { phone, password } = req.body;

    try {
      let user = await User.findOne({ phone });
      if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

      const payload = { user: { id: user.id } };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
