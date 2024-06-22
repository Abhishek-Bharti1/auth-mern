const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pastExperience: {
    type: String
  },
  skillSets: {
    type: [String]
  },
  education: {
    type: String
  },
  photo: {
    type: String // Store photo as base64 string
  }
});

module.exports = mongoose.model('User', UserSchema);
