import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const WeatherSkeleton: React.FC = () => {
  const shimmerValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const Shimmer = ({ style }: { style: any }) => (
    <View style={[styles.skeleton, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Shimmer style={styles.titleSkeleton} />
        <Shimmer style={styles.tempSkeleton} />
        <Shimmer style={styles.descSkeleton} />
      </View>

      <View style={styles.details}>
        <View style={styles.detailCard}>
          <Shimmer style={styles.cardSkeleton} />
        </View>
        <View style={styles.detailCard}>
          <Shimmer style={styles.cardSkeleton} />
        </View>
        <View style={styles.detailCard}>
          <Shimmer style={styles.cardSkeleton} />
        </View>
        <View style={styles.detailCard}>
          <Shimmer style={styles.cardSkeleton} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  skeleton: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ skewX: '-20deg' }],
  },
  titleSkeleton: {
    width: 200,
    height: 30,
    marginBottom: 10,
  },
  tempSkeleton: {
    width: 100,
    height: 50,
    marginBottom: 10,
    borderRadius: 25,
  },
  descSkeleton: {
    width: 150,
    height: 20,
    marginBottom: 10,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCard: {
    width: '48%',
    marginBottom: 15,
  },
  cardSkeleton: {
    height: 80,
    borderRadius: 15,
  },
});

export default WeatherSkeleton;
