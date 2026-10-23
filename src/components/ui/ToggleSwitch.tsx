import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';

export interface ToggleSwitchProps {
  value?: boolean;
  enabled?: boolean;
  checked?: boolean;
  onToggle?: () => void;
  onValueChange?: (val: boolean) => void;
  onChange?: (val: boolean) => void;
  disabled?: boolean;
}

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 26;
const THUMB_SIZE = 20;
const PADDING = 3;
const TRANSLATE_X_MAX = TRACK_WIDTH - THUMB_SIZE - PADDING * 2; // 22px

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  enabled,
  checked,
  onToggle,
  onValueChange,
  onChange,
  disabled = false,
}) => {
  const isChecked = Boolean(value ?? enabled ?? checked ?? false);
  const animValue = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isChecked ? 1 : 0,
      bounciness: 4,
      speed: 16,
      useNativeDriver: false,
    }).start();
  }, [isChecked]);

  const handlePress = () => {
    if (disabled) return;
    const nextVal = !isChecked;
    if (onToggle) onToggle();
    if (onValueChange) onValueChange(nextVal);
    if (onChange) onChange(nextVal);
  };

  const thumbTranslateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRANSLATE_X_MAX],
  });

  const trackBackgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.16)', '#818CF8'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.touchArea, disabled && styles.disabled]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: trackBackgroundColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: thumbTranslateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ToggleSwitch;

const styles = StyleSheet.create({
  touchArea: {
    paddingVertical: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: PADDING,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
      },
    }),
  },
});