import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Divider,
  Icon,
  Text,
  Spinner,
  Button,
  Card,
} from '@ui-kitten/components';
import CodePush from 'react-native-code-push';
import UpdateScreenStyles from './update.styles';

CodePush.allowRestart();

const UpdateScreen = ({navigation, deploymentKey}) => {
  const [updateData, setUpdateData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [statusProgress, setStatusProgress] = React.useState('');
  const [downloadProgress, setDownloadProgress] = React.useState(null);

  React.useEffect(() => {
    checkUpdate();
  }, [checkUpdate]);

  const checkUpdate = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const newUpdateData = await CodePush.checkForUpdate(deploymentKey);
      setUpdateData(newUpdateData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [deploymentKey]);

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
    <TopNavigationAction icon={ReloadIcon} onPress={onPressCheckUpdate} />
  );

  const onPressDownload = async () => {
    CodePush.sync(
      {
        updateDialog: true,
        deploymentKey,
      },
      (status) => {
        switch (status) {
          case CodePush.SyncStatus.UP_TO_DATE:
            setStatusProgress('Ən son veriyadan istifadə edirsiniz');
            break;
          case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
            setStatusProgress('Yoxlanılır...');
            break;
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            setStatusProgress('Paket endirilir...');
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            setStatusProgress('Paket yüklənir...');
            break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            setStatusProgress('Paket yükləndi');
            CodePush.restartApp();
            break;
          case CodePush.SyncStatus.UPDATE_IGNORED:
            setStatusProgress('Yeniləmə dayandırıldı');
            break;
          case CodePush.SyncStatus.SYNC_IN_PROGRESS:
            setStatusProgress('Zəhmət olmasa gözləyin paket endirilir...');
            break;
          case CodePush.SyncStatus.UNKNOWN_ERROR:
            setStatusProgress('Bilinməyən xəta!');
            break;
          default:
            setStatusProgress('Bilinməyən xəta!');
            console.log(status);
            console.log(JSON.stringify(CodePush.SyncStatus));
            break;
        }
      },
      (progress) => {
        const progressPercentage =
          (progress.receivedBytes / progress.totalBytes) * 100;
        setDownloadProgress(progressPercentage);
      },
    )
      .then((resp) => {
        // setText(resp)
      })
      .catch((error) => console.log(error));
  };

  const Header = (props) => (
    <View {...props}>
      <Text category="h6">Paket məlumatları</Text>
    </View>
  );

  const Footer = (props) => (
    <View {...props} style={[props.style, UpdateScreenStyles.footerContainer]}>
      {downloadProgress !== null ? (
        <Text
          category="s1"
          style={{alignSelf: 'center'}}>{`${downloadProgress}%`}</Text>
      ) : (
        <Button
          style={UpdateScreenStyles.footerControl}
          status="success"
          onPress={onPressDownload}>
          ENDİR
        </Button>
      )}
    </View>
  );

  const renderUpdateData = () => {
    const {label, appVersion, packageSize} = updateData;
    const packageSizeMB = (packageSize / 1048576).toFixed(2);
    return (
      <View style={{marginBottom: 20}}>
        <Text category="s2">
          Paket versiyası: <Text category="s1">{label}</Text>
        </Text>
        <Text category="s2">
          Tətbiq versiyası: <Text category="s1">{appVersion}</Text>
        </Text>
        <Text category="s2">
          Paket ölçüsü: <Text category="s1">{packageSizeMB} MB</Text>
        </Text>
      </View>
    );
  };

  const renderNoUpdate = () => <Text>Yeni versiya mövcud deyil</Text>;

  const renderContent = () => {
    return (
      <Card
        style={UpdateScreenStyles.card}
        header={Header}
        footer={(props) => updateData !== null && !isLoading && Footer(props)}>
        {isLoading ? (
          <Spinner animating />
        ) : (
          <>
            {updateData !== null ? renderUpdateData() : renderNoUpdate()}
            {statusProgress !== '' && (
              <View>
                <Text>Status:</Text>
                <Text category="h4">{statusProgress}</Text>
              </View>
            )}
          </>
        )}
        {/* <Text>{JSON.stringify(updateData)}</Text> */}
      </Card>
    );
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
