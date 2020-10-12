import React, {useCallback} from 'react';
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
  Select,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';
import SettingsScreenStyles from './settings.styles';
import {ApiClient} from 'config/Api';
import {SCANNERS} from 'helpers/scanner';
import {getCurrentScanner, setCurrentScanner} from 'helpers/AsyncStorage';
import MenuButton from 'components/menuButton/menuButton.component';

const SettingsScreen = ({navigation}) => {
  const SETTINGS = [
    {
      id: 0,
      title: 'Online status',
      description: 'Status tənzimləməsi sizin .....',
      status: false,
    },
  ];
  const [settings, setSettings] = React.useState(SETTINGS);

  const [selectedScanner, setSelectedScanner] = React.useState();

  const displayValueScanner = SCANNERS[selectedScanner?.row]?.title;

  const [loadingIndex, setLoadingIndex] = React.useState(null);

  React.useEffect(() => {
    fetchSettings();
    fetchCurrentScanner();
  }, [fetchSettings]);

  const fetchCurrentScanner = async () => {
    const currentScanner = await getCurrentScanner();
    if (currentScanner !== null) {
      setSelectedScanner(new IndexPath(currentScanner.id));
    }
  };

  const fetchSettings = useCallback(async () => {
    setLoadingIndex(0);
    try {
      const response = await ApiClient.get('status');
      const newSettings = [...settings];
      newSettings[0].status = response.data.status === 1 ? true : false;
      setSettings(newSettings);
    } catch (error) {
    } finally {
      setLoadingIndex(null);
    }
  }, [settings]);

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
    navigation.navigate('Update');
  };

  const DownloadIcon = (props) => {
    return <Icon name="download-outline" {...props} />;
  };

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

  const renderSelectItem = (item, index) => (
    <SelectItem key={item.id} title={item.title} />
  );

  const onSelectScanner = async (section) => {
    const scanner = SCANNERS[section.row];
    await setCurrentScanner(scanner);
    fetchCurrentScanner();
  };

  const ScannerTypeSelect = () => {
    return (
      <Select
        placeholder="Skanner seçin"
        selectedIndex={selectedScanner}
        value={displayValueScanner}
        onSelect={onSelectScanner}
        style={SettingsScreenStyles.scannerSelectContainer}>
        {SCANNERS.map(renderSelectItem)}
      </Select>
    );
  };

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
        accessoryLeft={MenuButton}
        accessoryRight={UpdateAction}
      />
      <Divider />
      <ListItem
        title="Skanner tipi"
        description="Skannerin tipini təyin edin"
        accessoryLeft={SettingsIcon}
        accessoryRight={(props) => ScannerTypeSelect(props)}
        style={SettingsScreenStyles.scannerContainer}
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
