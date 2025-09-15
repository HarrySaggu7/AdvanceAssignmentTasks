import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../types';
import { getCategories } from '../utils/api';

// category object interface
export interface Category {
  slug: string;
  name: string;
  url?: string;
}

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export const useCategories = (): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      
      // "all" option at the beginning
      const allCategory: Category = { slug: 'all', name: 'All Categories' };

      const formattedCategories = data.map((item: any) => {
        if (typeof item === 'string') {
          return { slug: item, name: item };
        }
        return item;
      });
      
      setCategories([allCategory, ...formattedCategories]);
      setError(null);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to fetch categories',
        code: err.response?.status,
      });
      setCategories([{ slug: 'all', name: 'All Categories' }]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch,
  };
};