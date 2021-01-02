import {Divider, Text, TopNavigation} from '@ui-kitten/components';
import MenuButton from 'components/menuButton/menuButton.component';
import Scanner from 'components/scanner/scanner.component';
import React from 'react';
import {SafeAreaView, View} from 'react-native';
import NewSackingOrdersScreenStyles from './newSackingOrders.styles';

const NewSackingOrdersScreen = () => {
  const TopContent = (
    <View style={NewSackingOrdersScreenStyles.scannerTopContentContainer}>
      <Text>Test</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopNavigation
        title="Bağlamaları çuvalla"
        alignment="center"
        accessoryLeft={MenuButton}
      />
      <Divider />
      <Scanner topContent={TopContent} />
    </SafeAreaView>
  );
};

export default NewSackingOrdersScreen;
