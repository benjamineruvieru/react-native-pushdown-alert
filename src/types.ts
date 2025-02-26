import type { TextStyle } from 'react-native';

export type AlertTypes = 'success' | 'error' | 'warning';

export type AlertData = {
  type?: AlertTypes;
  title?: string;
  message?: string;
  backgroundColor: string;
};

export type OpenAlertData = {
  title?: string;
  message?: string;
  type?: AlertTypes;
};

export type AlertQueueBehaviour = 'cancelCurrent' | 'queue';

type AlertConfig = {
  alertDisplayDuration?: number;
  openAnimationDuration?: number;
  closeAnimationDuration?: number;
  alertQueueBehaviour?: AlertQueueBehaviour;
  titleTextStyle?: TextStyle;
  messageTextStyle?: TextStyle;

  successConfig?: {
    icon?: React.ReactNode;
    backgroundColor?: string;
  };
  errorConfig?: {
    icon?: React.ReactNode;
    backgroundColor?: string;
  };
  warningConfig?: {
    icon?: React.ReactNode;
    backgroundColor?: string;
  };
};

export interface PushDownAlertProps {
  config?: AlertConfig;
  goDown: (num: number) => void;
  goUp: () => void;
}

export interface PushDownAlertPortalProps {
  config?: AlertConfig;
  children: React.ReactNode;
}
