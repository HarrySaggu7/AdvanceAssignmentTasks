import axios from 'axios';
import { NEWS_API_KEY, NEWS_API_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../types/news';

export const fetchNews = async (
  page: number = 1,
  country: string = 'us'
): Promise<Article[]> => {
  const cacheKey = `news-page-${page}`;
  const cachedData = await AsyncStorage.getItem(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData) as Article[];
  }

  const response = await axios.get<{ articles: Article[] }>(NEWS_API_URL, {
    params: {
      country,
      page,
      apiKey: NEWS_API_KEY,
      pageSize: 10,
    },
  });

  await AsyncStorage.setItem(cacheKey, JSON.stringify(response.data.articles));
  return response.data.articles;
};