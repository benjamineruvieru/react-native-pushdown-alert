import {  Animated, SafeAreaProvider } from 'react-native'
import React, {useRef} from 'react'
import PushDownAlert from './PushDownAlert'

const PushDownAlertPortal = ({children}) => {

  const transY = useRef(new Animated.Value(0)).current;

  const goDown = ({num = 128}) => {
    Animated.timing(transY, {
      useNativeDriver: true,
      toValue: num,
    }).start();
  };

  const goUp = () => {
    Animated.timing(transY, {
      useNativeDriver: true,
      toValue: 0,
    }).start();
  };
  
  return (
    <SafeAreaProvider>
          <PushDownAlert {...{goDown, goUp}} />
          <Animated.View
            style={{
              flex: 1,
              transform: [{translateY: transY}],
            }}>
              {children}
               </Animated.View>
               </SafeAreaProvider>
  )
}

export default PushDownAlertPortal

