import axios from 'axios';
import { ProductsResponse } from '../types';

const API_BASE_URL = 'https://dummyjson.com/products';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getProducts = async (
  skip: number = 0,
  limit: number = 10,
  category?: string,
  searchQuery?: string
): Promise<ProductsResponse> => {
  let url = `?limit=${limit}&skip=${skip}`;
  
  if (category && category !== 'all') {
    url = `/category/${category}?limit=${limit}&skip=${skip}`;
  } else if (searchQuery) {
    url = `/search?q=${encodeURIComponent(searchQuery)}&limit=${limit}&skip=${skip}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

export const getCategories = async (): Promise<any[]> => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};