import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { uploadToIPFS, getFromIPFS } from './services/ipfsService.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Upload to IPFS
app.post('/api/meals/ipfs', async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'No data provided for upload' 
            });
        }
        
        const hash = await uploadToIPFS(data);
        res.json({ status: 'success', hash });
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message || 'Failed to upload to IPFS'
        });
    }
});

// Get from IPFS
app.get('/api/meals/ipfs/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        
        if (!hash || hash.length !== 46) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Invalid IPFS hash format' 
            });
        }

        console.log('Attempting to fetch from IPFS with hash:', hash);
        const data = await getFromIPFS(hash);
        
        if (!data) {
            return res.status(404).json({
                status: 'error',
                message: 'No data found for the given hash'
            });
        }
        
        res.json({ status: 'success', data });
    } catch (error) {
        console.error('Error retrieving from IPFS:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message || 'Failed to retrieve from IPFS'
        });
    }
});

const PORT = process.env.IPFS_SERVER_PORT || 3002;
app.listen(PORT, () => {
    console.log(`IPFS server running on port ${PORT}`);
});
