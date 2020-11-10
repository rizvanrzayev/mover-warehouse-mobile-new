import {useIsFocused} from '@react-navigation/native';
import {Divider, TopNavigation, Text} from '@ui-kitten/components';
import {fetchWarehouseSendingsList} from 'actions/sendings';
import MenuButton from 'components/menuButton/menuButton.component';
import SendingsList from 'components/sendingsList/sendingsList.component';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import WarehouseSendingsScreenStyles from './warehouseSendings.styles';

const WarehouseSendingsScreen = ({
  fetchWarehouseSendingsList,
  warehouseSendings,
  isLoading,
  navigation,
}) => {
  const isFocused = useIsFocused();

  React.useLayoutEffect(() => {
    if (isFocused) {
      fetchWarehouseSendingsList();
    }
  }, [fetchWarehouseSendingsList, isFocused]);

  const onPressItem = (sendingId) => {
    navigation.navigate('OpenWarehouseSack', {id: sendingId});
  };

  return (
    <SafeAreaView style={WarehouseSendingsScreenStyles.container}>
      <TopNavigation
        title="Göndərişlər"
        alignment="center"
        accessoryLeft={MenuButton}
      />
      <Divider />
      <SendingsList
        data={warehouseSendings}
        isLoading={isLoading}
        onRefresh={fetchWarehouseSendingsList}
        onPressItem={onPressItem}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  warehouseSendings: state.sendings.warehouseSendings,
  isLoading: state.sendings.isLoading,
});

const mapDispatchToProps = {
  fetchWarehouseSendingsList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WarehouseSendingsScreen);
