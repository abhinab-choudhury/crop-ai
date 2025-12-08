import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

const RecordingIndicator = ({ isRecording }: { isRecording: boolean }) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 0.2, duration: 700, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      opacityAnim.stopAnimation();
      opacityAnim.setValue(1);
    }
  }, [isRecording]);

  if (!isRecording) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15, marginBottom: 5 }}>
      <Animated.View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: 'red',
          opacity: opacityAnim,
        }}
      />
      <Text style={{ marginLeft: 8, color: '#e53e3e' }}>Recording...</Text>
    </View>
  );
};

export default RecordingIndicator;
