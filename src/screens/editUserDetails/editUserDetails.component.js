import {
  Button,
  Divider,
  Icon,
  Input,
  TopNavigation,
} from '@ui-kitten/components';
import {putUserAction} from 'actions/user';
import BackButton from 'components/backButton/backButton.component';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {connect} from 'react-redux';
import EditUserDetailsScreenStyles from './editUserDetails.styles';

const AlertIcon = (props) => <Icon {...props} name="alert-circle-outline" />;

const EditUserDetailsScreen = ({
  user,
  putUserAction,
  isEditing,
  navigation,
}) => {
  const {name: currentName, surname: currentSurname} = user;

  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState(currentName);
  const [surname, setSurname] = React.useState(currentSurname);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const onPressEdit = () => {
    const data = {name, surname};
    if (password !== '') {
      data.password = password;
    }
    putUserAction(
      data,
      () => {
        showMessage({
          message: 'Məlumatlar uğurla yeniləndi',
          type: 'success',
        });
        navigation.pop();
      },
      () => {},
    );
  };

  const disabledEditButton = name === '' || surname === '';

  return (
    <SafeAreaView style={EditUserDetailsScreenStyles.container}>
      <TopNavigation
        title="İstifadəçi məl. dəyiş"
        alignment="center"
        accessoryLeft={BackButton}
      />
      <Divider />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={EditUserDetailsScreenStyles.contentContainer}>
        <View>
          <Input
            disabled={isEditing}
            value={name}
            label="İstifadəçi adı"
            placeholder="İstifadəçi adını daxil edin"
            onChangeText={setName}
            status={name === '' ? 'danger' : 'basic'}
          />
          <Input
            disabled={isEditing}
            value={surname}
            label="İstifadəçi soyadı"
            placeholder="İstifadəçi soyadını daxil edin"
            onChangeText={setSurname}
          />
          <Input
            disabled={isEditing}
            value={password}
            label="Yeni şifrə"
            placeholder="Yeni şifrəni daxil edin"
            caption="Yeni şifrə daxil edilmədikcə köhnə şifrə istifadə olunacağ"
            accessoryRight={renderIcon}
            captionIcon={AlertIcon}
            secureTextEntry={secureTextEntry}
            onChangeText={setPassword}
          />
        </View>
        <Button
          disabled={isEditing || disabledEditButton}
          style={EditUserDetailsScreenStyles.editButton}
          onPress={onPressEdit}>
          Yadda saxla
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  isEditing: state.user.isEditing,
});

const mapDispatchToProps = {
  putUserAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditUserDetailsScreen);
