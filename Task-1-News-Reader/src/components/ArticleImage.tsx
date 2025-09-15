import React from 'react';
import FastImage from 'react-native-fast-image';
import { View, StyleSheet } from 'react-native';
import { Article } from '../types/news';

interface ArticleImageProps {
  article: Article;
}

const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200?text=No+Image';

const ArticleImage = ({ article }: ArticleImageProps) => {
  return (
    <View style={styles.container}>
      <FastImage
        style={styles.image}
        source={{
          uri: article.urlToImage || DEFAULT_IMAGE,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
        fallback={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 10,
  },
  image: {
    flex: 1,
    borderRadius: 8,
  },
});

export default ArticleImage;
