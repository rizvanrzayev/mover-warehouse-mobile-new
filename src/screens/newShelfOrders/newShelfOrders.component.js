import {
  Divider,
  TopNavigation,
  Text,
  Modal,
  Card,
  Button,
} from '@ui-kitten/components';
import {fetchSendingsList} from 'actions/sendings';
import MenuButton from 'components/menuButton/menuButton.component';
import Scanner from 'components/scanner/scanner.component';
import SendingsList from 'components/sendingsList/sendingsList.component';
import ShelfTopContent from 'components/shelfTopContent/shelfTopContent.component';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import {ApiClient, API_ROUTES} from 'config/Api';
import {isCourierSack, isParcel} from 'helpers/Common';
import React, {useCallback} from 'react';
import {useMemo} from 'react';
import {Alert, Image, SafeAreaView, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Sound from 'react-native-sound';
import {connect} from 'react-redux';
import NewShelfOrdersStyles from './newShelfOrders.styles';

const SECTION_ERROR = 'Əvvəlcə rəfi oxudun';

const NewShelfOrdersScreen = ({
  fetchSendingsList,
  sendings,
  navigation,
  isLoading,
}) => {
  const [selectedSection, setSelectedSection] = React.useState(null);

  const [queueData, setQueueData] = React.useState(null);

  React.useLayoutEffect(() => {
    fetchSendingsList();
  }, [fetchSendingsList]);

  const [selectedSendingId, setSelectedSendingId] = React.useState(null);

  function isCharacterALetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  const onScan = useCallback(
    async (data) => {
      const checkIsSection = (section) => isCharacterALetter(section.charAt(0));
      const isSection = checkIsSection(data) && !isParcel(data);
      if (!isSection && !selectedSection) {
        showMessage({
          message: SECTION_ERROR,
          type: 'danger',
        });
        const errorSound = new Sound('unknown.mp3', Sound.MAIN_BUNDLE, () => {
          errorSound.play(() => {
            errorSound.release();
          });
        });
        return;
      }
      const payload = {};

      if (!isParcel(data)) {
        payload.sending_id = selectedSendingId;
      }

      if (isSection) {
        payload.barcode = data;
      } else {
        payload.section = selectedSection;
        payload.barcode = data;
      }

      try {
        const response = await ApiClient.post(
          isParcel(data) || isCourierSack(data)
            ? API_ROUTES.shelvingParcel
            : API_ROUTES.shelvingCreate,
          payload,
        );

        const {
          success,
          message,
          is_pack,
          qr,
          queue,
          data: orderSections,
        } = response.data;

        if (is_pack) {
          const newQueueData = {qr, queue, orderSections};
          setQueueData(newQueueData);
          return;
        }

        if (isSection) {
          setSelectedSection(response.data.data.section);
        }

        showMessage({
          message,
          type: success ? 'success' : 'danger',
        });

        if (success) {
          const clearlySound = new Sound(
            'clearly.mp3',
            Sound.MAIN_BUNDLE,
            () => {
              clearlySound.play(() => {
                clearlySound.release();
              });
            },
          );
        } else {
          const errorSound = new Sound('unknown.mp3', Sound.MAIN_BUNDLE, () => {
            errorSound.play(() => {
              errorSound.release();
            });
          });
        }
      } catch (e) {}
    },
    [selectedSection, selectedSendingId],
  );

  const onPressItem = (id) => {
    setSelectedSendingId(id);
  };

  const renderContent = useCallback(() => {
    const hasCurrentSection = selectedSection !== null;
    const topContentTitle = hasCurrentSection
      ? 'Oxuyucunu bağlamaya, paketə və ya çuvala yaxınlaşdırın'
      : 'Oxuyucunu rəfə yaxınlaşdırın';

    const topContentLoadingText = !hasCurrentSection
      ? 'Rəf yoxlanılır...'
      : 'Bağlama rəfə əlavə olunur...';
    if (selectedSendingId === null) {
      return (
        <View style={NewShelfOrdersStyles.sendingsContainer}>
          <Text
            category="h5"
            status="info"
            style={NewShelfOrdersStyles.sendingsTitle}
            // style={NewShelfOrdersScreenStyles.titleSending}
          >
            Göndəriş seçin
          </Text>
          <SendingsList
            data={sendings}
            isLoading={isLoading}
            onRefresh={fetchSendingsList}
            onPressItem={onPressItem}
          />
        </View>
      );
    }
    return (
      <Scanner
        onScan={onScan}
        topContent={
          <ShelfTopContent
            // isLoading={isLoading}
            hasCurrentSection={hasCurrentSection}
            currentSection={{name: selectedSection}}
            topContentLoadingText={topContentLoadingText}
            topContentTitle={topContentTitle}
          />
        }
      />
    );
  }, [
    fetchSendingsList,
    isLoading,
    onScan,
    selectedSendingId,
    sendings,
    selectedSection,
  ]);

  const base64QR = `data:image/png;base64,${queueData?.qr}`;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopNavigation
        title="Rəflə"
        subtitle="Bağlama, paket, çuval"
        alignment="center"
        accessoryLeft={MenuButton}
        accessoryRight={SignOutButton}
      />
      <Divider />
      {renderContent()}
      {useMemo(
        () => (
          <Modal visible={queueData} style={NewShelfOrdersStyles.modal}>
            <Card disabled={true}>
              <Text
                category="h5"
                status="info"
                style={NewShelfOrdersStyles.modalTitle}>
                Bu müştərinin bağlamaları artıq paketləmə üçün hazırdır
              </Text>
              <Text style={NewShelfOrdersStyles.sectionDetails}>
                Müştərinin rəfdə olan digər bağlamaları
              </Text>
              <View style={NewShelfOrdersStyles.orderSectionsContainer}>
                {/* queueData?.orderSections
                  .filter((section) => section.section) */}
                {queueData?.orderSections
                  .filter((section) => section.section)
                  .map((section) => (
                    <View style={NewShelfOrdersStyles.sectionContainer}>
                      <Text
                        category="control"
                        style={NewShelfOrdersStyles.sectionName}>
                        {section?.section}
                      </Text>
                      <Text category="control">{section.order_id}</Text>
                    </View>
                  ))}
              </View>
              <Text style={NewShelfOrdersStyles.info}>
                Bu QR paketçinin təhvil alması üçündür
              </Text>
              <Image
                source={{uri: base64QR}}
                style={NewShelfOrdersStyles.queueQR}
              />
              <Button status="success" onPress={() => setQueueData(null)}>
                PAKETÇİYƏ TƏHVİL VERDİM
              </Button>
            </Card>
          </Modal>
        ),
        [queueData, base64QR],
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  sendings: state.sendings.sendings,
  isLoading: state.sendings.isLoading,
});

const mapDispatchToProps = {
  fetchSendingsList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewShelfOrdersScreen);
