const API_BASE_URL = 'http://localhost:5001';

export const API_ENDPOINTS = {
  MEAL: {
    GENERATE: `${API_BASE_URL}/api/generate-meal`,
    GET_PLAN: (userId) => `${API_BASE_URL}/api/meal-plans/${userId}`,
  },
  WORKOUT: {
    GENERATE: `${API_BASE_URL}/api/generate-workout`,
    GET_PLAN: (userId) => `${API_BASE_URL}/api/workout-plans/${userId}`,
  },
  ACCOUNT: {
    LOGIN: `${API_BASE_URL}/api/account/login`,
    REGISTER: `${API_BASE_URL}/api/account/register`,
    GET_USER: (userId) => `${API_BASE_URL}/api/account/${userId}`,
    UPDATE: (userId) => `${API_BASE_URL}/api/account/update/${userId}`,
  },
};

export default API_ENDPOINTS;
