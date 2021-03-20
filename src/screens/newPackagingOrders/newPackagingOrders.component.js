import {useIsFocused} from '@react-navigation/native';
import {Divider, Text, TopNavigation} from '@ui-kitten/components';
import MenuButton from 'components/menuButton/menuButton.component';
import Scanner from 'components/scanner/scanner.component';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import {ApiClient} from 'config/Api';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import NewPackagingOrdersScreenStyles from './newPackagingOrders.styles';

const NewPackagingOrdersScreen = ({navigation}) => {
  const postQueueData = async (qrCode) => {
    const response = await ApiClient.post('sorter/scan-queue-code', {
      qrCode,
    });
    return response;
  };

  const onScan = async (qrData) => {
    const response = await postQueueData(qrData);
    const {status, message, data} = response.data;

    if (status) {
      navigation.navigate('NewPackagingOrdersCreate', {...data});
    }

    showMessage({
      message,
      type: status ? 'success' : 'danger',
    });
  };

  const renderTopContent = (
    <Text
      style={NewPackagingOrdersScreenStyles.scannerTopContent}
      category="h5">
      Paketlənəcək növbənin QR kodunu oxudun
    </Text>
  );

  const isFocused = useIsFocused();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopNavigation
        title="Bağlamaları paketlə"
        alignment="center"
        accessoryLeft={MenuButton}
        accessoryRight={SignOutButton}
      />
      <Divider />
      {isFocused && <Scanner onScan={onScan} topContent={renderTopContent} />}
    </SafeAreaView>
  );
};

export default NewPackagingOrdersScreen;
