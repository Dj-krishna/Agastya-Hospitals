const express = require('express');
const { ObjectId } = require('mongodb');
const { getBuckets } = require('../db/gridfs');

const router = express.Router();

router.get('/images/:id', async (req, res) => {
	try {
		const { images } = getBuckets();
		if (!images) return res.status(503).send('Storage not ready');
		const id = new ObjectId(req.params.id);
		const files = await images.find({ _id: id }).toArray();
		if (!files || files.length === 0) return res.status(404).send('File not found');
		const file = files[0];
		res.set('Content-Type', file.contentType || 'application/octet-stream');
		res.set('Content-Length', String(file.length));
		res.set('Accept-Ranges', 'bytes');
		images.openDownloadStream(id).pipe(res);
	} catch (e) {
		return res.status(400).send('Invalid file id');
	}
});

router.get('/videos/:id', async (req, res) => {
	try {
		const { videos } = getBuckets();
		if (!videos) return res.status(503).end();
		const id = new ObjectId(req.params.id);
		const files = await videos.find({ _id: id }).toArray();
		if (!files || files.length === 0) return res.status(404).end();
		const file = files[0];
		const fileSize = file.length;
		const range = req.headers.range;
		if (!range) {
			res.set('Content-Type', file.contentType || 'video/mp4');
			res.set('Content-Length', String(fileSize));
			res.set('Accept-Ranges', 'bytes');
			return videos.openDownloadStream(id).pipe(res);
		}
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
		if (isNaN(start) || isNaN(end) || start > end || end >= fileSize) {
			return res.status(416).set('Content-Range', `bytes */${fileSize}`).end();
		}
		const chunkSize = end - start + 1;
		res.status(206);
		res.set({
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': String(chunkSize),
			'Content-Type': file.contentType || 'video/mp4'
		});
		videos.openDownloadStream(id, { start, end: end + 1 }).pipe(res);
	} catch (e) {
		return res.status(400).end();
	}
});

module.exports = router;


