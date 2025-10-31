const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { testimonialFilesMiddleware } = require('../middlewares/testimonial-files');

// ---------------- GET ----------------
router.get('/', testimonialController.getTestimonials);

// ---------------- POST ----------------
router.post('/', testimonialFilesMiddleware, testimonialController.addTestimonial);

// ---------------- PUT ----------------
router.put('/', testimonialFilesMiddleware, testimonialController.updateTestimonial);

// ---------------- DELETE ----------------
router.delete('/bulk/:ids', testimonialController.deleteTestimonials);
router.delete('/', testimonialController.deleteTestimonials);

module.exports = router;
