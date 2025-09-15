import { LoginCredentials, AuthResponse } from '../types/auth';

// free API key provided by reqres.in
const API_KEY = 'reqres-free-v1';

export const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Using reqres.in mock API
    const response = await fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // user is provided by reqres.in
    if (credentials.email === 'eve.holt@reqres.in') {
      const userResponse = await fetch('https://reqres.in/api/users/4');
      const userData = await userResponse.json();
      
      return {
        token: data.token,
        user: userData.data
      };
    }

    return {
      token: data.token,
    };
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};