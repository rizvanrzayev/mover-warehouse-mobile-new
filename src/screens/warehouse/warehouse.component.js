import React from 'react';
import WarehouseScreenStyles from './warehouse.styles';
import {Divider, TopNavigation} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native';
import {ApiClient} from 'config/Api';
import {showMessage} from 'react-native-flash-message';
import MenuButton from 'components/menuButton/menuButton.component';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import Scanner from 'components/scanner/scanner.component';
import ShelfTopContent from 'components/shelfTopContent/shelfTopContent.component';
import BackButton from 'components/backButton/backButton.component';
import {errorSound} from 'helpers/Sounds';

const WarehouseScreen = ({onSuccessTaked, route}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(null);

  const back = route?.params?.back;

  const postSectionData = async (sectionName) => {
    const response = await ApiClient.post('worker/select-shelf', {
      shelfBarcode: sectionName,
    });
    return response;
  };

  const postBundleData = async (orderId) => {
    const response = await ApiClient.post('worker/add-to-shelf', {
      packageBarcode: orderId,
      sectionId: String(currentSection.section_id),
    });
    return response;
  };

  const isSection = (data) => {
    const length = data.length;
    const firstChar = data.charAt(0);
    return (
      (length === 4 || length === 5 || length === 6) &&
      (firstChar === 'A' ||
        firstChar === 'F' ||
        firstChar === 'E' ||
        firstChar === 'G' ||
        firstChar === 'S')
    );
  };

  const onSelectSection = (sectionData) => {
    showMessage({
      message: currentSection === null ? 'Rəf seçildi' : 'Rəf dəyişdirildi',
      type: 'info',
    });
    setCurrentSection(sectionData);
  };

  const onSuccess = async (data) => {
    setIsLoading(true);
    try {
      let response = null;
      if (currentSection === null || isSection(data)) {
        response = await postSectionData(data);
        const {status, data: sectionData, message} = response.data;
        if (status === true) {
          onSelectSection(sectionData);
        } else {
          errorSound.play();
          showMessage({
            message: message,
            type: 'warning',
          });
        }
      } else {
        const orderId = `${data.split('-')[0]}-346`;
        response = await postBundleData(orderId);
        if (response?.data?.status === false) {
          errorSound.play();
          showMessage({
            message: response?.data?.message,
            type: 'danger',
          });
        } else {
          if (!response?.data?.user || !response?.data?.order) {
            showMessage({
              titleStyle: {fontSize: 18, fontWeight: 'bold'},
              message: 'Uğurla əlavə olundu',
              type: 'success',
              duration: 3000,
            });
            return;
          }
          const {name, surname} = response?.data?.user;
          const {weight, shop, width, height, length} = response?.data?.order;
          showMessage({
            titleStyle: {fontSize: 18, fontWeight: 'bold'},
            message: `Uğurla əlavə olundu\n---------------\n${name} ${surname}\n\nMağaza: ${shop}\n\nÇəki: ${weight} kq\n\nÖlçü: ${width}x${height}x${length} sm`,
            type: 'success',
            duration: 6000,
            textStyle: {fontSize: 18, fontWeight: 'bold'},
          });
        }
      }
    } catch (e) {
      // console.log(e.response.data);
      alert(JSON.stringify(e));
    } finally {
      setIsLoading(false);
    }
  };

  const hasCurrentSection = currentSection !== null;
  const topContentTitle = hasCurrentSection
    ? 'Oxuyucunu bağlamaya yaxınlaşdırın'
    : 'Oxuyucunu rəfə yaxınlaşdırın';

  const topContentLoadingText = !hasCurrentSection
    ? 'Rəf yoxlanılır...'
    : 'Bağlama rəfə əlavə olunur...';

  const onScan = (data) => {
    onSuccess(data);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopNavigation
        title="Bağlamaları rəflə"
        alignment="center"
        accessoryLeft={back ? BackButton : MenuButton}
        accessoryRight={SignOutButton}
      />
      <Divider />
      <Scanner
        onScan={onScan}
        topContent={
          <ShelfTopContent
            isLoading={isLoading}
            hasCurrentSection={hasCurrentSection}
            currentSection={currentSection}
            topContentLoadingText={topContentLoadingText}
            topContentTitle={topContentTitle}
          />
        }
      />
    </SafeAreaView>
  );
};

export default WarehouseScreen;
