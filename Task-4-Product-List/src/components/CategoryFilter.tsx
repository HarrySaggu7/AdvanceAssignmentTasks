import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

// Define the category object interface
interface Category {
  slug: string;
  name: string;
  url?: string;
}

interface CategoryFilterProps {
  visible: boolean;
  categories: Category[]; // Changed from string[] to Category[]
  selectedCategory: string;
  onSelectCategory: (category: string) => void; // Still pass slug string to parent
  onClose: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  visible,
  categories,
  selectedCategory,
  onSelectCategory,
  onClose,
}) => {
  // Get display name from category object
  const getDisplayName = (
    category: Category | string | undefined | null,
  ): string => {
    if (!category) return 'Unknown';

    if (typeof category === 'string') {
      return category === 'all' ? 'All Categories' : category;
    }

    // It's a category object
    return category.name || category.slug || 'Unknown';
  };

  // Get category slug for API calls
  const getCategorySlug = (
    category: Category | string | undefined | null,
  ): string => {
    if (!category) return 'all';

    if (typeof category === 'string') {
      return category;
    }

    // It's a category object
    return category.slug || 'all';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Category</Text>
          <FlatList
            data={categories}
            keyExtractor={item =>
              typeof item === 'string' ? item : item.slug || 'unknown'
            }
            renderItem={({ item }) => {
              const itemSlug = getCategorySlug(item);
              const isSelected = selectedCategory === itemSlug;

              return (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    isSelected && styles.selectedCategory,
                  ]}
                  onPress={() => {
                    onSelectCategory(itemSlug);
                    onClose();
                  }}
                >
                  <Text style={styles.categoryText}>
                    {getDisplayName(item)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCategory: {
    backgroundColor: '#e6f2ff',
  },
  categoryText: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CategoryFilter;
