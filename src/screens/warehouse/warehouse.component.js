import React from 'react';
import Sound from 'react-native-sound';
import BarcodeMask from 'react-native-barcode-mask';
import WarehouseScreenStyles from './warehouse.styles';
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

const successSound = new Sound('section.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const WarehouseScreen = ({onSuccessTaked}) => {
  const qrRef = React.useRef(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(null);
  const [showCamera, setShowCamera] = React.useState(false);

  React.useLayoutEffect(() => {
    setTimeout(() => {
      setShowCamera(true);
    }, 300);
  }, []);

  const postSectionData = async (sectionName) => {
    const response = await ApiClient.post('select-shelf', {
      shelfBarcode: sectionName,
    });
    return response;
  };

  const postBundleData = async (orderId, officeId) => {
    const response = await ApiClient.post('add-to-shelf', {
      packageBarcode: orderId,
      sectionId: currentSection.section_id,
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

  const onSuccess = async (data) => {
    // successSound.play();
    setIsLoading(true);
    try {
      let response = null;
      if (currentSection === null) {
        if (isSection(data)) {
          response = await postSectionData(data);
          const {status, data: sectionData} = response.data;
          if (status === true) {
            setCurrentSection(sectionData);
          }
        }
      } else {
        const orderId = data.split('-')[0];
        response = await postBundleData(orderId);
        if (response?.data?.success === false) {
          showMessage({
            message: 'Əlavə olunmadı',
            type: 'danger',
          });
        } else {
          showMessage({
            message: 'Uğurla əlavə olundu',
            type: 'success',
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

  const BottomContent = null;

  const onScan = (data) => {
    // alert(data);
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
