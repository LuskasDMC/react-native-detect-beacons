import {PermissionsAndroid} from 'react-native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

export const requestBluetothPermission = async () => {
  const bluetoothIsEnabled = await BluetoothStateManager.getState();
  if (bluetoothIsEnabled === 'PoweredOff') {
    await BluetoothStateManager.requestToEnable();
  }

  try {
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Activeev needs to access your location.',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location Permitted');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
