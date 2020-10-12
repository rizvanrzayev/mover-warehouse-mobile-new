import React, {useState} from 'react';
import {Divider, Layout, List, TopNavigation} from '@ui-kitten/components';
import EmptyItem from 'components/emptyItem/emptyItem.component';
import {SafeAreaView, RefreshControl, StatusBar} from 'react-native';

import HomeStyles from './home.styles';
import {connect, useDispatch} from 'react-redux';
import {fetchQueueList} from 'actions/queue';
import QueueItem from 'components/queueItem/queueItem.component';
import firebase from 'react-native-firebase';

import Sound from 'react-native-sound';
import SignOutButton from 'components/signOutButton/signOutButton.component';
import MenuButton from 'components/menuButton/menuButton.component';

const notificationSound = new Sound(
  'notification.mp3',
  Sound.MAIN_BUNDLE,
  (error) => {
    if (error) {
      return;
    }
  },
);

const HomeScreen = ({navigation, fetchQueueList, isLoading, queues}) => {
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
      if (activeQueue !== undefined) {
        setHasActiveQueue(true);
      } else {
        setHasActiveQueue(false);
      }
    }
  }, [queues]);

  const onPressItem = (item) => {
    if (item.from_type === 1) {
      navigation.navigate('ShelfPreparedOrders', {item});
    } else {
      navigation.navigate('QueueDetail', {item});
    }
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
        accessoryLeft={MenuButton}
        accessoryRight={SignOutButton}
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
