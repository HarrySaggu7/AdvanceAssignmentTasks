import { useState, useEffect, useCallback } from 'react';
import { Product, ApiError } from '../types';
import { getProducts } from '../utils/api';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: ApiError | null;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
}

export const useProducts = (
  category: string = 'all',
  searchQuery: string = ''
): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchProducts = useCallback(async (isRefreshing: boolean = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      const currentSkip = isRefreshing ? 0 : skip;
      
      const response = await getProducts(currentSkip, 10, category, searchQuery);
      
      if (isRefreshing) {
        setProducts(response.products);
      } else {
        setProducts(prev => [...prev, ...response.products]);
      }
      
      setSkip(currentSkip + response.products.length);
      setHasMore(response.products.length === 10);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to fetch products',
        code: err.response?.status,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [skip, category, searchQuery]);

  // Reset products and fetch new ones when category or search query changes
  useEffect(() => {
    const fetchData = async () => {
      setProducts([]);
      setSkip(0);
      setHasMore(true);
      setLoading(true);
      await fetchProducts(true);
    };
    
    fetchData();
  }, [category, searchQuery]);

  const refresh = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !refreshing) {
      fetchProducts();
    }
  }, [loading, hasMore, refreshing, fetchProducts]);

  return {
    products,
    loading: loading || refreshing,
    error,
    hasMore,
    refresh,
    loadMore,
  };
};