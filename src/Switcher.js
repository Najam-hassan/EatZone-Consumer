import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, ActivityIndicator, AsyncStorage } from 'react-native';

import * as constants from './actions/constants';

class Switcher extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      user: null
     };
  }

  componentWillMount = async () => {
      AsyncStorage.getItem('user').then((user)=>{
      const userRes = JSON.parse(user);
      console.log('userData=====>>>>',userRes);
      AsyncStorage.getItem('user_type').then((type)=>{
            if (type==='admin') {
              if (userRes) {
                if (userRes.stripeId) {
                  this.props.navigation.navigate(user ? 'App' : 'Auth');
                } else {
                  this.props.navigation.navigate('StripeConnectHome',{ user: userRes });
                } 
              } else {
                this.props.navigation.navigate(user ? 'App' : 'Auth');
              }            
            } else {
              this.props.navigation.navigate(user ? 'App' : 'Auth');
            }
      })
    }).catch((error)=>{
      // error in fetching user record
      console.log('error===>>>',error);
    })
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
}

export default connect(null, null)(Switcher);
