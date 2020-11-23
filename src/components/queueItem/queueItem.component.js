import React, {useCallback} from 'react';
import {ListItem, Text, Button, Spinner} from '@ui-kitten/components';
import moment from 'moment';
import {View} from 'react-native';
import QueueItemStyles from './queueItem.styles';
import {connect} from 'react-redux';
import {fetchQueueList} from 'actions/queue';
import {ApiClient, API_ROUTES} from 'config/Api';
import {getQueueActionType} from 'helpers/queue';

const QueueItem = ({item, onPressItem, fetchQueueList, hasActiveQueue}) => {
  const {
    customer_name,
    started_at,
    is_active,
    created_at,
    id,
    isNew,
    type,
    from_type,
  } = item;

  React.useLayoutEffect(() => {
    calculateStartDate();
    const interval = setInterval(() => {
      calculateStartDate();
    }, 1000);
    return () => clearInterval(interval);
  }, [calculateStartDate, item]);

  const calculateStartDate = useCallback(() => {
    if (started_at !== null) {
      const diff = moment(moment.now()).diff(started_at);
      const duration = moment.duration(diff);
      const dateString = moment
        .utc(duration.as('milliseconds'))
        .format('HH:mm:ss');
      const days = duration.days();
      const daysString = days > 0 ? `${days} gün` : '';
      const timerData = `${daysString} ${dateString}`;
      setTimer(timerData);
    }
  }, [started_at]);

  const [timer, setTimer] = React.useState('');
  const [isStarting, setIsStarting] = React.useState(false);

  const renderItemLeft = () => {
    const queueActionType = getQueueActionType(type, from_type);

    const typeTitle = queueActionType.description;

    const typeStatus = queueActionType.status;

    const title = is_active ? typeTitle : 'Gözləmədə';

    const status = is_active ? typeStatus : 'danger';

    return (
      <View style={QueueItemStyles.queueTitleContainer}>
        <Text status={status} style={QueueItemStyles.queueTitle}>
          {title}
        </Text>
      </View>
    );
  };

  const onPressStartQueue = async () => {
    setIsStarting(true);
    try {
      const response = await ApiClient.post(`${API_ROUTES.startQueue}/${id}`);
    } catch (e) {
    } finally {
      onPressItem(item);
      setIsStarting(false);
      fetchQueueList();
    }
  };

  const renderStartButtonLeft = () =>
    isStarting ? <Spinner animating status="control" size="tiny" /> : null;

  const renderItemRight = () => {
    return (
      <View style={QueueItemStyles.rightContainer}>
        {is_active ? (
          <View style={QueueItemStyles.timerContainer}>
            <Text category="s2">{timer}</Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {isNew && (
              <Text style={{marginRight: 10}} status="success">
                YENİ!
              </Text>
            )}
            {!hasActiveQueue && (
              <Button
                accessoryLeft={renderStartButtonLeft}
                status="info"
                size="tiny"
                onPress={onPressStartQueue}>
                Start
              </Button>
            )}
          </View>
        )}
        <View style={QueueItemStyles.queueContainer}>
          <Text style={QueueItemStyles.queueText}>{item.novbe_id}</Text>
        </View>
      </View>
    );
  };

  return (
    <ListItem
      disabled={!is_active}
      title={customer_name}
      description={moment(created_at).format('DD.MM.YYYY hh:mm:ss')}
      onPress={onPressItem}
      accessoryLeft={() => renderItemLeft()}
      accessoryRight={() => renderItemRight()}
    />
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  fetchQueueList,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueueItem);
