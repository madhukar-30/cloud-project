// import http from 'http';
// import express from 'express';
// import multer from 'multer';
// import { BlobServiceClient } from '@azure/storage-blob';
// import { MongoClient } from 'mongodb';
// import cors from 'cors';
// import 'dotenv/config';

// // Load in environment variables
// const mongodbUri = process.env.MONGODB_URI;
// const sasUrl = process.env.SAS_URL;
// const containerName = process.env.CONTAINER_NAME;

// // Create a new BlobServiceClient
// const blobServiceClient = new BlobServiceClient(sasUrl);

// // Get a container client from the BlobServiceClient
// const containerClient = blobServiceClient.getContainerClient(containerName);

// // Connect to MongoDB
// const client = new MongoClient(mongodbUri);
// await client.connect();
// const db = client.db('cloud');
// const collection = db.collection('cloud');

// const app = express();
// const upload = multer();

// app.use(cors());
// app.use(express.json());

// app.post('/upload', upload.single('cloud'), async (req, res) => {
//     try {
//         const file = req.file;
//         const email = req.body.email;

//         if (!file) {
//             return res.status(400).send('No file uploaded.');
//         }

//         if (!email) {
//             return res.status(400).send('No email provided.');
//         }

//         // Check if email already exists in the collection
//         const emailExists = await collection.findOne({ email });
//         if (emailExists) {
//             return res.status(400).send('Email already exists.');
//         }

//         // Determine the content type
//         let contentType;
//         switch (file.mimetype) {
//             case 'application/pdf':
//                 contentType = 'application/pdf';
//                 break;
//             case 'image/png':
//                 contentType = 'image/png';
//                 break;
//             case 'image/jpeg':
//                 contentType = 'image/jpeg';
//                 break;
//             case 'image/jpg':
//                 contentType = 'image/jpg';
//                 break;
//             default:
//                 contentType = 'application/octet-stream';
//         }

//         const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
//         await blockBlobClient.uploadData(file.buffer, {
//             blobHTTPHeaders: { blobContentType: contentType }
//         });

//         const fileUrl = blockBlobClient.url;
//         const parsedUrl = new URL(fileUrl);
//         const shortUrl = `${parsedUrl.origin}${parsedUrl.pathname}`; // Remove query parameters

//         await collection.insertOne({ name: file.originalname, url: shortUrl, email });

//         res.status(200).send({ message: 'File uploaded successfully', url: shortUrl });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error uploading file.');
//     }
// });

// // New route to get the PDF link by email
// app.get('/file', async (req, res) => {
//     try {
//         const email = req.query.email;

//         if (!email) {
//             return res.status(400).send('No email provided.');
//         }

//         // Find the document with the specified email
//         const document = await collection.findOne({ email });

//         if (!document) {
//             return res.status(404).send('File not found.');
//         }

//         res.status(200).send({ url: document.url });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error retrieving file.');
//     }
// });

// const server = http.createServer(app);
// const port = 5555;
// server.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });

import http from 'http';
import express from 'express';
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

const mongodbUri = process.env.MONGODB_URI;
const sasUrl = process.env.SAS_URL;
const containerName = process.env.CONTAINER_NAME;

// Set up file size limits
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Initialize Azure Blob client
const blobServiceClient = new BlobServiceClient(sasUrl);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Initialize MongoDB with connection pooling
// const client = new MongoClient(mongodbUri, {
//   maxPoolSize: 10,
//   minPoolSize: 5,
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// });

// let db;
// let collection;

// const connectDB = async () => {
//   if (!db) {
//     await client.connect();
//     db = client.db('cloud');
//     collection = db.collection('cloud');
//   }
//   return { db, collection };
// };

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Health check endpoint that also verifies DB connection
app.get('/mongo-health', async (req, res) => {
    try {
      const { db } = await connectDB();
      await db.command({ ping: 1 });
      res.status(200).json({ status: 'OK', database: 'Connected' });
    } catch (error) {
      res.status(500).json({ status: 'Error', database: 'Disconnected', error: error.message });
    }
});

app.post('/upload', upload.single('cloud'), async (req, res) => {
    try {
        const { db, collection } = await connectDB();
        const file = req.file;
        const email = req.body.email;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        if (!email) {
            return res.status(400).json({ error: 'No email provided.' });
        }

        // Check file size
        if (file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
        }

        // Map content types
        const contentTypes = {
            'application/pdf': 'application/pdf',
            'image/png': 'image/png',
            'image/jpeg': 'image/jpeg',
            'image/jpg': 'image/jpg'
        };
        const contentType = contentTypes[file.mimetype] || 'application/octet-stream';

        // Upload to Azure with optimized settings
        const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: contentType },
            tier: 'Hot',
            metadata: { email },
            conditions: { ifNoneMatch: '*' } // Prevent duplicate uploads
        });

        const fileUrl = blockBlobClient.url;
        const parsedUrl = new URL(fileUrl);
        const shortUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;

        // Store in MongoDB
        await collection.insertOne({
            name: file.originalname,
            url: shortUrl,
            email,
            uploadedAt: new Date(),
            fileSize: file.size
        });

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

app.get('/file', async (req, res) => {
    try {
        const { db, collection } = await connectDB();
        const email = req.query.email;

        if (!email) {
            return res.status(400).json({ error: 'No email provided.' });
        }

        // Find all documents with the specified email
        const documents = await collection.find({ email }).toArray();
        
        if (!documents || documents.length === 0) {
            return res.status(404).json({ error: 'No files found for this email.' });
        }

        // Return all files with their details
        const files = documents.map(doc => ({
            name: doc.name,
            url: doc.url,
            uploadedAt: doc.uploadedAt,
            fileSize: doc.fileSize,
            contentType: doc.contentType
        }));

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

// const port = process.env.PORT || 5555;
// const server = http.createServer(app);

// server.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });

// Handle graceful shutdown
// process.on('SIGTERM', async () => {
//     console.log('SIGTERM received. Closing HTTP server and DB connection...');
//     await client.close();
//     server.close(() => {
//         console.log('Server and DB connection closed.');
//         process.exit(0);
//     });
// });

mongoose
    .connect(process.env.MONGODB_URI || mongodbUri)
    .then(() => {
        console.log('App connected to database.');
        app.listen(process.env.PORT || 5555, () => {
            console.log(`App is listening to Port: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });