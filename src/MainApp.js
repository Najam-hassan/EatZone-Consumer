import { connect } from 'react-redux';
import React, { Component } from 'react';
import OneSignal from 'react-native-onesignal';
import { View, ActivityIndicator, AsyncStorage } from 'react-native';
import Switcher from './Switcher'
import * as constants from './actions/constants';
import * as actions from './actions/user-actions/order-list-actions';

class MainApp extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      user: null
     };
    this.verifyUser();
    OneSignal.setLogLevel(7, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    // OneSignal.init("f63350e4-f498-494f-9a3d-6d691518b83c");
    OneSignal.init("2dcde2bf-e008-4460-bc22-3ab0d99c7b4b");
  }

  async componentDidMount() {
    await OneSignal.userProvidedPrivacyConsent();
    OneSignal.provideUserConsent(true);
    OneSignal.addEventListener("opened", this.onOpened.bind(this));
    OneSignal.inFocusDisplaying(2);
    OneSignal.clearOneSignalNotifications()
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  async onOpened(openResult) {
    const userData = await AsyncStorage.getItem('userRes') || null;
    const user = JSON.parse(userData);
    console.log('userRes====>>>>',user);
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    // if(openResult.notification.isAppInFocus){
    //   this.props.fetchList()
    // }
    console.log('openResult: ', openResult);

    const details = openResult.notification.payload.additionalData;
    if (details) {
      AsyncStorage.getItem("user_type")
        .then((value) => {
          const { navigation } = this.props;
          if (value === 'user') {
            this.props.resetOrder()
    this.props.fetchList(0);
            console.log('notttttttt User: ', details);
            navigation.navigate('OrderScreen');
          } else if (value === 'admin') {
            console.log('notttttttt Admin: ', details);
            this.props.dispatch({
              type: constants.RESET_RESTAURANT_ORDERS_STATE,
            })
            navigation.navigate('ResturantOrderDetailsScreen', {
              isNotif: true,
              userRes: user,
              details: details && (details.newOrder ? details.newOrder : (details.updatedNewMenuOrder ? details.updatedNewMenuOrder : {})),
              orderConfirmed: details.orderConfirmed
            });
          }
        })
    }
  }
  verifyUser = async() => {
    // const user = await AsyncStorage.getItem('user');
    // this.props.navigation.navigate(user ? 'App' : 'Auth');

    this.props.navigation.navigate('Switcher');
  }
  
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchList: (params) => dispatch(actions.fetchOrdersAction(params)),
    resetOrder: () => dispatch(actions.resetOrder()),

  }
}

export default connect(null, mapDispatchToProps)(MainApp);
