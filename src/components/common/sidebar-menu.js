import axios from 'axios';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import PhotoUpload from 'react-native-photo-upload';
import { DrawerActions } from 'react-navigation';
import {
  StyleSheet, View, TouchableOpacity, Text, ScrollView, AsyncStorage, Image
} from 'react-native';

import { resetAuthState } from '../../actions/auth-actions'
import { updateProfileAction } from '../../actions/restaurant-actions/profile-actions';
import { makeSelectProfileData } from '../../selectors/user-selectors/profile-selectors';

class SidebarMenu extends Component {
  state = { type: null, user: null, avatarUrl: '' }

  componentWillMount() {
    this.fetchUser()
  }

  componentDidMount() {
    AsyncStorage.getItem('user_type', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        this.setState({ type: value });
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    AsyncStorage.getItem('user')
      .then(data => {
        data = JSON.parse(data);
        if (!(data.name === this.state.user.name)) {
          this.setState({ user: data });
        }
      });
    if (nextProps.user &&
      Object.keys(nextProps.user).length > 0 &&
      nextProps.user.avatarUrl !== '') {
      this.setState({ user: nextProps.user });
      // AsyncStorage.setItem(
      //   'user', JSON.stringify(nextProps.user)
      // )
    }
  }

  fetchUser() {
    AsyncStorage.getItem('user', (err, user) => {
      if (user !== null) {
        this.setState({
          user: JSON.parse(user)
        });
      }
    });
  }

  renderUserImage = () => {
    const { user } = this.state;
    if (!isEmpty(this.props.user) && this.props.user.avatarUrl != '') {
      return (
        <Image
          source={{ uri: user.avatarUrl }}
          resizeMode='cover'
          style={{
            height: 80,
            width: 80,
          }}
        />
      )
    }

    return (
      <Image
        source={
          (user && user.avatarUrl !== null && user.avatarUrl !== '')
            ? { uri: user.avatarUrl } : require('../../assets/images/account.png')
        }
        resizeMode='cover'
        style={{
          height: 80,
          width: 80,
        }}
      />
    )
  }

  uploadPhoto(avatar) {
    this.props.updateProfile({ bannerData: avatar });
  }

  logout = (url) => (axios.post(url));

  render() {
    const { type, user } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, paddingHorizontal: 30 }}>
        <View style={styles.topViewStyle}>
          <View style={styles.UserImg}>
            {
              !(type === 'admin') ?
                this.renderUserImage()
                :
                <PhotoUpload
                  onPhotoSelect={avatar => {
                    if (avatar) {
                      this.uploadPhoto(avatar)
                    }
                  }}
                >{user && user.bannerUrl !== '' ?
                  <Image
                    style={{
                      width: 130,
                      height: 80,
                    }}
                    resizeMode='contain'
                    source={{ uri: user.bannerUrl }}
                  /> :
                  <Image
                    style={{
                      width: 130,
                      height: 80,
                    }}
                    resizeMode='contain'
                    source={require('../../assets/images/account.png')}
                  />
                  }
                </PhotoUpload>
            }
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#333333' }}>{user ? user.name : null}</Text>
          </View>
        </View>
        {type === 'admin' ?
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.menu}>
              <View
                style={[styles.menuText, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("HomeScreen");
                    navigation.dispatch(DrawerActions.closeDrawer());
                  }}>
                  <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                    Menu
                                 </Text>
                  <Text style={styles.borderBottom}></Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('RecentOrdersScreen')
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  Recent Orders
                             </Text>
                <Text style={styles.borderBottom}></Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('CompletedOrdersScreen')
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  Completed Orders
                            </Text>
                <Text style={styles.borderBottom}></Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('StripDashboard')
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  Stripe Dashboard
                             </Text>
                <Text style={styles.borderBottom}></Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('TransactionHistoryScreen')
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  Payment History
                            </Text>
                <Text style={styles.borderBottom}></Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('EditRestaurantProfile');
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  Profile
                            </Text>
                <Text style={styles.borderBottom}></Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  AsyncStorage.clear();
                  this.props.clearStore();
                  this.logout('/restaurant/sign_out');
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('WelcomeScreen');
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView> :
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('HomeScreen')
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  Home
                            </Text>
                <Text style={styles.borderBottom}></Text>
              </TouchableOpacity>

              <View
                style={[styles.menuText, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.dispatch(DrawerActions.closeDrawer());
                    navigation.navigate("RestaurantsScreen")
                  }}
                >
                  <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                    Restaurants Near me
                                 </Text>
                  <Text style={styles.borderBottom}></Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('OrderScreen')
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  My Orders
                             </Text>
                <Text style={styles.borderBottom}></Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('ProfileScreen')
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  Profile
                            </Text>
                <Text style={styles.borderBottom}></Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuText}
                onPress={() => {
                  AsyncStorage.clear();
                  this.props.clearStore();
                  this.logout('/user/sign_out');
                  navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.navigate('WelcomeScreen')
                }}
              >
                <Text style={{ color: '#333333', textTransform: 'uppercase' }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: makeSelectProfileData()(state),
})

const mapDispatchToProps = dispatch => {
  return {
    clearStore: () => dispatch(resetAuthState()),
    updateProfile: data => dispatch(updateProfileAction(data))
  }
}

const styles = StyleSheet.create({
  topViewStyle: {
    marginVertical: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  UserImg: {
    backgroundColor: '#e1e1e1',
    height: 80,
    width: 80,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    overflow: "hidden"
  },
  menuText: {
    paddingVertical: 10
  },
  borderBottom: {
    height: 2,
    width: 40,
    marginTop: 20,
    backgroundColor: '#e8e8e8'
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarMenu);