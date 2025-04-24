

import axios from 'axios';

export const createPayrexxPayment = async (amount: number, currency: string) => {
  const baseURL = 'https://explorevacationsag.payrexx.com';
  const endpoint = '/api/v1.0/Payment';

  const url = `${baseURL}${endpoint}`; // ✅ Correct way to form URL

  const payload = {
    amount,
    currency,
    purpose: 'Car Booking',
    successRedirectUrl: 'https://explorevacationsag.com/payment-success',
    failedRedirectUrl: 'https://explorevacationsag.com/payment-failure',
  };

  const headers = {
    Authorization: 'vqdTdCezHYCNEzgFcRsPz4PwvYvZPV', // Replace with your actual API key
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Payrexx error:', error);
    throw error;
  }
};
