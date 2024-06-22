const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');

// Set up Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/update-profile', [auth, upload.single('photo')], async (req, res) => {
  const { name, email, pastExperience, skillSets, education } = req.body;
  const photo = req.file ? req.file.buffer.toString('base64') : null; // Convert buffer to base64 string

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.pastExperience = pastExperience || user.pastExperience;
    user.skillSets = skillSets ? skillSets.split(',') : user.skillSets;
    user.education = education || user.education;
    if (photo) user.photo = photo;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;





