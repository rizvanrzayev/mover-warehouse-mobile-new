import React, {useState} from 'react';
import {
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  TopNavigation,
  TopNavigationAction,
  Text,
} from '@ui-kitten/components';
import EmptyItem from 'components/emptyItem/emptyItem.component';
import {
  SafeAreaView,
  RefreshControl,
  View,
  StatusBar,
  Alert,
} from 'react-native';

import HomeStyles from './home.styles';
import {useAuth} from 'contexts/AuthContext';
import {connect, useDispatch} from 'react-redux';
import {fetchQueueList} from 'actions/queue';
import QueueItem from 'components/queueItem/queueItem.component';
import firebase from 'react-native-firebase';

import Sound from 'react-native-sound';

const notificationSound = new Sound(
  'notification.mp3',
  Sound.MAIN_BUNDLE,
  (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  },
);

const HomeScreen = ({navigation, fetchQueueList, isLoading, queues}) => {
  const {signOut} = useAuth();

  const [hasActiveQueue, setHasActiveQueue] = React.useState(false);

  React.useLayoutEffect(() => {
    const listener = firebase.notifications().onNotification((notification) => {
      notificationSound.play();
      const newQueue = JSON.parse(notification._data.newQueue);
      dispatch({type: 'NEW_QUEUE', newQueue});
    });
    return () => listener();
  }, [dispatch]);

  const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    fetchQueueList();
  }, [fetchQueueList]);

  React.useEffect(() => {
    if (queues && queues.length > 0) {
      const activeQueue = queues.find((queue) => queue.is_active);
      console.log(activeQueue);
      if (activeQueue !== undefined) {
        setHasActiveQueue(true);
      } else {
        setHasActiveQueue(false);
      }
    }
  }, [queues]);

  const MenuIcon = (props) => {
    return <Icon name="menu-2-outline" {...props} />;
  };
  const ExitIcon = (props) => {
    return <Icon name="log-out-outline" {...props} />;
  };

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const BackAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={openDrawer} />
  );

  const onPressExit = () => {
    Alert.alert('Diqqət', 'Çıxış etmək istədiyinizdən əminsiniz?', [
      {text: 'XEYR'},
      {text: 'BƏLİ', onPress: signOut, style: 'destructive'},
    ]);
  };

  const ExitAction = () => (
    <TopNavigationAction icon={ExitIcon} onPress={onPressExit} />
  );

  const onPressItem = (item) => {
    navigation.navigate('QueueDetail', {item});
  };

  const renderItem = ({item}) => {
    return (
      <QueueItem
        hasActiveQueue={hasActiveQueue}
        item={item}
        onPressItem={() => onPressItem(item)}
      />
    );
  };

  return (
    <SafeAreaView style={HomeStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <TopNavigation
        title="Home page"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={ExitAction}
      />
      <Divider />
      <Layout style={HomeStyles.content}>
        <List
          ListEmptyComponent={EmptyItem}
          data={queues}
          renderItem={renderItem}
          style={HomeStyles.list}
          contentContainerStyle={[
            {flexGrow: 1},
            queues.length ? undefined : {justifyContent: 'center'},
          ]}
          refreshControl={
            <RefreshControl
              tintColor="#009BD8"
              refreshing={isLoading}
              onRefresh={fetchQueueList}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </Layout>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  queues: state.queue.queues,
  isLoading: state.queue.isLoading,
});

const mapDispatchToProps = {
  fetchQueueList,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
