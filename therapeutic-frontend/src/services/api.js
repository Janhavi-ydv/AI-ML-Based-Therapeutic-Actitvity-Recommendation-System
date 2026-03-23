import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Fetch activity recommendations based on patient health data.
 * @param {Object} patientData - The patient's health profile.
 * @returns {Promise<{recommendedExercise: string, recommendedMeditation: string}>}
 */
export const getRecommendation = async (patientData) => {
  const response = await apiClient.post('/api/recommendation', patientData);
  return response.data;
};

export default apiClient;
