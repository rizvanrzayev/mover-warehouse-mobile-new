import {StackActions} from '@react-navigation/native';
import {Divider, Text, TopNavigation} from '@ui-kitten/components';
import BackButton from 'components/backButton/backButton.component';
import Scanner from 'components/scanner/scanner.component';
import {ApiClient} from 'config/Api';
import React from 'react';
import {SafeAreaView} from 'react-native';
import OpenWarehouseSackScreenStyles from './openWarehouseSack.styles';

const OpenWarehouseSackScreen = ({route, navigation}) => {
  const sendingId = route?.params?.id;

  const TopContent = () => (
    <Text status="info" category="h6">
      Çuvalın `QR`-nı oxudun
    </Text>
  );

  const openSackOrJoin = async (qrData) => {
    const requestData = {
      qr_data: qrData,
    };
    try {
      const response = await ApiClient.post(
        `sorting/warehouse/sack/join/${sendingId}`,
        requestData,
      );
      const {success, data} = response.data;
      if (success) {
        navigation.dispatch(
          StackActions.replace('WarehouseSendingsDetails', {
            sendingId,
            sack: data,
          }),
        );
      } else {
      }
    } catch (e) {
      // alert(JSON.stringify(e));
    }
  };

  const onScan = (data) => {
    openSackOrJoin(data);
  };

  return (
    <SafeAreaView style={OpenWarehouseSackScreenStyles.container}>
      <TopNavigation title="" alignment="center" accessoryLeft={BackButton} />
      <Divider />
      <Scanner topContent={<TopContent />} onScan={onScan} />
    </SafeAreaView>
  );
};

export default OpenWarehouseSackScreen;
