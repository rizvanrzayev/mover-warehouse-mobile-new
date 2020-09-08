import React from 'react';
import {Spinner, Button, Text} from '@ui-kitten/components';
import ButtonStyles from './button.styles';

const ButtonWithLoader = ({loading = false, title, ...rest}) => {
  const renderAccessoryLeft = () => {
    if (loading) {
      return <Spinner size="tiny" animating={loading} status="control" />;
    }
    return null;
  };

  return (
    <Button
      disabled={loading}
      accessoryLeft={renderAccessoryLeft}
      style={ButtonStyles.button}
      {...rest}>
      {title}
    </Button>
  );
};

export default ButtonWithLoader;
