import {
  Animated,
  DeviceEventEmitter,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Colors, SCREEN_WIDTH } from './constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Queue from './Queue';
import type { OpenAlertData, AlertData, PushDownAlertProps } from './types';

const successIcon = require('./images/success.png');
const errorIcon = require('./images/error.png');
const warningIcon = require('./images/warning.png');

const PushDownAlert: React.FC<PushDownAlertProps> = ({
  goUp,
  goDown,
  config,
}) => {
  const transY = useRef(new Animated.Value(0)).current;
  const timer = useRef<NodeJS.Timeout>();
  const queue = useRef(new Queue()).current;
  const insets = useSafeAreaInsets();

  const {
    titleTextStyle,
    messageTextStyle,
    successConfig,
    errorConfig,
    warningConfig,
    alertQueueBehaviour,
    closeAnimationDuration,
    openAnimationDuration,
    alertDisplayDuration,
  } = config ?? {};

  const COLORS = {
    success: successConfig?.backgroundColor ?? Colors.success,
    error: errorConfig?.backgroundColor ?? Colors.error,
    warning: warningConfig?.backgroundColor ?? Colors.warning,
  };

  const _paddingTop =
    Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight ?? 0);

  const alertHeightRef = useRef<number>(0);

  const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);
  const [data, setData] = useState<AlertData>({
    message: '',
    title: '',
    backgroundColor: COLORS.success,
  });

  const processNotification = useCallback(
    (event: OpenAlertData) => {
      if (isAlertDisplayed) {
        if (alertQueueBehaviour === 'queue') {
          queue.enqueue(event);
        } else {
          queue.enqueue(event);
          closeNotification();
        }
      } else {
        setIsAlertDisplayed(true);
        openNotification(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAlertDisplayed, alertQueueBehaviour]
  );

  const openNotification = ({ type = 'success', ...rest }: OpenAlertData) => {
    switch (type) {
      case 'success':
        setData({ type, backgroundColor: COLORS.success, ...rest });
        break;
      case 'error':
        setData({ type, backgroundColor: COLORS.error, ...rest });
        break;
      case 'warning':
        setData({ type, backgroundColor: COLORS.warning, ...rest });
        break;
      default:
        setData({ type, backgroundColor: COLORS.success, ...rest });
        break;
    }

    setTimeout(() => {
      if (!config?.disablePushDown) {
        goDown(alertHeightRef.current);
      }

      timer.current = setTimeout(() => {
        closeNotification();
      }, alertDisplayDuration);
      Animated.timing(transY, {
        useNativeDriver: true,
        toValue: 0,
        duration: openAnimationDuration,
      }).start();
    });
  };

  const closeNotification = () => {
    clearTimeout(timer.current);
    Animated.timing(transY, {
      useNativeDriver: true,
      toValue: -alertHeightRef.current,
      duration: closeAnimationDuration,
    }).start(_onAlertClosed);
    if (!config?.disablePushDown) {
      goUp();
    }
  };

  useEffect(() => {
    const myEventListener = DeviceEventEmitter.addListener(
      'openNotification',
      (event: OpenAlertData) => {
        processNotification(event);
      }
    );

    return () => myEventListener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAlertDisplayed, alertQueueBehaviour, data]);

  // Events
  const _onAlertClosed = () => {
    if (queue.size > 0) {
      const nextAlert = queue.dequeue();
      if (nextAlert) {
        openNotification(nextAlert);
      }
    } else {
      setIsAlertDisplayed(false);
    }
  };

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (alertHeightRef.current === 0) {
        Animated.timing(transY, {
          toValue: -e.nativeEvent.layout.height,
          duration: 1,
          useNativeDriver: true,
        }).start();
      }
      alertHeightRef.current = e.nativeEvent.layout.height;
    },
    [transY]
  );

  const SuccessIcon = successConfig?.icon ?? (
    <Image resizeMode="contain" source={successIcon} style={styles.iconStyle} />
  );
  const ErrorIcon = errorConfig?.icon ?? (
    <Image resizeMode="contain" source={errorIcon} style={styles.iconStyle} />
  );
  const WarningIcon = warningConfig?.icon ?? (
    <Image resizeMode="contain" source={warningIcon} style={styles.iconStyle} />
  );

  const _renderIcon = () => {
    switch (data.type) {
      case 'success':
        return SuccessIcon;
      case 'error':
        return ErrorIcon;
      case 'warning':
        return WarningIcon;
      default:
        return SuccessIcon;
    }
  };

  return (
    <Animated.View
      style={[
        styles.animatedView,
        {
          transform: [{ translateY: transY }],
          opacity: isAlertDisplayed ? 1 : 0,
        },
      ]}
      onLayout={onLayout}
    >
      <Pressable
        style={[
          styles.alertContainer,
          {
            backgroundColor: data.backgroundColor,
            paddingTop: _paddingTop + 15,
          },
        ]}
        onPress={closeNotification}
      >
        {_renderIcon()}
        <View style={styles.msgContainer}>
          {data.title && (
            <Text style={[styles.titleTextStyle, titleTextStyle]}>
              {data.title}
            </Text>
          )}
          {data.message && (
            <Text style={[styles.messageTextStyle, messageTextStyle]}>
              {data.message}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default PushDownAlert;

const styles = StyleSheet.create({
  animatedView: { position: 'absolute', zIndex: 1, width: SCREEN_WIDTH },
  alertContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  msgContainer: {
    marginLeft: 15,
  },
  titleTextStyle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  messageTextStyle: { color: 'white', fontWeight: 'normal' },
  iconStyle: { width: 20, height: 20 },
});
