import {
  PushDownAlertPortal,
  showNotification,
} from 'react-native-pushdown-alert';
import { View, StyleSheet, Button } from 'react-native';

export default function App() {
  return (
    <PushDownAlertPortal>
      <View style={styles.container}>
        <Button
          title="Show Notification Sucess"
          onPress={() =>
            showNotification({
              type: 'success',
              message: 'Hi a message body',
              title: 'Hello World',
            })
          }
        />
        <Button
          title="Show Notification Error"
          onPress={() =>
            showNotification({
              type: 'error',
              message: 'Hi a message body',
              title: 'Hello World',
            })
          }
        />
        <Button
          title="Show Notification Warning"
          onPress={() =>
            showNotification({
              type: 'warning',
              message: 'Hi a message body',
              title: 'Hello World',
            })
          }
        />
      </View>
    </PushDownAlertPortal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
