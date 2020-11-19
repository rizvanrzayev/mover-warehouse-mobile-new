import {
  Card,
  Divider,
  List,
  Text,
  TopNavigation,
  useTheme,
} from '@ui-kitten/components';
import {fetchSendingsList} from 'actions/sendings';
import emptyItemComponent from 'components/emptyItem/emptyItem.component';
import MenuButton from 'components/menuButton/menuButton.component';
import SendingsList from 'components/sendingsList/sendingsList.component';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import {getCountry} from 'helpers/Countries';
import React from 'react';
import {RefreshControl, SafeAreaView, View} from 'react-native';
import {connect} from 'react-redux';
import SendingsScreenStyles from './sendings.styles';

const SendingsScreen = ({
  fetchSendingsList,
  sendings,
  isLoading,
  navigation,
}) => {
  React.useLayoutEffect(() => {
    fetchSendingsList();
  }, [fetchSendingsList]);

  const onPressItem = (id) => {
    navigation.navigate('SendingsSackSorting', {id});
  };

  return (
    <SafeAreaView style={SendingsScreenStyles.container}>
      <TopNavigation
        title="Göndərişlər"
        alignment="center"
        accessoryLeft={MenuButton}
        accessoryRight={SignOutButton}
      />
      <Divider />
      <SendingsList
        data={sendings}
        isLoading={isLoading}
        onRefresh={fetchSendingsList}
        onPressItem={onPressItem}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(SendingsScreen);
