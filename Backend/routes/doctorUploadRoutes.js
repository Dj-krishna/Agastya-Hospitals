const express = require('express');
const Busboy = require('busboy');
const Doctor = require('../models/Doctors');
const { getBuckets } = require('../db/gridfs');

const router = express.Router();

function uploadToGridFS(req, bucketName) {
	return new Promise((resolve, reject) => {
		const buckets = getBuckets();
		const bucket = buckets[bucketName];
		if (!bucket) return reject(new Error('Storage not ready'));
		const busboy = Busboy({ headers: req.headers, limits: { files: 1 } });
		let done = false;
		busboy.on('file', (fieldname, file, info) => {
			const filename = info.filename || `upload_${Date.now()}`;
			const contentType = info.mimeType || 'application/octet-stream';
			const uploadStream = bucket.openUploadStream(filename, { contentType });
			file.pipe(uploadStream)
				.on('error', (err) => {
					if (!done) {
						done = true;
						reject(err);
					}
				})
				.on('finish', () => {
					if (done) return;
					done = true;
					resolve({
						fileId: uploadStream.id,
						filename: uploadStream.filename,
						contentType,
						length: uploadStream.length,
						uploadDate: uploadStream.uploadDate,
						bucket: bucketName
					});
				});
		});
		busboy.on('finish', () => {
			if (!done) reject(new Error('No file uploaded'));
		});
		busboy.on('error', reject);
		req.pipe(busboy);
	});
}

router.post('/:doctorID/upload/profile-image', async (req, res) => {
	try {
		const doctor = await Doctor.findOne({ doctorID: Number(req.params.doctorID) });
		if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
		const ref = await uploadToGridFS(req, 'images');
		doctor.profileImageGfs = ref;
		await doctor.save();
		return res.status(201).json({ message: 'Profile image uploaded', file: ref });
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
});

router.post('/:doctorID/upload/video', async (req, res) => {
	try {
		const doctor = await Doctor.findOne({ doctorID: Number(req.params.doctorID) });
		if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
		const ref = await uploadToGridFS(req, 'videos');
		doctor.introVideoGfs = ref;
		await doctor.save();
		return res.status(201).json({ message: 'Video uploaded', file: ref });
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
});

module.exports = router;


