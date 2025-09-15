import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { fetchNews } from '../services/newsService';
import { Article } from '../types/news';

const DEFAULT_IMAGE =
  'https://via.placeholder.com/300x200?text=No+Image+Available';

const NewsScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState(0);

  const loadNews = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);
      const newArticles = await fetchNews(currentPage);
      setArticles(prev =>
        currentPage === 1 ? newArticles : [...prev, ...newArticles],
      );
    } catch (err) {
      setError('Failed to load news. Please pull to refresh.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setCacheBuster(Date.now()); // This will force images to reload
    loadNews(1).finally(() => setRefreshing(false));
  };

  useEffect(() => {
    loadNews(page);
  }, [page]);

  const renderItem = ({ item }: { item: Article }) => {
    // Add cache buster to image URL to force refresh
    const imageUri = item.urlToImage
      ? `${item.urlToImage}${
          item.urlToImage.includes('?') ? '&' : '?'
        }cb=${cacheBuster}`
      : DEFAULT_IMAGE;

    return (
      <TouchableOpacity style={styles.article}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          defaultSource={{ uri: DEFAULT_IMAGE }}
          resizeMode="cover"
          onError={() => console.log('Image failed to load:', item.urlToImage)}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>
            {item.description || 'No description available'}
          </Text>
          <Text style={styles.metaText}>
            {item.source?.name || 'Unknown source'} •{' '}
            {new Date(item.publishedAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" style={styles.loader} />;
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error || 'No articles found. Pull to refresh.'}
      </Text>
      {error && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadNews(page)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0066cc']}
            tintColor="#0066cc"
            title="Refreshing..."
            titleColor="#0066cc"
          />
        }
        onEndReached={() =>
          !loading && !refreshing && setPage(prev => prev + 1)
        }
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  article: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 200,
    width: '100%',
    backgroundColor: '#eee',
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  loader: {
    marginVertical: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NewsScreen;
