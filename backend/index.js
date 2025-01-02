import http from 'http';
import express from 'express';
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import 'dotenv/config';

// Load in environment variables
const mongodbUri = process.env.MONGODB_URI;
const sasUrl = process.env.SAS_URL;
const containerName = process.env.CONTAINER_NAME;

// Create a new BlobServiceClient
const blobServiceClient = new BlobServiceClient(sasUrl);
const containerClient = blobServiceClient.getContainerClient(containerName);

// Connect to MongoDB
const client = new MongoClient(mongodbUri);
await client.connect();
const db = client.db('cloud');
const collection = db.collection('cloud');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// Upload Route
app.post('/upload', upload.single('cloud'), async (req, res) => {
    try {
        const file = req.file;
        const email = req.body.email;

        if (!file) return res.status(400).send('No file uploaded.');
        if (!email) return res.status(400).send('No email provided.');

        const contentType = file.mimetype || 'application/octet-stream';
        const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);

        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: contentType },
        });

        const fileUrl = blockBlobClient.url;
        const shortUrl = `${new URL(fileUrl).origin}${new URL(fileUrl).pathname}`;

        await collection.insertOne({ name: file.originalname, url: shortUrl, email });
        res.status(200).send({ message: 'File uploaded successfully', url: shortUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file.');
    }
});

// Get File by Email
app.get('/file', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).send('No email provided.');

        const document = await collection.findOne({ email });
        if (!document) return res.status(404).send('File not found.');

        res.status(200).send({ url: document.url });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving file.');
    }
});

// Start the server
const port = process.env.PORT || 5555;
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
