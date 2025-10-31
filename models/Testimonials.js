const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  testimonialID: { type: Number, required: true, unique: true },
  name: { type: String, trim: true, required: true  },
  place: { type: String, trim: true },
  userPhoto: { type: String, default: null  },
  type: { type: String, enum: ['text', 'video'], required: true },
  description: { type: String },
  videoUpload: { type: String, default: null   },
  youtubeLink: { type: String, default: null   },
  createdBy: { type: String, default: 'admin' },
}, {
  timestamps: true,
  versionKey: false // disables __v field
});

module.exports = mongoose.model('Testimonial', testimonialSchema, 'testimonials');
