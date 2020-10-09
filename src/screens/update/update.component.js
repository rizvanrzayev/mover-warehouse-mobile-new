import React from 'react';
import {SafeAreaView, View, Platform} from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Divider,
  Icon,
  Text,
  Spinner,
  Button,
} from '@ui-kitten/components';
import CodePush from 'react-native-code-push';
import AnimatedNumbers from 'react-native-animated-numbers';
import UpdateScreenStyles from './update.styles';

CodePush.allowRestart();

const UpdateScreen = ({navigation}) => {
  const [updateData, setUpdateData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isInstalling, setIsInstalling] = React.useState(false);
  const [animateToNumber, setAnimateToNumber] = React.useState(0);
  const [text, setText] = React.useState('');

  const downloadedPackage = React.useRef(null);

  React.useEffect(() => {
    checkUpdate();
  }, []);

  const checkUpdate = async () => {
    setIsLoading(true);
    try {
      const newUpdateData = await CodePush.checkForUpdate(
        Platform.OS === 'ios'
          ? 'BDICIqYEsquLexDJspnZpZ0j0e_O_Cbr0vUHD'
          : 'lxaj-AelDzx77gjsOly04YXqDjxSTmCqIUkAz',
      );
      setUpdateData(newUpdateData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressBack = () => navigation.pop();

  const onPressCheckUpdate = () => checkUpdate();

  const BackIcon = (props) => {
    return <Icon name="chevron-left-outline" {...props} />;
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={onPressBack} />
  );

  const ReloadIcon = (props) => {
    return <Icon name="repeat-outline" {...props} />;
  };

  const ReloadAction = () => (
    <TopNavigationAction
      hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
      icon={ReloadIcon}
      onPress={onPressCheckUpdate}
    />
  );

  const onPressDownload = async () => {
    // const downloaded = await updateData.download(({receivedBytes, totalBytes}) =>
    //   setAnimateToNumber(parseInt((receivedBytes / totalBytes) * 100)),
    // );
    // downloaded.install(CodePush.InstallMode.IMMEDIATE);
    CodePush.sync({updateDialog: true}, (status) => {
      switch (status) {
        case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
          setText('Yoxlanılır');
          break;
        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
          setText('Paket endirilir...');
          break;
        case CodePush.SyncStatus.INSTALLING_UPDATE:
          setText('Paket yüklənir...');
          break;
        case CodePush.SyncStatus.UPDATE_INSTALLED:
          setText('Paket yükləndi');
          CodePush.restartApp();
          break;
        case CodePush.SyncStatus.UPDATE_IGNORED:
          setText('Yeniləmə dayandırıldı');

        default:
          break;
      }
    })
      .then((resp) => {
        // setText(resp)
      })
      .catch((error) => console.log(error));
  };

  // const onPressInstall = async () => {
  //   const installedPackage = await downloadedPackage.current.install(CodePush.InstallMode.IMMEDIATE);
  //   console.log(installedPackage);
  // }

  const renderContent = () => {
    const isDownloaded = animateToNumber === 100;
    if (isLoading) {
      return <Spinner animating />;
    } else if (updateData === null) {
      return (
        <View>
          <Text>Yeni versiya mövcud deyil</Text>
        </View>
      );
    } else {
      const {
        label,
        appVersion,
        isMandatory,
        packageSize,
        downloadUrl,
        isPending,
        failedInstall,
      } = updateData;
      return (
        <>
          <Text>{label}</Text>
          <Text category="h4" style={{marginVertical: 20}}>
            {text}
          </Text>
          {/* <View style={UpdateScreenStyles.countContainer}>
            {!isDownloaded ? (
              <AnimatedNumbers
                // includeComma
                animateToNumber={animateToNumber}
                fontStyle={{fontSize: 30, fontWeight: 'bold', color: 'gray'}}
              />
            ) : (
              <Icon
                name="checkmark-outline"
                fill="#8F9BB3"
                style={{width: 32, height: 32}}
              />
            )}
          </View> */}
          <Button onPress={onPressDownload}>Download and Install</Button>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={UpdateScreenStyles.container}>
      <TopNavigation
        title={!isLoading ? 'Yeniləmə' : 'Yeni versiya yoxlanılır...'}
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={ReloadAction}
      />
      <Divider />
      <View style={UpdateScreenStyles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default UpdateScreen;
