import {Divider, TopNavigation} from '@ui-kitten/components';
import MenuButton from 'components/menuButton/menuButton.component';
import Scanner from 'components/scanner/scanner.component';
import ShelfTopContent from 'components/shelfTopContent/shelfTopContent.component';
import {ApiClient} from 'config/Api';
import React from 'react';
import {SafeAreaView} from 'react-native';

const NewShelfOrdersScreen = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(null);

  const postShelfData = async (data) => {
    const isSection = data.includes('HZR');
    const requestData = {};
    const response = await ApiClient.post(
      'worker/select-shelf-total',
      requestData,
    );
    return response;
  };

  const onScan = (data) => {};

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopNavigation
        title="Bağlamaları rəflə"
        alignment="center"
        accessoryLeft={MenuButton}
      />
      <Divider />
      <Scanner
        onScan={onScan}
        topContent={
          <ShelfTopContent
          // isLoading={isLoading}
          // hasCurrentSection={hasCurrentSection}
          // currentSection={currentSection}
          // topContentLoadingText={topContentLoadingText}
          // topContentTitle={topContentTitle}
          />
        }
      />
    </SafeAreaView>
  );
};

export default NewShelfOrdersScreen;
