import { Animated } from 'react-native';
import React, { useRef } from 'react';
import PushDownAlert from './PushDownAlert';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { PushDownAlertPortalProps, AlertQueueBehaviour } from './types';

// Default configuration values
const defaultConfig = {
  openAnimationDuration: 300,
  closeAnimationDuration: 300,
  alertDisplayDuration: 3500,
  alertQueueBehaviour: 'queue' as AlertQueueBehaviour,
};

const PushDownAlertPortal: React.FC<PushDownAlertPortalProps> = ({
  config,
  children,
}) => {
  const mergedConfig = { ...defaultConfig, ...config };

  const transY = useRef(new Animated.Value(0)).current;

  const goDown = (num = 128) => {
    Animated.timing(transY, {
      useNativeDriver: true,
      toValue: num,
      duration: mergedConfig.openAnimationDuration,
    }).start();
  };

  const goUp = () => {
    Animated.timing(transY, {
      useNativeDriver: true,
      toValue: 0,
      duration: mergedConfig.closeAnimationDuration,
    }).start();
  };

  return (
    <SafeAreaProvider>
      <PushDownAlert {...{ goDown, goUp, config: mergedConfig }} />
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: transY }],
        }}
      >
        {children}
      </Animated.View>
    </SafeAreaProvider>
  );
};

export default PushDownAlertPortal;
