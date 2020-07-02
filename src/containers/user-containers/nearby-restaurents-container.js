import moment from 'moment';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Text, View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity
} from 'react-native';

import { conversion } from '../../utils/misc';
const { width, height } = Dimensions.get('screen');

import * as selectors from '../../selectors/user-selectors/restaurents-selectors';
import { setDeliveryRestaurant } from '../../actions/user-actions/home-actions';
import { fetchDetailAction } from '../../actions/user-actions/resturant-detail-actions';
import {
  makeSelectCollectingResturant, makeSelectFilterData
} from '../../selectors/user-selectors/home-selectors';

class Restaurents extends Component {

  _renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (item.isValid) {
          const { resturant, delivertRestaurant } = this.props;
          delivertRestaurant(item);
          this.props.fetchDetails(item.id, resturant.id);
          this.props.navigateTo(item);
        }
      }}
    >
      <View style={{ flex: 1, marginBottom: 10, borderRadius: 30, position: 'relative' }}>
        <View style={{ flex: 0.3, justifyContent: 'center' }}>
          <Image
            source={
              item && item.bannerUrl !== '' ?
                { uri: item.bannerUrl } : require('../../assets/images/mcdonald.png')
            }
            style={styles.bannerStyle}
          />
          <View style={styles.overlay}>
            <View style={[styles.locationStyle]}>
              <Text style={{ color: "#fff" }}>
                <Icon
                  name="map-marker"
                  size={16} color="#fff"
                /> {conversion(item.distance)} miles away</Text>
            </View>
          </View>
          {!(item.isValid) ? <View style={styles.message}>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <Text style={{ color: '#fff' }}>
                This restaurant delivers food between {moment(item.deliverTimeStart, "h:mm:ss").format("h:mm A")} to {moment(item.deliverTimeEnd, "h:mm:ss").format("h:mm A")}.
            </Text>
            </View>
          </View> : null}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleStyle}>
            <Text style={{ fontSize: 20, fontWeight: '500', color: '#000' }}>{item.name}</Text>
            {/* <Text style={{ color: '#00a0ff' }}>
              {`Ordering Service Charges: ${item.deliveryServiceCharges}%`}
            </Text> */}
          </View>
          <Text style={{ fontSize: 16, fontWeight: '300', color: '#5e5a5a' }}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { list } = this.props;
    return (
      <View style={styles.container}>
        {list && list.length ? <FlatList
          data={this.props.list}
          extraData={this.state}
          // keyExtractor={this._keyExtractor}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
        /> : <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{
              color: '#000000', fontSize: 16, fontWeight: '400', textAlign: 'center'
            }}>
              Please select dine in restaurant first!
            </Text>
          </View>}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 15,
    marginBottom: 0
  },
  locationStyle: {
    right: 0,
    bottom: 10,
    left: width - 135,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
  },
  bannerStyle: {
    height: 200,
    borderRadius: 10,
    width: width - 20,
  },
  message: {
    top: 0,
    left: 0,
    flex: 1,
    right: 0,
    bottom: 0,
    height: 40,
    alignItems: 'center',
    position: 'absolute',
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    justifyContent: 'center',
    borderTopRightRadius: 10,
    backgroundColor: '#3C71A8',
  }
});

const mapStateToProps = state => ({
  // list: selectors.makeSelectData()(state),
  list: makeSelectFilterData()(state),
  resturant: makeSelectCollectingResturant()(state),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchDetails: (id, collectingId) => dispatch(fetchDetailAction(id, collectingId)),
    delivertRestaurant: resturant => {
      dispatch(setDeliveryRestaurant(resturant));
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurents)