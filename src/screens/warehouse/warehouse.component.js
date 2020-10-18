import React from 'react';
import Sound from 'react-native-sound';
import WarehouseScreenStyles from './warehouse.styles';
import {Divider, Spinner, Text, TopNavigation} from '@ui-kitten/components';
import {SafeAreaView, View} from 'react-native';
import {ApiClient} from 'config/Api';
import {showMessage} from 'react-native-flash-message';
import MenuButton from 'components/menuButton/menuButton.component';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import Scanner from 'components/scanner/scanner.component';

const errorSound = new Sound('unknown.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const WarehouseScreen = ({onSuccessTaked}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(null);

  const postSectionData = async (sectionName) => {
    const response = await ApiClient.post('select-shelf', {
      shelfBarcode: sectionName,
    });
    return response;
  };

  const postBundleData = async (orderId) => {
    const response = await ApiClient.post('add-to-shelf', {
      packageBarcode: orderId,
      sectionId: String(currentSection.section_id),
    });
    return response;
  };

  const isSection = (data) => {
    const length = data.length;
    const firstChar = data.charAt(0);
    if (
      (length === 4 || length === 5 || length === 6) &&
      (firstChar === 'A' || firstChar === 'F' || firstChar === 'E')
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onSelectSection = (sectionData) => {
    showMessage({
      message: currentSection === null ? 'Rəf seçildi' : 'Rəf dəyişdirildi',
      type: 'info',
    });
    setCurrentSection(sectionData);
  };

  const onSuccess = async (data) => {
    // successSound.play();
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
        const orderId = `${data.split('-')[0]}-346`;
        response = await postBundleData(orderId);
        if (response?.data?.status === false) {
          showMessage({
            message: response?.data?.message,
            type: 'danger',
          });
          errorSound.play();
        } else {
          if (!response?.data?.user || !response?.data?.order) {
            showMessage({
              titleStyle: {fontSize: 18},
              message: 'Uğurla əlavə olundu',
              type: 'success',
              duration: 3000,
              textStyle: {fontSize: 18},
            });
            return;
          }
          const {name, surname} = response?.data?.user;
          const {weight, shop, width, height, length} = response?.data?.order;
          showMessage({
            titleStyle: {fontSize: 18},
            message: `Uğurla əlavə olundu\n\n${name} ${surname}\n\nMağaza: ${shop}\n\nÇəki: ${weight} kq\n\nÖlçü: ${width}x${height}x${length} sm`,
            type: 'success',
            duration: 3000,
            textStyle: {fontSize: 18},
          });
        }
      }
    } catch (e) {
      // console.log(e.response.data);
      alert(JSON.stringify(e));
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

  const onScan = (data) => {
    onSuccess(data);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopNavigation
        title="Bağlamaları rəflə"
        alignment="center"
        accessoryLeft={MenuButton}
        accessoryRight={SignOutButton}
      />
      <Divider />
      <Scanner onScan={onScan} topContent={TopContent} />
    </SafeAreaView>
  );
};

export default WarehouseScreen;
