/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {FlatList} from 'react-native';
import {DeviceEventEmitter} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import styled from 'styled-components/native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

import {requestBluetothPermission} from './src/utils/permissions';

const BEACON_STATUS = {
  CONNECTED: 'CONECTADO',
  DISCONNECTED: 'DESCONECTADO',
};

const BLUETOOTH_STATUS = {
  ENABLED: 'HABILITADO',
  DISABLED: 'DESABILITADO',
};

const startBeaconsDetection = async () => {
  Beacons.detectIBeacons();

  try {
    await Beacons.startRangingBeaconsInRegion(
      'Nova Era - Supermercados',
      'c6beff2c-2f22-4c12-a605-3aecea8cc5d5',
    );

    Beacons.setForegroundScanPeriod(3000);
    console.log('Beacons ranging started succesfully!');
  } catch (err) {
    console.log(`Beacons ranging not started, error: ${err}`);
  }
};

const App = () => {
  const [bluetooth, setBluetooth] = useState(BLUETOOTH_STATUS.DISABLED);
  const [connected, setConnected] = useState(BEACON_STATUS.DISCONNECTED);
  const [beaconData, setBeaconData] = useState({});

  useEffect(() => {
    (() => {
      requestBluetothPermission();
      startBeaconsDetection();

      BluetoothStateManager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          setBluetooth(BLUETOOTH_STATUS.ENABLED);
        } else {
          setBluetooth(BLUETOOTH_STATUS.DISABLED);
        }
      }, true);

      DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
        if (data.beacons?.length) {
          setConnected(BEACON_STATUS.CONNECTED);
        } else {
          setConnected(BEACON_STATUS.DISCONNECTED);
        }

        setBeaconData(data);
      });
    })();
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <Container>
        <Title>POC - iBeacons</Title>
        <Content>
          <Text>
            Status:{'  '}
            <Text
              style={{
                color: connected === BEACON_STATUS.CONNECTED ? 'green' : 'red',
              }}>
              {connected}
            </Text>
          </Text>
          <Text>
            Bluetooth:{'  '}
            <Text
              style={{
                color: bluetooth === BLUETOOTH_STATUS.ENABLED ? 'green' : 'red',
              }}>
              {bluetooth}
            </Text>
          </Text>
          <Text>Região: {beaconData.identifier || 'Não encontrado'}</Text>
          <Text>UUID: {beaconData.uuid || 'Não encontrado'}</Text>

          <ContainerBeaconsDetecteds>
            <Title style={{fontSize: 17}}>Beacons detectados:</Title>
            <FlatList
              data={beaconData.beacons}
              renderItem={({item, index}) => (
                <Text>
                  N°: {index} | Minor: {item.major} | Minor: {item.minor}
                </Text>
              )}
              keyExtractor={(item, index) => index}
            />
          </ContainerBeaconsDetecteds>
        </Content>
      </Container>
    </>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #333;
  padding: 40px 20px;
`;

const Title = styled.Text`
  text-align: center;
  color: #ffff;
  font-size: 20px;
  font-weight: 600;
`;

const Text = styled.Text`
  color: #ffff;
`;

const Content = styled.View`
  padding-top: 20px;
  flex: 1;
`;

const ContainerBeaconsDetecteds = styled.View`
  margin-top: 20px;
  border-width: 1;
  border-color: #ffff;
  flex: 1;
`;

export default App;
