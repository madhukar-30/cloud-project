// index.js
import express from 'express';
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Set up file size limits
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Initialize Azure Blob client
const blobServiceClient = new BlobServiceClient(process.env.SAS_URL);
const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);

// MongoDB Schema
const FileSchema = new mongoose.Schema({
  name: String,
  url: String,
  email: String,
  uploadedAt: { type: Date, default: Date.now },
  fileSize: Number,
  contentType: String
});

// Initialize model outside of route handlers
let File;
try {
  File = mongoose.model('File');
} catch {
  File = mongoose.model('File', FileSchema);
}

// Cached database connection
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Helper function to prefix routes for Vercel
const routePrefix = process.env.VERCEL ? '/api' : '';

// Health check endpoint
app.get(`${routePrefix}/health`, (req, res) => {
  res.status(200).send('OK');
});

// Health check endpoint that also verifies DB connection
app.get(`${routePrefix}/mongo-health`, async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ status: 'Error', database: 'Disconnected', error: error.message });
  }
});

app.post(`${routePrefix}/upload`, upload.single('cloud'), async (req, res) => {
  try {
    await connectDB();
    const file = req.file;
    const email = req.body.email;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (!email) {
      return res.status(400).json({ error: 'No email provided.' });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
    }

    const contentTypes = {
      'application/pdf': 'application/pdf',
      'image/png': 'image/png',
      'image/jpeg': 'image/jpeg',
      'image/jpg': 'image/jpg'
    };
    const contentType = contentTypes[file.mimetype] || 'application/octet-stream';

    const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: contentType },
      tier: 'Hot',
      metadata: { email },
      conditions: { ifNoneMatch: '*' }
    });

    const fileUrl = blockBlobClient.url;
    const parsedUrl = new URL(fileUrl);
    const shortUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;

    const fileDoc = new File({
      name: file.originalname,
      url: shortUrl,
      email,
      fileSize: file.size,
      contentType
    });
    await fileDoc.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      url: shortUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Error uploading file.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get(`${routePrefix}/file`, async (req, res) => {
  try {
    await connectDB();
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: 'No email provided.' });
    }

    const files = await File.find({ email }).select('-__v').lean();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'No files found for this email.' });
    }

    res.status(200).json({ 
      email,
      fileCount: files.length,
      files 
    });
  } catch (error) {
    console.error('Retrieval error:', error);
    res.status(500).json({ error: 'Error retrieving files.' });
  }
});

// Start server if running locally
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5555;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database connected successfully`);
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
}

export default app;