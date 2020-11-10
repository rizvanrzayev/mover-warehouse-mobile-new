import React from 'react';
import {Divider, TopNavigation} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native';
import {ApiClient} from 'config/Api';
import {showMessage} from 'react-native-flash-message';
import Scanner from 'components/scanner/scanner.component';
import BackButton from 'components/backButton/backButton.component';
import ShelfTopContent from 'components/shelfTopContent/shelfTopContent.component';
import {errorSound} from 'helpers/Sounds';

const ShelfOrders = ({route, navigation}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(null);

  const onSuccessShelf = route?.params?.onSuccessShelf;
  const item = route?.params?.item || {};

  const postSectionData = async (sectionName) => {
    const response = await ApiClient.post('worker/select-shelf-total', {
      name: sectionName,
      office_id: '0',
    });
    return response;
  };

  const postBundleData = async (orderId) => {
    const response = await ApiClient.post('worker/add-to-shelf-total', {
      unique_id: orderId,
      section_id: String(currentSection.section_id),
      queue_id: item.id,
    });
    return response;
  };

  const isSection = (data) => data.includes('HZR');

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
        const orderId = data;
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
            message: `Uğurla əlavə olundu\n---------------\n${item.customer_name}`,
            type: 'success',
          });
        }
      }
    } catch (e) {
      // console.log(e.response.data);
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
        accessoryLeft={BackButton}
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

export default ShelfOrders;
