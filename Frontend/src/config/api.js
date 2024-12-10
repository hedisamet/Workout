// API Base URLs
const FLASK_BASE_URL = 'http://localhost:5002';  // Updated to use port 5002
const NODE_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  MEAL: {
    GENERATE: `${FLASK_BASE_URL}/api/generate-meal`,
    ACCEPT: `${FLASK_BASE_URL}/api/meals/accept`,
    GET_IPFS: `${FLASK_BASE_URL}/api/meals/ipfs`
  },
  WORKOUT: {
    GENERATE: `${FLASK_BASE_URL}/api/generate-workout`,
    ACCEPT: `${FLASK_BASE_URL}/api/program/accept`,
    GET_IPFS: `${FLASK_BASE_URL}/api/program/ipfs`
  },
  ACCOUNT: {
    LOGIN: `${NODE_BASE_URL}/api/account/login`,
    REGISTER: `${NODE_BASE_URL}/api/account/register`,
    GET_USER: (userId) => `${NODE_BASE_URL}/api/account/${userId}`,
    UPDATE: (userId) => `${NODE_BASE_URL}/api/account/update/${userId}`
  }
};

// Axios default config
export const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default API_ENDPOINTS;
