import {useTheme, Text, Spinner} from '@ui-kitten/components';
import React from 'react';
import {View, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import SackInfoViewStyles from './sackInfoView.styles';

const ADDING_LOADER_SHOW = 0;
const ADDING_LOADER_HIDE = -300;

const SackInfoView = ({isAdding, oldSack, newSack, isLoading}) => {
  const theme = useTheme();

  const loaderTop = React.useRef(new Animated.Value(ADDING_LOADER_HIDE))
    .current;

  React.useEffect(() => {
    Animated.timing(loaderTop, {
      toValue: isAdding ? ADDING_LOADER_SHOW : ADDING_LOADER_HIDE,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isAdding, loaderTop]);

  const AddingLoader = () => {
    return (
      <Animated.View
        style={[
          SackInfoViewStyles.addingLoaderContainer,
          {backgroundColor: theme['color-success-default'], top: loaderTop},
        ]}>
        <View style={SackInfoViewStyles.addingLoaderLottieContainer}>
          <LottieView
            source={require('assets/lotties/transfer.json')}
            autoPlay
            loop
            resizeMode="cover"
          />
        </View>
        <Text category="h6">Bağlamanın yeri dəyişdirilir...</Text>
      </Animated.View>
    );
  };

  const SingleSackContent = ({sackData, isOld}) => {
    const status = isOld ? 'basic' : 'control';
    return sackData ? (
      <>
        <Text category="h6" status={status}>
          {isOld ? 'Köhnə' : 'Yeni'}
        </Text>
        <Text category="h6" status={status}>
          {isOld ? sackData?.id : sackData?.name}
        </Text>
      </>
    ) : (
      <>
        <Text category="h6" status={status}>
          Çuval seçilməyib
        </Text>
      </>
    );
  };

  const SingleSack = ({isOld, sackData}) => (
    <View
      style={[
        SackInfoViewStyles.singleSackContainer,
        {
          backgroundColor: isOld
            ? theme['color-warning-500']
            : theme['color-info-default'],
        },
      ]}>
      <SingleSackContent sackData={sackData} isOld={isOld} />
    </View>
  );

  return (
    <View style={SackInfoViewStyles.container}>
      <View
        style={[
          SackInfoViewStyles.content,
          {borderColor: theme['color-info-default']},
        ]}>
        {isLoading ? (
          <View
            style={[
              SackInfoViewStyles.loadingContainer,
              {backgroundColor: theme['color-info-default']},
            ]}>
            <Spinner status="control" />
            <Text
              category="h6"
              status="control"
              style={SackInfoViewStyles.loadingText}>
              Çuval yoxlanılır...
            </Text>
          </View>
        ) : (
          <>
            <SingleSack isOld sackData={oldSack} />
            <SingleSack sackData={newSack} />
          </>
        )}
        <AddingLoader />
      </View>
    </View>
  );
};

export default SackInfoView;
