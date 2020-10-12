import React from 'react';
import Sound from 'react-native-sound';
import BarcodeMask from 'react-native-barcode-mask';
import WarehouseScreenStyles from './shelfOrders.styles';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  Button,
  Divider,
  Spinner,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import {SafeAreaView, View} from 'react-native';
import {ApiClient} from 'config/Api';
import {showMessage} from 'react-native-flash-message';
import MenuButton from 'components/menuButton/menuButton.component';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import Scanner from 'components/scanner/scanner.component';
import BackButton from 'components/backButton/backButton.component';

const successSound = new Sound('section.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const ShelfOrders = ({route, navigation}) => {
  const qrRef = React.useRef(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(null);
  const [showCamera, setShowCamera] = React.useState(false);

  const onSuccessShelf = route?.params?.onSuccessShelf;
  const item = route?.params?.item;

  React.useLayoutEffect(() => {
    setTimeout(() => {
      setShowCamera(true);
    }, 300);
  }, []);

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

  const onSuccess = async (data) => {
    // successSound.play();
    setIsLoading(true);
    try {
      let response = null;
      if (currentSection === null || isSection(data)) {
        response = await postSectionData(data);
        const {status, data: sectionData} = response.data;
        if (status === true) {
          setCurrentSection(sectionData);
        }
      } else {
        const orderId = data.split('-')[0];
        response = await postBundleData(orderId);
        // alert(JSON.stringify(response.data));
        if (response?.data?.status === false) {
          showMessage({
            message: 'Sehv',
            type: 'danger',
          });
        } else {
          onSuccessShelf(currentSection);
          navigation.pop();
          showMessage({
            message: 'Uğurla əlavə olundu',
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
        accessoryRight={SignOutButton}
      />
      <Divider />
      <Scanner onScan={onScan} topContent={TopContent} />
    </SafeAreaView>
  );
};

export default ShelfOrders;
