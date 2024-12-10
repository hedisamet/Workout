import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

class IPFSService {
    constructor() {
        const apiKey = process.env.PINATA_API_KEY?.replace(/['"]+/g, '');
        const apiSecret = process.env.PINATA_API_SECRET?.replace(/['"]+/g, '');
        
        if (!apiKey || !apiSecret) {
            throw new Error('Pinata credentials not found in environment variables');
        }

        this.pinata = new pinataSDK(apiKey, apiSecret);
        this.validateCredentials();
    }

    async validateCredentials() {
        try {
            await this.pinata.testAuthentication();
            console.log('Successfully connected to Pinata');
        } catch (error) {
            console.error('Failed to authenticate with Pinata:', error);
            throw new Error('Pinata authentication failed');
        }
    }

    async uploadToIPFS(data) {
        try {
            console.log('Attempting to upload data to IPFS...');
            const jsonString = JSON.stringify(data);
            const options = {
                pinataMetadata: {
                    name: `FitFlow-Meal-Plan-${Date.now()}`
                }
            };
            
            const result = await this.pinata.pinJSONToIPFS(data, options);
            console.log('Successfully uploaded to IPFS with hash:', result.IpfsHash);
            return result.IpfsHash;
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw new Error(`Failed to upload to IPFS: ${error.message}`);
        }
    }

    async getFromIPFS(hash) {
        console.log('Attempting to retrieve from IPFS with hash:', hash);
        try {
            // First try to get from Pinata API
            try {
                const pinList = await this.pinata.pinList({
                    hashContains: hash
                });
                
                if (pinList.count === 0) {
                    console.warn('Hash not found in Pinata pins');
                }
            } catch (error) {
                console.warn('Could not verify hash in Pinata:', error.message);
            }

            // Then try to get the actual content
            const gatewayURLs = [
                `https://gateway.pinata.cloud/ipfs/${hash}`,
                `https://ipfs.io/ipfs/${hash}`,
                `https://cloudflare-ipfs.com/ipfs/${hash}`
            ];

            let lastError = null;
            for (const gatewayURL of gatewayURLs) {
                try {
                    console.log('Attempting to fetch from gateway:', gatewayURL);
                    const response = await fetch(gatewayURL);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Successfully retrieved data from IPFS');
                    return data;
                } catch (error) {
                    lastError = error;
                    console.warn(`Failed to fetch from ${gatewayURL}:`, error.message);
                    continue;
                }
            }
            
            throw new Error(`Failed to retrieve from all IPFS gateways: ${lastError?.message}`);
        } catch (error) {
            console.error('Error retrieving from IPFS:', error);
            throw error;
        }
    }
}

const ipfsService = new IPFSService();
export const uploadToIPFS = ipfsService.uploadToIPFS.bind(ipfsService);
export const getFromIPFS = ipfsService.getFromIPFS.bind(ipfsService);
