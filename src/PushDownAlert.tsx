import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PushDownAlert = () => {

    const [msg, setMsg] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
  
    const insets = useSafeAreaInsets();
    let timer: NodeJS.Timeout;
  
    const transY = useRef(new Animated.Value(0)).current;
  
    const notheight = useRef<number>(0);
    const openNotification = ({
      msg,
      error = false,
    }: {
      msg: string;
      error?: boolean;
    }) => {
      Animated.timing(transY, {
        useNativeDriver: true,
        toValue: 0,
      }).start();
      setMsg(msg);
      setError(error);
    };
  
    const closeNotification = () => {
      clearTimeout(timer);
      Animated.timing(transY, {
        useNativeDriver: true,
        toValue: -notheight.current,
      }).start();
      goUp();
      setTimeout(() => {
        setMsg('');
        setError(false);
      }, 500);
    };
  
    useEffect(() => {
      const myEventListener = DeviceEventEmitter.addListener(
        'openNotification',
        event => {
          console.log(event);
          goDown({num: notheight.current - 3});
          openNotification(event);
          setTimeout(() => {
            closeNotification();
          }, 3500);
        },
      );
  
      return () => myEventListener.remove();
    }, []);
    
  return (
    <Animated.View
      style={{
        transform: [{translateY: transY}],
        position: 'absolute',
        zIndex: 10,
        width: SCREEN_WIDTH,
        opacity: msg === '' ? 0 : 1,
      }}
      onLayout={e => {
        if (notheight.current === 0) {
          Animated.timing(transY, {
            toValue: -e.nativeEvent.layout.height + 2,
            duration: 1,
            useNativeDriver: true,
          }).start();
        }
        notheight.current = e.nativeEvent.layout.height + 2;

        console.log(e.nativeEvent.layout.height);
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: error ? Colors.red : Colors.green,
          paddingTop:
            Platform.OS === 'ios'
              ? insets.top + 25
              : (StatusBar.currentHeight ?? 0) + 25,
          paddingHorizontal: 20,
          paddingBottom: 25,
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}
        onPress={closeNotification}>
        {error ? <Error /> : <Check />}
        <RegularText style={{color: 'white', marginLeft: 15, flex: 1}}>
          {msg ? msg : 'An unknown error occurred!'}
        </RegularText>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default PushDownAlert

const styles = StyleSheet.create({})