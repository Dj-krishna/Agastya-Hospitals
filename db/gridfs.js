const { MongoClient, GridFSBucket } = require('mongodb');

let client;
let db;
let buckets = {};

async function connectGridFS(uri, dbName) {
	if (client && db && buckets.images && buckets.videos) return { db, buckets };
	client = new MongoClient(uri);
	await client.connect();
	db = client.db(dbName);
	buckets.images = new GridFSBucket(db, { bucketName: 'images', chunkSizeBytes: 1024 * 255 });
	buckets.videos = new GridFSBucket(db, { bucketName: 'videos', chunkSizeBytes: 1024 * 1024 });
	return { db, buckets };
}

function getBuckets() {
	return buckets;
}

module.exports = { connectGridFS, getBuckets };


