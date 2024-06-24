// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   pastExperience: {
//     type: String
//   },
//   skillSets: {
//     type: [String]
//   },
//   education: {
//     type: String
//   },
//   photo: {
//     type: String // Store photo as base64 string
//   }
// });

// module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return !this.otp; // Name is required only if OTP is not set
    }
  },
  email: {
    type: String,
    required: function() {
      return !this.otp; // Email is required only if OTP is not set
    },
    unique: function() {
      return !this.otp; // Email must be unique only if OTP is not set
    }
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return !this.otp; // Password is required only if OTP is not set
    }
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
  },
  otp: {
    type: String
  },
  otpExpire: {
    type: Date
  }
});

module.exports = mongoose.model('User', UserSchema);
