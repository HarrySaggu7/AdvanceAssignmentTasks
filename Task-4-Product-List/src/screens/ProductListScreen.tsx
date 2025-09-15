import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { useCategories, Category } from '../hooks/useCategories';
import { ProductCard, SearchHeader, CategoryFilter } from '../components';

const ProductListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const { products, loading, error, hasMore, refresh, loadMore } = useProducts(
    selectedCategory,
    searchQuery,
  );

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleCategorySelect = useCallback((categorySlug: string) => {
    setSelectedCategory(categorySlug);
    // Scroll to top when category changes
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, []);

  const handleEndReached = useCallback(() => {
    if (!loading && hasMore && !isRefreshing) {
      loadMore();
    }
  }, [loading, hasMore, loadMore, isRefreshing]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refresh();
    // Reset refreshing state after a short delay
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [refresh]);

  // Helper function to get current category name for display
  const getCurrentCategoryName = useCallback(() => {
    if (selectedCategory === 'all') return 'All Categories';

    // Find the category object that matches the selected slug
    const categoryObj = categories.find(cat =>
      typeof cat === 'object'
        ? cat.slug === selectedCategory
        : cat === selectedCategory,
    );

    if (typeof categoryObj === 'object') {
      return categoryObj.name || categoryObj.slug || 'Unknown';
    }

    return selectedCategory;
  }, [selectedCategory, categories]);

  const renderFooter = useCallback(() => {
    // hiding footer loader during initial load or refresh
    if (loading && !isRefreshing && products.length > 0) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#007bff" />
          <Text style={styles.footerText}>Loading more products...</Text>
        </View>
      );
    }
    return null;
  }, [loading, isRefreshing, products.length]);

  const renderEmpty = useCallback(() => {
    if (loading && products.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Error: {error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products found</Text>
        <Text style={styles.emptySubText}>
          Try changing your search or filter criteria
        </Text>
      </View>
    );
  }, [loading, error, products.length, refresh]);

  return (
    <View style={styles.container}>
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFilterPress={() => setShowFilterModal(true)}
      />

      <View style={styles.currentFilter}>
        <Text style={styles.currentFilterText}>
          Category: {getCurrentCategoryName()}
        </Text>
        {searchQuery && (
          <Text style={styles.currentFilterText}>Search: "{searchQuery}"</Text>
        )}
      </View>

      <CategoryFilter
        visible={showFilterModal}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        onClose={() => setShowFilterModal(false)}
      />

      {categoriesError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error loading categories: {categoriesError.message}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refetchCategories}
          >
            <Text style={styles.retryButtonText}>Retry Categories</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={products}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={
            products.length === 0 ? styles.emptyListContent : styles.listContent
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#007bff']}
              tintColor={'#007bff'}
            />
          }
          // Performance optimizations
          initialNumToRender={10}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          getItemLayout={(data, index) => ({
            length: 120,
            offset: 120 * index,
            index,
          })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  currentFilter: {
    padding: 10,
    backgroundColor: '#e6f2ff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  currentFilterText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: 10,
    color: '#666',
  },
});

export default ProductListScreen;
