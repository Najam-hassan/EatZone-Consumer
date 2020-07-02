import { connect } from 'react-redux';
import React, { Component } from 'react';
import Permissions from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

import {
  View, AsyncStorage, ActivityIndicator, StyleSheet, Platform, Alert
} from 'react-native';

import { Header } from '../../components/common/header';
import UserDashboard from '../../containers/user-containers/home-container';
import OwnerDashboard from '../../containers/restaurant-containers/home-container';

import * as actions from '../../actions/user-actions/home-actions';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      error: null,
      loading: true,
      region: {
        latitude: null,
        longitude: null,
        latitudeDelta: 1,
        longitudeDelta: 1
      }
    }
  }


  checkUserType = async () => {
    this.setState({ loading: Platform.OS === 'ios' });
    const type = await AsyncStorage.getItem('user_type');
    if (type === 'admin') {
      this.setState({
        type: 'admin',
        loading: false
      });
    } else {
      Platform.OS === 'ios' && await this.getCurrentPositionIos()
      this.setState({ type: 'user' });
    }
  };

  getCurrentLocation = async () => {
    const { fetchCollectingList } = this.props;
    await Geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.setState({
        loading: false,
        region: {
          ...this.state.region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      });
      fetchCollectingList(`/user/nearby-restaurants/${latitude},${longitude}`);
    }, (error) => {
      if (error.code === 3 || error.message === 'Location request timed out.') {
        this.getCurrentLocation();
      }
      this.setState({
        error: error.message,
        loading: false
      });
      if (error.message === "No location provider available." || error.code === 2) {
        return Alert.alert(
          "",
          'Please enable your device location',
          [
            {
              text: 'settings', onPress: () =>
                Linking.openURL('App-Prefs:root=LOCATION_SERVICES:')
            },
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
          ],
          { cancelable: false },
        );
      }
    },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  getCurrentPositionIos() {
    Permissions.check('location', { type: 'always' })
      .then(res => {
        if (res === 'undetermined') {
          Permissions.request('location', { type: 'always' }).then(res => {
            this.getCurrentLocation()
          }).catch(error => {
            console.log(error);
          })
        } else {
          this.getCurrentLocation()
        }
      })
  }

  componentDidMount() {
    this.checkUserType();
  }

  render() {
    const { loading, type, region } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header
          navigation={this.props.navigation}
          title={type === 'admin' ?
            'Categories' : type === 'user' ?
              'Home' : null}
        />
        {loading ?
          <View style={styles.loadingStyle}>
            <ActivityIndicator size={'large'} color={'#1BA2FC'} />
          </View>
          : type === 'admin' ? <OwnerDashboard
            navigation={this.props.navigation}
          /> :
            type === 'user' ?
              <UserDashboard
                region={this.state.region}
                navigation={this.props.navigation}
                type={this.state.type}
              /> : null
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    fetchCollectingList: (url) => {
      dispatch(actions.fetchCollectingListAction(url));
    },
  }
}

const styles = StyleSheet.create({
  loadingStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
