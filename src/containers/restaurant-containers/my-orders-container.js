import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Linking, Platform, RefreshControl, ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { calculateCostSub2 } from '../../utils/misc';
import Button from '../../components/common/button';
// calculateCostSub2(item.orderItinerary.items, item.orderItinerary.deliveryServiceCharges, item.orderItinerary.collectingServiceCharge)
class OrdersContainer extends Component {

  renderOrderCard = ( item, index ) => {
    const { isDelivery } = this.props;
    return (
      <View
        key={`order-item-${index}`}
        style={styles.container}
      >
        <View style={styles.orderCardContainer}>
          {/* {!isDelivery && item.deliveringRestaurant && (item.orderStatus === "COMPLETED" || item.orderStatus == "CANCELLED") ? */}
            <View style={[styles.bannerMessage,{
                  backgroundColor:
                    item.orderStatus === 'PENDING' ?
                      'rgb(253,198,68)' 
                      : item.orderStatus === 'COMPLETED' ? 
                        '#00a651' 
                        : item.orderStatus === 'CANCELLED' ?
                          '#ff0000' 
                          : item.orderStatus === 'CONFIRMED' ?
                            'rgb(105,55,145)' : null
                }]}>
              <Text style={styles.bannerText}>{`${item.orderStatus}`}</Text>
            </View> 
             {/* : null} */}
          <View style={styles.detailsContainer}>
            {item && item.user.avatarUrl ?
              <Image
                source={{ uri: item.user.avatarUrl }}
                style={styles.imageStyle}
              /> :
              <Image
                source={require('../../assets/images/account.png')}
                style={{ height: 60, width: 60, borderRadius: 30 }}
              />}
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{item.user && item.user.name || 'Name Here'}</Text>
            </View>
          </View>
          <View style={styles.orderDetails}>
            <Text style={styles.userInfo}>Order Id: {item.id}</Text>
            <Text style={styles.userInfo}>
              Total:   ${item.billAmount ? (item.billAmount).toFixed(2) : null}
            </Text>
          </View>
        </View>

        {isDelivery && item.collectingRestaurant ?
          <View style={styles.restaurantContainer}>
            <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '500' }}>
              Restaurant: <Text style={{ fontSize: 16, paddingLeft: 20, fontWeight: '400' }}>
                {item.collectingRestaurant.name}
              </Text>
            </Text>
            <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '500', marginTop: 10 }}>
              Address: <Text style={{ fontSize: 16, paddingLeft: 20, fontWeight: '400' }}>
                {item.collectingRestaurant.address}
              </Text>
            </Text>
            {
              item.collectingRestaurant.addressDetails.length > 0 ?
                <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '500', marginTop: 10 }}>
                  Address Details: <Text style={{ fontSize: 16, paddingRight: 20, paddingLeft: 20, fontWeight: '400' }}>
                    {item.collectingRestaurant.addressDetails}
                  </Text>
                </Text> : null
            }
          </View> : null}

        {!isDelivery && item.deliveringRestaurant ?
          <View style={styles.restaurantContainer}>
            <View style={{ position: 'relative', marginRight: 40 }}>
              <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '500' }}>
                Restaurant: <Text style={{ fontSize: 16, fontWeight: '400' }}>
                  {item.deliveringRestaurant.name} </Text>
              </Text>
              <TouchableOpacity
                style={{ padding: 10, position: 'absolute', top: 5, right: -35 }}
                onPress={() => {
                  if (Platform.OS === 'android') {
                    Linking.openURL(
                      `tel:${item.deliveringRestaurant.phone}`
                    );
                  }
                  else {
                    const url = `telprompt:${item.deliveringRestaurant.phone}`;
                    Linking.canOpenURL(url).then((supported) => {
                      if (supported) {
                        return Linking.openURL(url)
                          .catch(() => null);
                      }
                    });
                  }
                }}
              >
                <Icon name="phone-call" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '500', marginTop: 10 }}>
              Address: <Text style={{ fontSize: 16, paddingLeft: 20, fontWeight: '400' }}>
                {item.deliveringRestaurant.address}
              </Text>
            </Text>
            {
              item.deliveringRestaurant.addressDetails.length > 0 ?
                <Text style={{ textAlign: 'left', fontSize: 16, fontWeight: '500', marginTop: 10 }}>
                  Address Details: <Text style={{ fontSize: 16, paddingRight: 20, paddingLeft: 20, fontWeight: '400' }}>
                    {item.deliveringRestaurant.addressDetails}
                  </Text>
                </Text> : null
            }

          </View> : null}
        <View style={styles.actionContainer}>
          <Button
            title={'Call Customer'}
            onPress={() => {
              if (Platform.OS === 'android') {
                Linking.openURL(`tel:${item.user.phone}`);
              }
              else {
                const url = `telprompt:${item.user.phone}`;
                Linking.canOpenURL(url)
                  .then((supported) => {
                    if (supported) {
                      return Linking.openURL(url)
                        .catch(() => null);
                    }
                  });
              }
            }}
            style={[styles.button, {
              backgroundColor: '#00a0ff',
            }]}
            textStyle={{ color: '#fff', fontSize: 14, fontWeight: '400', }}
          />
          <Button
            title={'View Details'}
            onPress={() => {
              const { navigation, navScreen, userRes } = this.props;
              navigation.navigate('ResturantOrderDetailsScreen', {
                userRes: userRes,
                details: item,
                dineIn: this.props.isCollecting || false,
                navScreen: navScreen,
              });
            }}
            style={[styles.button, {
              borderWidth: 1,
              borderColor: '#00a0ff',
              backgroundColor: '#fff',
            }]}
            textStyle={{ color: '#00a0ff', fontSize: 14, fontWeight: '400', }}
          />
        </View>
      </View>
    )
  }
  render() {
    const { list, isDelivery } = this.props;  
    return (
      <View style={[styles.scene]}>
        {list && list.length ?
          <ScrollView
            contentContainerStyle={{ paddingBottom: 15 }}
            refreshControl={
              <RefreshControl
                onRefresh={() => this.props.fetchList()}
                progressBackgroundColor='#FFFFFF'
                tintColor="#1BA2FC"
                colors={["#1BA2FC", "#1BA2FC"]}
              />
            }
          >
            <FlatList
              data={list}
              initialNumToRender={list.length}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              // renderItem={this.renderOrderCard}
              renderItem={({ item, index }) => 
                isDelivery ?
                  item.currentOrderStep !== '0' ? 
                    this.renderOrderCard(item,index) : null 
                  : this.renderOrderCard(item,index)
              }
            />
          </ScrollView> :
          <ScrollView
            contentContainerStyle={{ paddingBottom: 15, justifyContent: 'center', flex: 1 }}
            refreshControl={
              <RefreshControl
                onRefresh={() => this.props.fetchList()}
                progressBackgroundColor='#FFFFFF'
                tintColor="#1BA2FC"
                colors={["#1BA2FC", "#1BA2FC"]}
              />
            }
          >
            <View style={styles.message}>
              <Text style={[styles.title, { fontWeight: '400' }]}>
                Don't have any order yet.
              </Text>
            </View>
          </ScrollView>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    flex: 1,
    marginTop: 15,
    marginHorizontal: 15,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  orderCardContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#d9f1ff',
    justifyContent: 'space-between',
  },
  restaurantContainer: {
    flex: 1,
    width: '100%',
    paddingBottom: 10,
    backgroundColor: '#d9f1ff',
    paddingLeft: 15,
    paddingRight: 15

  },
  detailsContainer: {
    flex: .58,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    paddingLeft: 12,
    paddingRight: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    flex: 1,
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#636363',
  },
  userName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  userContact: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5e5a5a',
    marginTop: 2,
    lineHeight: 20,
  },
  orderDetails: {
    flex: .42,
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  userInfo: {
    fontSize: 14,
    fontWeight: '400',
    color: '#5e5a5a',
    textAlign: 'right',
    lineHeight: 20,
  },
  actionContainer: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  detContainer: {
    width: '100%',
    paddingVertical: 3,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  button: {
    height: 40,
    width: '42%',
    marginHorizontal: 6,
    borderRadius: 50,
    textAlign: 'center',
  },
  scene: {
    flex: 1,
    backgroundColor: '#e4e4e4',
  },
  message: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000'
  },
  bannerText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  bannerMessage: {
    top: 10,
    right: 15,
    padding: 3,
    paddingHorizontal: 3,
    paddingVertical: 0,
    borderRadius: 5,
    position: 'absolute',
    backgroundColor: '#00a0ff',
  }
});


export default OrdersContainer;