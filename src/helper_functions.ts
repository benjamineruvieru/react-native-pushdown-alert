import { DeviceEventEmitter } from 'react-native';
import type { OpenAlertData } from './types';

export const showNotification = (event: OpenAlertData) => {
  DeviceEventEmitter.emit('openNotification', event);
};
