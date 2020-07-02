import moment from 'moment';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Toast from 'react-native-easy-toast';
import Drawer from 'react-native-draggable-view';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {
  View, Text, StyleSheet, Dimensions, StatusBar, PermissionsAndroid,
  FlatList, Image, ActivityIndicator, TouchableOpacity, ToastAndroid,
  ScrollView, AsyncStorage, Platform, Linking, Alert
} from 'react-native';

const { height, width } = Dimensions.get('screen');

import DragHeader from '../../components/drag-header';

import { mapsProps } from '../../utils/utils';
import { setInitialDrawerSize, conversion } from '../../utils/misc';

import * as actions from '../../actions/user-actions/home-actions';
import * as selectors from '../../selectors/user-selectors/home-selectors';
import { fetchDetailAction } from '../../actions/user-actions/resturant-detail-actions';

let initialValues = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstClick: true,
      isLoading: false,
      length: 0,
      latitude: "",
      longitude: "",
      region: {
        latitude: null,
        longitude: null,
        latitudeDelta: 1,
        longitudeDelta: 1
      }
    }
  }

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }
    return false;
  }

  getCurrentResPosition = async () => {
    const { fetchCollectingList } = this.props;

    const hasLocationPermission = Platform.OS === 'android' ?
      await this.hasLocationPermission() : false;

    this.setState({ isLoading: hasLocationPermission });

    if (!hasLocationPermission) return;

    Geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      // console.log('lat: ', latitude, 'long: ', longitude);
      initialValues = {
        ...initialValues,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      this.setState({
        isLoading: false,
        latitude: latitude,
        longitude: longitude,
        region: {
          ...this.state.region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      })
      fetchCollectingList(`/user/nearby-restaurants/${latitude},${longitude}`);
      // fetchCollectingList(`/user/nearby-restaurants/31.474241414107382, 74.24986490048468`);
    },
      (error) => {
        if (error.code === 3 || error.message === 'Location request timed out.') {
          this.getCurrentResPosition();
        }
        this.setState({ error: error.message, isLoading: false });
        if (error.message === "No location provider available." || error.code === 2) {
          if (Platform.OS === 'android') {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
              .then(data => {
                this.getCurrentResPosition();
              }).catch(error => {
                console.log(error, '())()()()()')
              });
          } else {
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
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  async componentWillMount() {
    this.setState({ isLoading: true });
    await this.getCurrentResPosition();
  }

  moveBack() {
    this.setState({ firstClick: true });
    const { fetchCollectingList, region } = this.props;
    const { latitude, longitude } = this.state;
    if (region.latitude) {
      fetchCollectingList(`/user/nearby-restaurants/${region.latitude},${region.longitude}`);
    } else {
      fetchCollectingList(`/user/nearby-restaurants/${latitude},${longitude}`);
    }
  }

  setLocation = location => {
    if (location) {
      this.setState({
        firstClick: false,
        region: {
          ...this.state.region,
          latitude: location.coordinates[1],
          longitude: location.coordinates[0]
        }
      });
    }
  }

  _renderItem = ({ item, index }) => (
    < TouchableOpacity
      key={item.id}
      activeOpacity={0.7}
      disabled={!item.isValid}
      onPress={() => {
        const { firstClick } = this.state;
        const { location } = item;
        if (firstClick) {
          this.setLocation(location);
          this.props.fetchList(`/user/eligible-restaurants/${item.id}`);
          this.props.collectingResturant(item);
        } else {          
          const { resturant } = this.props;
          if (item.isValid) {
            this.props.delivertRestaurant(item);
            this.props.fetchDetails(item.id, resturant.id);
            this.props.navigation.navigate('RestaurantDetailScreen', {
              restaurantId: item.id,
              name: item.name
            });
          }
        }
      }}
    >
      <View style={[styles.itemStyling, { marginBottom: this.state.length === index + 1 ? 10 : 0 }]}>
        <Image
          source={
            item && item.bannerUrl !== '' ?
              { uri: item.bannerUrl } : require('../../assets/images/mcdonald.png')
          }
          style={{ width: 70, height: 70, borderRadius: 10 }}
        />
        <View style={{ flex: 1, flexDirection: 'column', marginLeft: 20, }}>
          <Text style={styles.title}>{item.name}</Text>
          {this.state.firstClick}
          {this.state.firstClick ?
            <Text numberOfLines={2} style={styles.description}>
              <Text>Outside food: </Text>
              {moment(item.collectTimeStart, "h:mm:ss").format("h:mm A")} to {moment(item.collectTimeEnd, "h:mm:ss").format("h:mm A")}
            </Text> :
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between'
            }}>
              <Text numberOfLines={2} style={styles.description}>
                {moment(item.deliverTimeStart, "h:mm:ss").format("h:mm A")} to {moment(item.deliverTimeEnd, "h:mm:ss").format("h:mm A")}
              </Text>
              <Text style={styles.description}>
                <Icon
                  name="map-marker"
                  size={14} color="#cccccc"
                /> {conversion(item.distance)} mi</Text>
            </View>
          }
        </View>
        {item && !item.isValid ?
          <View style={styles.bannerMessage}>
            <Text style={styles.bannerText}>Temporarily unavailable</Text>
          </View> : null}
      </View>
    </TouchableOpacity>
  );

  renderMarkers = (list, isValid) => {
    const { navigation } = this.props;
    if (list && list.length)
      return list.map((item, index) => {
        return (
          < Marker
            key={`Alert-marker-${index}`}
            coordinate={{
              latitude: item.location.coordinates[1],
              longitude: item.location.coordinates[0],
              latitudeDelta: 1,
              longitudeDelta: 1
            }}
            title={item.name}
            description={item.addressDetails}
          >
            <Callout
              onPress={() => {
                const { resturant } = this.props;
                if (isValid) {
                  if (item.isValid) {
                    this.props.fetchDetails(item.id, resturant.id);
                    this.props.delivertRestaurant(item);
                    navigation.navigate('RestaurantDetailScreen', {
                      restaurantId: item.id,
                      name: item.name,
                    })
                  } else {
                    this.refs.toast.show("This restaurant is not available at the moment", 2000);
                  }
                }
              }}
              style={{ width: 150 }}
            >
              <Text style={{ fontSize: 20, color: '#000' }}>{item.name}</Text>
              <Text style={{ fontSize: 14, color: '#000' }}>{item.address}</Text>
            </Callout>
          </Marker>
        )
      });
  }

  render() {
    const { list, loading, collecting, region } = this.props;
    const initialRegion = region.latitude ? region : initialValues;
    const { isLoading, firstClick } = this.state;
    const length = collecting && collecting.length ?
      collecting.length : list && list.length ? list.length : 0;
    if (length >= 0 && this.state.length !== length) {
      this.setState({ length: length });
    }
    if (isLoading) {
      return (
        <View style={styles.loadingStyle}>
          <ActivityIndicator size={'large'} color={'#1BA2FC'} />
          <NavigationEvents
            onWillFocus={payload => {
              this.moveBack();
            }}
          />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.moveBack();
          }}
        />
        <Toast
          ref="toast"
          position='bottom'
          fadeOutDuration={3000}
          textStyle={{ color: '#fff' }}
        />
        <Drawer
          initialDrawerSize={setInitialDrawerSize()}
          renderContainerView={() => {
            const { region } = this.state;
            return (
              <MapView
                {...mapsProps}
                maxZoomLevel={20}
                minZoomLevel={13}
                style={styles.map}
                followsUserLocation
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                key={Platform.OS !== 'android' && Date.now()}
                region={region.latitude !== null ?
                  this.state.region : initialRegion}
              >
                <View>
                  {!firstClick && list && list.length ?
                    this.renderMarkers(list, true) : null}
                  {firstClick && collecting && collecting.length ?
                    this.renderMarkers(collecting, false) : null}
                </View>
              </MapView>
            )
          }}
          finalDrawerHeight={(height / 2) - 100}
          renderDrawerView={() => {
            if (loading) {
              return (
                <View style={styles.loadingStyle}>
                  <ActivityIndicator size={'large'} color={'#1BA2FC'} />
                </View>
              )
            } else {
              return (
                <View style={{
                  marginBottom: -50, backgroundColor: '#f7f8fa', flex: .5,
                }}>
                  {firstClick ?
                      <Text style={{ color: '#000000', textAlign: "center", padding: 6 }}>Please select your 
                        <Text style={{ fontWeight: 'bold' }}> Dine-in Restaurant</Text>
                      </Text> 
                    :
                      <Text style={{ color: '#000000', textAlign: "center", padding: 6 }}>Please select your 
                        <Text style={{ fontWeight: 'bold' }}> Ordering Restaurant</Text>
                      </Text>
                    }
                  <ScrollView>
                    {collecting && collecting.length ?
                      <FlatList
                        data={collecting}
                        scrollEnabled={true}
                        extraData={this.state}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => (
                          Date.now() + index.toString()
                        )}
                      /> : list && list.length ?
                        <FlatList
                          data={list}
                          scrollEnabled={true}
                          extraData={this.state}
                          renderItem={this._renderItem}
                          keyExtractor={(item, index) => (
                            Date.now() + index.toString()
                          )}
                        /> :
                        <View style={{
                          flex: .5,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Text style={[styles.title, {
                            fontWeight: '400', color: '#999'
                          }]}>
                            No Restaurant found at your location
                        </Text>
                        </View>
                    }
                  </ScrollView>
                </View>
              )
            }
          }}
          renderInitDrawerView={() => (
            <View style={[styles.dragView]}>
              <StatusBar hidden={true} />
              <DragHeader />
            </View>
          )}
        />
        {
          !firstClick ?
            <View style={styles.overlayMessage}>
              <TouchableOpacity
                onPress={() => this.moveBack()}
                style={{ position: 'relative', margin: 15 }}>
                <Icon name="arrow-left" style={{ fontSize: 18, color: '#000' }} />
              </TouchableOpacity>
            </View>
            :
            null
        }
      </View>
    )
  }
}

const mapStateToProps = state => ({
  list: selectors.makeSelectFilterData()(state),
  loading: selectors.makeSelectLoading()(state),
  collecting: selectors.makeSelectCollectingList()(state),
  resturant: selectors.makeSelectCollectingResturant()(state),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchCollectingList: (url) => {
      dispatch(actions.fetchCollectingListAction(url));
    },
    fetchList: (url) => {
      dispatch(actions.fetchListAction(url));
    },
    collectingResturant: resturant => {
      dispatch(actions.setCollectingResturant(resturant));
    },
    delivertRestaurant: resturant => {
      dispatch(actions.setDeliveryRestaurant(resturant));
    },
    fetchDetails: (id, collectingId) => {
      dispatch(fetchDetailAction(id, collectingId));
    },
  }
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dragView: {
    height: 45,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#cccccc',
    backgroundColor: '#f7f8fa'
  },
  itemStyling: {
    flex: 1,
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
    shadowRadius: 20,
    shadowOpacity: 0.1,
    shadowColor: '#000',
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowOffset: { height: 10, width: 0 },
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginTop: 9,

  },
  description: {
    fontSize: 13,
    fontWeight: '300',
    color: '#cccccc'
  },
  overlayMessage: {
    top: 0,
    left: 0,
    flex: 1,
    right: 0,
    padding: 4,
    position: 'absolute',
    justifyContent: 'center',
  },
  button: {
    height: 30,
    width: '20%',
    color: '#fff',
    borderWidth: 1,
    borderRadius: 50,
    marginVertical: -5,
    textAlign: 'center',
    borderColor: '#fff',
    backgroundColor: '#1BA2FC',
    marginLeft: 5
  },
  loadingStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bannerText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  bannerMessage: {
    top: 5,
    right: 5,
    padding: 3,
    paddingHorizontal: 3,
    paddingVertical: 0,
    borderRadius: 5,
    position: 'absolute',
    backgroundColor: '#00a0ff',
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeContainer)
