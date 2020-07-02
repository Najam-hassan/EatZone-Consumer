import { connect } from 'react-redux';
import React, { Component } from 'react';
import PhotoUpload from 'react-native-photo-upload';
import { Field, reduxForm, change } from 'redux-form/immutable';
import {
  View, Image, StyleSheet, Dimensions, Platform,
  ActivityIndicator, Keyboard, ScrollView, KeyboardAvoidingView
} from 'react-native';

const { width, height } = Dimensions.get('screen');

import Button from '../../components/common/button';
import InputField from '../../components/common/input';
import * as actions from '../../actions/user-actions/profile-actions';
import { isAlphanumericWithSpace, isValidNumber } from '../../utils/regex';
import * as selectors from '../../selectors/user-selectors/profile-selectors';

import { isValidWebUrl } from '../../utils/regex';

class UserProfileForm extends Component {

  state = {
    avatarUrl: '',
    loading: false,
    submitting: false,
    imageLoading: false
  }

  componentDidMount() {
    this.props.profileDetails();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updating) {
      this.props.navigation.navigate('HomeScreen');
      this.props.resetState();
    }
    if (nextProps.profile && Object.keys(nextProps.profile).length) {
      this.props.change('name', nextProps.profile.name);
      this.props.change('email', nextProps.profile.email);
      this.props.change('phone', nextProps.profile.phone);
      this.setState({ avatarUrl: nextProps.profile.avatarUrl })
      this.props.resetState();
      this.setState({ submitting: false });
    }
  }

  onSubmit = values => {
    const { avatarUrl } = this.state;
    this.setState({ submitting: true });
    Keyboard.dismiss();
    if (isValidWebUrl(avatarUrl)) {
      this.props.profileDetails(values.toJS(), true)
    } else {
      this.props.profileDetails({
        ...values.toJS(),
        // avatarData: `data:image/jpeg;base64,${avatarUrl}`
        avatarData: avatarUrl
      }, true);
      this.setState({ avatarUrl: '' })
    }
  }

  renderFormBody = () => {
    const { loading, submitting, handleSubmit } = this.props;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PhotoUpload
          onStart={() => this.setState({ imageLoading: true })}
          onPhotoSelect={avatar => {
            if (avatar) {
              this.setState({
                avatarUrl: avatar,
                imageLoading: false,
              })
            }
          }}
          onCancel={() => this.setState({ imageLoading: false })}
        >{this.state.avatarUrl !== '' ?
          <Image
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              paddingVertical: 30,
            }}
            resizeMode='cover'
            source={{
              uri: this.state.avatarUrl
            }}
          /> :
          <Image
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
              paddingVertical: 30,
            }}
            resizeMode='cover'
            source={require('../../assets/images/account.png')}
          />}
          {this.state.imageLoading ? <ActivityIndicator
            size="large" color="#000" style={styles.indicator}
          /> : null}
        </PhotoUpload>
        <View style={{ marginTop: 20 }}>
          <Field
            name='name'
            placeholder='Name'
            errorTextColor="red"
            component={InputField}
            keyboardType='email-address'
            customContainerStyle={styles.input}
            customInputStyle={{ color: "#000" }}
          />
          <Field
            name='email'
            editable={false}
            placeholder='Email'
            errorTextColor="red"
            keyboardType='default'
            component={InputField}
            customContainerStyle={styles.input}
            customInputStyle={{ color: "#000" }}
          />
          <Field
            name='phone'
            errorTextColor="red"
            placeholder='Phone No'
            component={InputField}
            keyboardType='phone-pad'
            customContainerStyle={styles.input}
            customInputStyle={{ color: "#000" }}
          />
          {submitting || loading ?
            <ActivityIndicator size="large" color="#1BA2FC" /> :
            <Button
              title="Update"
              onPress={handleSubmit(this.onSubmit)}
              style={styles.button}
              textStyle={{ /* styles for button title */ }}
            />
          }
        </View>
      </ScrollView>
    )
  }

  render() {
    const { loading, submitting, handleSubmit } = this.props;
    if (loading && !this.state.submitting) {
      return (
        <View>
          <ActivityIndicator color={'#1BA2FC'} size={'large'} />
        </View>
      )
    }

    if (Platform.OS === 'android') {
      return (
        <View style={styles.container}>
          {this.renderFormBody()}
        </View>
      )
    }

    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={[styles.container]}
        keyboardVerticalOffset={60}>
        {this.renderFormBody()}
      </KeyboardAvoidingView>
    )
  }
}

const validate = values => {
  const errors = {};
  if (!values.get('email')) {
    errors.email = '*Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.get('email'))) {
    errors.email = 'not valid email!'
  }

  if (!values.get('name')) {
    errors.name = '*Required';
  } else if (!isAlphanumericWithSpace(values.get('name'))) {
    errors.name = 'numeric values not allowed'
  } else if (values.get('name').length < 4 || values.get('name').length > 15) {
    errors.name = 'name must be 4 to 15 charecters long!'
  }

  if (!values.get('phone')) {
    errors.phone = '*Required';
  } else if (!isValidNumber(values.get('phone'))) {
    errors.phone = "Only number allowed "
  } else if (values.get('phone').length !== 10) {
    errors.phone = "Phone number must be 10 characters long"
  }
  return errors;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    alignItems: 'center',
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  input: {
    borderRadius: 50,
    width: width - 50,
    backgroundColor: '#F0F1F3'
  },
  button: {
    backgroundColor: '#1BA2FC',
    width: width - 50,
    color: 'gray',
    marginTop: 10,
    lineHeight: 37,
    borderRadius: 50,
    textAlign: 'center',
  },
  indicator: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
});

const mapStateToProps = state => ({
  error: selectors.makeSelectProfileError()(state),
  profile: selectors.makeSelectProfileData()(state),
  success: selectors.makeSelectUpdateStatue()(state),
  loading: selectors.makeSelectProfileLoading()(state),
  updating: selectors.makeSelectProfileUpdating()(state),
});

const mapDispatchToProps = dispatch => {
  return {
    resetState: () => dispatch(actions.resetState()),
    profileDetails: (data, updating) => dispatch(actions.profileDetailsAction(data, updating)),
    change: (fieldName, value) => {
      dispatch(change('UserProfileForm', fieldName, value));
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({
  form: 'UserProfileForm',
  enableReinitialize: true,
  validate,
})(UserProfileForm));
