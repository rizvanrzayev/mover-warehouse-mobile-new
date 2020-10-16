import React from 'react';
import Sound from 'react-native-sound';
import WarehouseScreenStyles from './shelfOrders.styles';
import {Divider, Spinner, Text, TopNavigation} from '@ui-kitten/components';
import {SafeAreaView, View} from 'react-native';
import {ApiClient} from 'config/Api';
import {showMessage} from 'react-native-flash-message';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import Scanner from 'components/scanner/scanner.component';
import BackButton from 'components/backButton/backButton.component';

const errorSound = new Sound('unknown.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const ShelfOrders = ({route, navigation}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(null);

  const onSuccessShelf = route?.params?.onSuccessShelf;
  const item = route?.params?.item || {};

  const postSectionData = async (sectionName) => {
    const response = await ApiClient.post('select-shelf-total', {
      name: sectionName,
      office_id: '0',
    });
    return response;
  };

  const postBundleData = async (orderId) => {
    const response = await ApiClient.post('add-to-shelf-total', {
      unique_id: orderId,
      section_id: String(currentSection.section_id),
      queue_id: item.id,
    });
    return response;
  };

  const isSection = (data) => {
    if (data.includes('HZR')) {
      return true;
    } else {
      return false;
    }
  };

  const onSelectSection = (sectionData) => {
    setCurrentSection(sectionData);
    showMessage({
      message: currentSection === null ? 'Rəf seçildi' : 'Rəf dəyişdirildi',
      type: 'info',
    });
  };

  const onSuccess = async (data) => {
    setIsLoading(true);
    try {
      let response = null;
      if (currentSection === null || isSection(data)) {
        response = await postSectionData(data);
        const {status, data: sectionData} = response.data;
        if (status === true) {
          onSelectSection(sectionData);
        } else {
          errorSound.play();
          showMessage({
            message: 'Zəhmət olmasa düzgün rəf oxudun',
            type: 'warning',
          });
        }
      } else {
        const orderId = data.split('-')[0];
        response = await postBundleData(orderId);
        if (response?.data?.status === false) {
          errorSound.play();
          showMessage({
            message: response?.data?.message,
            type: 'danger',
          });
        } else {
          if (response?.data?.completed) {
            onSuccessShelf(currentSection);
            navigation.pop();
          }
          showMessage({
            duration: 3000,
            message: `Uğurla əlavə olundu\n${item.customer_name}`,
            type: 'success',
          });
        }
      }
    } catch (e) {
      // console.log(e.response.data);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        // qrRef.current.reactivate();
      }, 500);
    }
  };

  const hasCurrentSection = currentSection !== null;
  const topContentTitle = hasCurrentSection
    ? 'Oxuyucunu bağlamaya yaxınlaşdırın'
    : 'Oxuyucunu rəfə yaxınlaşdırın';

  const topContentLoadingText = !hasCurrentSection
    ? 'Rəf yoxlanılır...'
    : 'Bağlama rəfə əlavə olunur...';

  const TopContent = (
    <View style={WarehouseScreenStyles.topContentContent}>
      {hasCurrentSection && (
        <View style={WarehouseScreenStyles.topContentSectionContainer}>
          <Text category="h6">Seçilmiş rəf: {currentSection?.name}</Text>
          <Text category="p2">
            Əlavə olunacağ bağlamalar bu rəfə yerləşdiriləcək.
          </Text>
        </View>
      )}
      {isLoading ? (
        <View style={WarehouseScreenStyles.topContentContainer}>
          <Spinner animating />
          <Text style={{marginTop: 10}} category="s1">
            {topContentLoadingText}
          </Text>
        </View>
      ) : (
        <Text category="h6">{topContentTitle}</Text>
      )}
    </View>
  );

  const BottomContent = null;

  const onScan = (data) => {
    onSuccess(data);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopNavigation
        title="Bağlamaları rəflə"
        alignment="center"
        accessoryLeft={BackButton}
        // accessoryRight={SignOutButton}
      />
      <Divider />
      <Scanner onScan={onScan} topContent={TopContent} />
    </SafeAreaView>
  );
};

export default ShelfOrders;
