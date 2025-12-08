import { useRef } from 'react';
import { Animated } from 'react-native';

export function useMicAnimation() {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.4, duration: 200, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  return { scale, animate };
}
