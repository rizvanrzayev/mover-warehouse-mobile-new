import React from 'react';
import {View, SafeAreaView} from 'react-native';
import {
  TopNavigation,
  Divider,
  Icon,
  TopNavigationAction,
  List,
  ListItem,
  Toggle,
  Text,
  Spinner,
} from '@ui-kitten/components';
import SettingsScreenStyles from './settings.styles';
import {ApiClient} from 'config/Api';

const SettingsScreen = ({navigation}) => {
  const SETTINGS = [
    {
      id: 0,
      title: 'Online status',
      description: 'Status tənzimləməsi sizin .....',
      status: true,
    },
  ];
  const [settings, setSettings] = React.useState(SETTINGS);

  const [loadingIndex, setLoadingIndex] = React.useState(null);

  const changeOnline = async (status, index) => {
    setLoadingIndex(index);
    try {
      const response = await ApiClient.post('status', {status});
      if (response.data.status === true) {
        const newSettings = [...SETTINGS];
        newSettings[index].status = status;
        setSettings(newSettings);
      }
    } catch (error) {
    } finally {
      setLoadingIndex(null);
    }
  };

  const onPressUpdate = () => {
    navigation.navigate('Update')
  }

  const DownloadIcon = (props) => {
    return <Icon name="download-outline" {...props} />;
  };

  const MenuIcon = (props) => {
    return <Icon name="menu-2-outline" {...props} />;
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const BackAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={openDrawer} />
  );

  const UpdateAction = () => (
    <TopNavigationAction icon={DownloadIcon} onPress={onPressUpdate} />
  );

  const onChange = (status, index) => {
    changeOnline(status, index);
  };

  const ActionSwitch = (status, index, props) =>
    loadingIndex === index ? (
      <Spinner size="tiny" />
    ) : (
      <Toggle onChange={(status) => onChange(status, index)} checked={status} />
    );

  const SettingsIcon = (props) => <Icon name="settings-2-outline" {...props} />;

  const renderItem = ({item, index}) => {
    const {title, description, status} = item;
    return (
      <ListItem
        title={title}
        description={description}
        accessoryLeft={SettingsIcon}
        accessoryRight={(props) => ActionSwitch(status, index, props)}
      />
    );
  };

  return (
    <SafeAreaView style={SettingsScreenStyles.container}>
      <TopNavigation
        title="Settings"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={UpdateAction}
      />
      <Divider />
      <List
        data={settings}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
