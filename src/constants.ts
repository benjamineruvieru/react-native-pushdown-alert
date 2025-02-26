import { Dimensions } from 'react-native';

const SCREEN_WIDTH: number = Dimensions.get('window').width;
const SCREEN_HEIGHT: number = Dimensions.get('window').height;

const Colors = {
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
};

export { SCREEN_HEIGHT, SCREEN_WIDTH, Colors };
