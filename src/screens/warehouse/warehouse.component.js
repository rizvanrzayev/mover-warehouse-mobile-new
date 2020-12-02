import React from 'react';
import {Divider, Text, TopNavigation} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native';
import {ApiClient} from 'config/Api';
import {showMessage} from 'react-native-flash-message';
import MenuButton from 'components/menuButton/menuButton.component';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import Scanner from 'components/scanner/scanner.component';
import ShelfTopContent from 'components/shelfTopContent/shelfTopContent.component';
import BackButton from 'components/backButton/backButton.component';
import {errorSound} from 'helpers/Sounds';
import Sound from 'react-native-sound';
import {connect} from 'react-redux';
import {postOrderDataAction, postSectionDataAction} from 'actions/shelf';

const WarehouseScreen = ({
  onSuccessTaked,
  route,
  postSectionDataAction,
  postOrderDataAction,
  isLoading,
}) => {
  // const [isLoading, setIsLoading] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(null);

  const back = route?.params?.back;

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
    if (currentSection === null || isSection(data)) {
      const payload = {
        shelfBarcode: data,
      };
      postSectionDataAction(payload, (sectionData) => {
        onSelectSection(sectionData);
      });
    } else {
      const orderId = `${data.split('-')[0]}-346`;
      const payload = {
        packageBarcode: orderId,
        sectionId: String(currentSection.section_id),
      };
      postOrderDataAction(payload, (responseData) => {
        const {user, order} = responseData;
        const clearlySound = new Sound('clearly.mp3', Sound.MAIN_BUNDLE, () => {
          clearlySound.play(() => {
            clearlySound.release();
          });
        });
        if (!user || !order) {
          showMessage({
            titleStyle: {fontSize: 18, fontWeight: 'bold'},
            message: 'Uğurla əlavə olundu',
            type: 'success',
            duration: 3000,
          });
          return;
        }
        const {name, surname} = user;
        const {weight, shop, width, height, length} = order;
        showMessage({
          titleStyle: {fontSize: 18, fontWeight: 'bold'},
          message: `Uğurla əlavə olundu\n---------------\n${name} ${surname}\n\nMağaza: ${shop}\n\nÇəki: ${weight} kq\n\nÖlçü: ${width}x${height}x${length} sm`,
          type: 'success',
          duration: 6000,
          textStyle: {fontSize: 18, fontWeight: 'bold'},
        });
      });
    }
  };

  const hasCurrentSection = currentSection !== null;
  const topContentTitle = hasCurrentSection
    ? 'Oxuyucunu bağlamaya yaxınlaşdırın'
    : 'Oxuyucunu rəfə yaxınlaşdırın';

  const topContentLoadingText = !hasCurrentSection
    ? 'Rəf yoxlanılır...'
    : 'Bağlama rəfə əlavə olunur...';

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
        onScan={onSuccess}
        topContent={
          <ShelfTopContent
            // isLoading={isLoading}
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

const mapStateToProps = (state) => ({
  isLoading: state.shelf.isLoading,
});

const mapDispatchToProps = {
  postSectionDataAction,
  postOrderDataAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseScreen);
