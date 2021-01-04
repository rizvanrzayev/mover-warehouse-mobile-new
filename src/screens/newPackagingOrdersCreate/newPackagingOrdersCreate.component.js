import {
  Button,
  Card,
  Divider,
  List,
  ListItem,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import {fetchPrepareData} from 'actions/packaging';
import BackButton from 'components/backButton/backButton.component';
import Scanner from 'components/scanner/scanner.component';
import {ApiClient, API_ROUTES} from 'config/Api';
import React from 'react';
import {useCallback} from 'react';
import {useMemo} from 'react';
import {Alert, SafeAreaView, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {connect} from 'react-redux';
import NewPackagingOrdersCreateScreenStyles from './newPackagingOrdersCreate.style';

const NewPackagingOrdersCreateScreen = ({
  navigation,
  route,
  fetchPrepareData,
  user,
  sortOrder,
  sortPreparePackages = [],
  totalSorted,
}) => {
  const sendingId = route.params?.sendingId;
  const sortPrepareId = route.params?.sortPrepareId;

  const [selectedPackageId, setSelectedPackageId] = React.useState(null);

  React.useLayoutEffect(() => {
    fetchPrepareData(sendingId, sortPrepareId);
  }, [sendingId, sortPrepareId, fetchPrepareData]);

  const onPressDeletePackage = useCallback(
    (id) => {
      const removePackage = async (packageId) => {
        const response = await ApiClient.get(
          `${API_ROUTES.removePackage}/${packageId}`,
        );
        const {status, message} = response.data;
        if (status) {
          fetchPrepareData(sendingId, sortPrepareId);
        }
        showMessage({
          message,
          type: status ? 'success' : 'danger',
        });
      };
      Alert.alert('Diqqət!', 'Bu paketi silmək istədiyinizdən əminsiniz?', [
        {text: 'Bəli', style: 'destructive', onPress: () => removePackage(id)},
        {text: 'Xeyr'},
      ]);
    },
    [fetchPrepareData, sendingId, sortPrepareId],
  );

  const onPressCompletePackaging = async () => {
    const response = await ApiClient.get(
      `${API_ROUTES.endPackaging}/${sendingId}/${sortPrepareId}`,
    );
    const {status, message} = response.data;
    if (status) {
      navigation.pop();
    }
    showMessage({
      message,
      type: status ? 'success' : 'danger',
    });
  };

  const printPackageLabel = async (packageId) => {
    const data = {packageId};
    const response = await ApiClient.post(`${API_ROUTES.printPackage}`, data);
    console.log(response.data);
  };

  const selectOrCreatePackage = useCallback(
    async (qrCode) => {
      const data = {qrCode};
      const response = await ApiClient.post(
        `${API_ROUTES.selectPackage}/${sendingId}/${sortPrepareId}`,
        data,
      );
      const {status, message = '', sortedPreparePackage} = response.data;
      if (status) {
        setSelectedPackageId(sortedPreparePackage.id);
        fetchPrepareData(sendingId, sortPrepareId);
      }
      showMessage({
        message,
        type: status ? 'success' : 'danger',
      });
    },
    [sendingId, sortPrepareId, fetchPrepareData],
  );

  const putOrderToPackage = async (orderQrCode) => {
    const selectedPackage = sortPreparePackages.find(
      (packageData) => packageData.id === selectedPackageId,
    );
    const packageQrCode = selectedPackage.unique_code;
    const data = {orderQrCode, packageQrCode};
    const response = await ApiClient.post(
      `${API_ROUTES.putPackage}/${sendingId}/${sortPrepareId}`,
      data,
    );
    const {status, message = ''} = response.data;
    if (status) {
      fetchPrepareData(sendingId, sortPrepareId);
    }
    showMessage({
      message,
      type: status ? 'success' : 'danger',
    });
  };

  const onPressItemSelectPackage = useCallback(
    (unique_code) => {
      selectOrCreatePackage(unique_code);
    },
    [selectOrCreatePackage],
  );

  const onScan = (data) => {
    const newData = data.split('-')[1];
    if (newData === '505' || newData === '506' || newData === '507') {
      selectOrCreatePackage(data);
    } else {
      if (selectedPackageId === null) {
        showMessage({
          message: 'İlk öncə paketi oxudun',
          type: 'info',
        });
      } else {
        putOrderToPackage(data);
      }
    }
  };

  const renderQueueInfo = () => {
    const {name, surname, id} = user;
    const newUserId = id + 100000;
    return (
      <View style={NewPackagingOrdersCreateScreenStyles.queueInfoContainer}>
        <Text
          status="control"
          style={NewPackagingOrdersCreateScreenStyles.queueInfo}>
          {newUserId} - {name} {surname} -{' '}
          {`${sortOrder.length}/${totalSorted}`}
        </Text>
      </View>
    );
  };

  const Header = useCallback(
    (props) => {
      const {id, unique_code} = props.item;
      const isSelected = selectedPackageId === id;
      return (
        <View
          {...props}
          style={[
            props.style,
            NewPackagingOrdersCreateScreenStyles.itemHeaderContainer,
            {backgroundColor: isSelected ? '#96F3FB' : 'transparent'},
          ]}>
          <Text category="h6">{unique_code}</Text>
          <Button
            disabled={isSelected}
            onPress={() => onPressItemSelectPackage(unique_code)}>
            {isSelected ? 'SEÇİLİB' : 'Seç'}
          </Button>
        </View>
      );
    },
    [onPressItemSelectPackage, selectedPackageId],
  );

  const Footer = useCallback(
    (props) => {
      const {id} = props.item;
      return (
        <View
          {...props}
          style={[
            props.style,
            NewPackagingOrdersCreateScreenStyles.footerContainer,
          ]}>
          <Button
            style={NewPackagingOrdersCreateScreenStyles.footerControl}
            size="small"
            status="info"
            onPress={() => printPackageLabel(id)}>
            ÇAP ET
          </Button>
          <Button
            style={[
              NewPackagingOrdersCreateScreenStyles.footerControl,
              {marginTop: 10},
            ]}
            size="small"
            onPress={() => onPressDeletePackage(id)}>
            SİL
          </Button>
        </View>
      );
    },
    [onPressDeletePackage],
  );

  const renderEmptyOrder = () => <Text>Bu paketdə heç bir bağlama yoxdur</Text>;

  const renderOrder = (order) => {
    const {id} = order;
    return (
      <View style={NewPackagingOrdersCreateScreenStyles.orderItemContainer}>
        <Text key={order.id}>{id}</Text>
        <Divider />
      </View>
    );
  };

  const renderItemContent = useCallback(
    (orders) =>
      orders.length > 0 ? orders.map(renderOrder) : renderEmptyOrder(),
    [],
  );

  const renderItem = useCallback(
    ({item}) => {
      const {orders} = item;
      return (
        <Card
          style={NewPackagingOrdersCreateScreenStyles.itemContainer}
          header={(props) => Header({...props, item})}
          footer={(props) => Footer({...props, item})}>
          {renderItemContent(orders)}
        </Card>
      );
    },
    [Footer, Header, renderItemContent],
  );

  const keyExtrator = (item) => String(item.id);

  const renderPackages = useCallback(() => {
    return (
      <List
        data={sortPreparePackages}
        keyExtractor={keyExtrator}
        renderItem={renderItem}
      />
    );
  }, [renderItem, sortPreparePackages]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopNavigation
        title="Paketi hazırla"
        alignment="center"
        accessoryLeft={BackButton}
      />
      <Divider />
      <View style={NewPackagingOrdersCreateScreenStyles.content}>
        {renderQueueInfo()}
        {useMemo(() => renderPackages(), [renderPackages])}
        <View style={NewPackagingOrdersCreateScreenStyles.completeContainer}>
          <Button status="success" onPress={onPressCompletePackaging}>
            TAMAMLA
          </Button>
        </View>
      </View>
      <Scanner showContent={false} onScan={onScan} />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  sortOrder: state.packaging.sortOrder,
  sortPreparePackages: state.packaging.sortPreparePackages,
  totalSorted: state.packaging.totalSorted,
  user: state.packaging.user,
});

const mapDispatchToProps = {
  fetchPrepareData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewPackagingOrdersCreateScreen);
