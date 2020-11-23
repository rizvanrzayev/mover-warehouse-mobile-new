import React from 'react';
import {Spinner, Text} from '@ui-kitten/components';
import {View} from 'react-native';
import ShelfTopContentStyles from './shelfTopContent.styles';

const ShelfTopContent = ({
  isLoading,
  hasCurrentSection,
  currentSection,
  topContentLoadingText,
  topContentTitle,
}) => {
  return (
    <View style={ShelfTopContentStyles.topContentContent}>
      {hasCurrentSection && (
        <View style={ShelfTopContentStyles.topContentSectionContainer}>
          <Text category="h6" style={ShelfTopContentStyles.section}>
            Seçilmiş rəf:{' '}
            <Text category="h6" style={ShelfTopContentStyles.sectionData}>
              {currentSection?.name}
            </Text>
          </Text>
          <Text category="p2" style={ShelfTopContentStyles.info}>
            Əlavə olunacağ bağlamalar bu rəfə yerləşdiriləcək.
          </Text>
        </View>
      )}
      {isLoading ? (
        <View style={ShelfTopContentStyles.topContentContainer}>
          <Spinner animating status="basic" />
          <Text
            style={[{marginTop: 10}, ShelfTopContentStyles.loading]}
            category="s1">
            {topContentLoadingText}
          </Text>
        </View>
      ) : (
        <Text category="h6" style={ShelfTopContentStyles.topContentTitle}>
          {topContentTitle}
        </Text>
      )}
    </View>
  );
};

export default ShelfTopContent;
