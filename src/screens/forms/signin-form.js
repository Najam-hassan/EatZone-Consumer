import { connect, } from "react-redux";
import React, { Component } from 'react';
import { Field, reduxForm, initialize } from 'redux-form/immutable'
import {
  View, StyleSheet, Dimensions, ActivityIndicator, Text, Keyboard, Platform
} from 'react-native'
import { LoginButton, AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
const { width, height } = Dimensions.get('screen');
import InputField from '../../components/common/input';
import Button from '../../components/common/button';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import * as actions from '../../actions/auth-actions';
import * as selectors from '../../selectors/auth-selectors';
let self;
class SignInForm extends Component {
  constructor(props) {
    super(props)
    self = this
    this.configure()
  }
  onSubmit = (values) => {
    const { playerId } = this.props;
    Keyboard.dismiss();
    if (values) {
      if (this.props.userType === 'admin') {
        this.props.onSubmit('/restaurant/sign-in', { ...values.toJS(), playerId });
      } else {
        this.props.onSubmit('/user/sign-in', { ...values.toJS(), playerId });
      }
    }
  }
  configure() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], webClientId: '1009221909036-ra338jumk0iiem7a3rmg294n7jub9de0.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      loginHint: '',
      forceConsentPrompt: true,
      accountName: '',
      iosClientId: '1009221909036-pcjanv6erh3lld518lmh0g81el3h6deh.apps.googleusercontent.com'
    });
  }
  signIn = async () => {
    const { playerId } = this.props;

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("showing user info  via google", userInfo)
      //   this.setState({ userInfo });
      let params = {
        name: userInfo.user.givenName,
        avatarUrl: userInfo.user.photo,
        email: userInfo.user.email,
        socialMediaLogin: true,
        playerId: playerId
      }
      this.props.onSubmit('/user/sign-in', params);
      setTimeout(() => {
        this.props.onSubmit('/user/sign-in', params);

      }, 1000)
      console.log('showing params here for google submittion', params)


    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  fbsdk = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (functionFun = result => {
        console.log('results here are ', result);

        if (result.isCancelled) {
          alert('Please allow access');
        } else {
          console.log('[show results]', result);
          const infoRequest = new GraphRequest(
            '/me?fields=id,first_name,last_name,name,picture.type(large),email,gender',
            null,
            this.responseInfoCallback,
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      }),
      error => {
        console.log('Login fail with error: ' + error);
        LoginManager.logOut();
      },
    );
  };
  responseInfoCallback(error, result) {
    if (error) {
    } else {
      if (result) {
        self.callFbLognApi(result)
      }
      console.log('responseInfoCallback submitSocialLogin');
    }
  }
  callFbLognApi = (user) => {
    try {
      console.log("shwoing user resposne", user)
      const { playerId } = this.props;
      let params = {
        name: user.name,
        avatarUrl: user.picture.data.url,
        email: user.email,
        socialMediaLogin: true,
        playerId: playerId,

      }
      console.log("showing params ", params)
      this.props.onSubmit('/user/sign-in', params);
      setTimeout(() => {
        this.props.onSubmit('/user/sign-in', params);

      }, 1000)
    } catch (error) {
    }
  }
  render() {
    const { handleSubmit, submitting, loading } = this.props;
    return (
      <View style={styles.container}>
        <View>
          <Field
            name='email'
            placeholder='Email'
            errorTextColor="red"
            component={InputField}
            keyboardType='email-address'
            customContainerStyle={styles.input}
            customInputStyle={{ color: "#000" }}
          />
          <Field
            name='password'
            errorTextColor="red"
            style={styles.input}
            placeholder='Password'
            keyboardType='default'
            component={InputField}
            secureTextEntry={true}
            customContainerStyle={styles.input}
            customInputStyle={{ color: "#000" }}
          />
          {submitting || loading ?
            <ActivityIndicator size="large" color="#1BA2FC" /> :
            <Button
              title="Sign In"
              onPress={handleSubmit(this.onSubmit)}
              style={styles.button}
              textStyle={{ /* styles for button title */ }}
            />
          }
          <Text style={styles.OrLine}>OR</Text>
          <Button
            title="Sign in with facebook"
            onPress={this.fbsdk}
            style={styles.button}
            textStyle={{ /* styles for button title */marginLeft: '3%' }}
            isSocialBtn={true}
            socialIcon={require('../../assets/images/fbIcon.png')}
          />
          <Button
            title="Sign in with google  "
            onPress={this.signIn}
            style={styles.button}
            isSocialBtn={true}
            socialIcon={require('../../assets/images/gIcon.png')}
            textStyle={{ /* styles for button title */marginLeft: '3%' }}
          />
          <View style={{ marginTop: 10 }}>
            <Text
              style={[styles.textStyle, {}]}
              onPress={() => {
                this.props.navigateTo('ForgotPasswordScreen');
              }}
            >
              Forgot Password?
                        </Text>
          </View>
        </View>
        <View style={{ marginTop: Platform.OS === 'ios' ? 50 : '10%' }}>
          <Text style={styles.textStyle}>
            Don't have an account yet?
                            <Text
              style={styles.signUpTextStyle}
              onPress={() => this.props.navigateTo('SignUpScreen')}
            > Sign Up</Text>
          </Text>
        </View>
      </View >
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
  if (!values.get('password')) {
    errors.password = '*Required';
  } else if (values.get('password').length < 6) {
    errors.password = "must be at least 6 characters long"
  }
  return errors;
};

const mapStateToProps = state => ({
  user: selectors.makeSelectData()(state),
  loading: selectors.makeSelectLoading()(state)
});

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: (url, values) => {
      dispatch(actions.loginAction(url, values));
    }
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  input: {
    borderRadius: 50,
    width: width - 50,
    backgroundColor: '#F0F1F3'
  },
  textStyle: {
    textAlign: 'center',
    color: '#000',
    fontWeight: "400"
  },
  signUpTextStyle: {
    color: '#1BA2FC',
    fontWeight: "800"
  },
  GoogleSigninButton: {
    width: 192,
    // height: 48,
    alignSelf: 'center'
  },
  OrLine: {
    alignSelf: 'center',
    margin: 10
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({
  form: 'SigninForm',
  enableReinitialize: true,
  validate,
})(SignInForm))
