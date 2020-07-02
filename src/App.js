import { Provider } from 'react-redux'
import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, NetInfo, Alert, Text } from 'react-native';

import AppContainer from './navigators';
import configureStore from './store';
import { opoFontFix } from './utils/utils'


import { axiosClient } from './utils/config'

const store = configureStore();
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
opoFontFix()
export default class App extends Component {

  state = {
    connection_Status: "",
    isConnected: true,
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected });
  };

  render() {
    return (
      <Provider store={store}>
        <SafeAreaView style={{ flex: 1 }}>
          {!this.state.isConnected ? Alert.alert(
            "No Internet Access",
            "You do not have Internet Access. Please connect to internet in order to use the App.",
            [
              {
                text: 'OK', onPress: () => {
                }
              }
            ]
          ) : null}
          <AppContainer />
        </SafeAreaView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
