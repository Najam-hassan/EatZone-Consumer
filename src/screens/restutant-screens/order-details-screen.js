import moment from 'moment';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  View, Text, StatusBar, StyleSheet, Platform,
  Image, ActivityIndicator, BackHandler, Linking, ScrollView, AsyncStorage
} from 'react-native';

import Button from '../../components/common/button';
import { OrderDetailHeader } from '../../components/common/header';
import { AppText } from '../../components/common/typography';

import { calculateCostSub2, serviceCharges, subTotalForOrders } from '../../utils/misc';

import FoodModal from '../../components/food-modal';
import * as actions from '../../actions/restaurant-actions/order-listing-actions';
import * as selectors from '../../selectors/restaurant-selectors/order-list-selectors';
import * as authSelectors from '../../selectors/auth-selectors';

class OrderDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { subTotal: 0, confirmed: false, completed: false, showModal: false, user: null, isCanceled: false }
    // console.log('params: ', props.navigation.state.params, 'sss', this.props.orders, 'UserData', this.state.auth);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  async componentWillMount() {
    await this._retrieveData()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('HomeScreen');
    return true;
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userRes');
      if (value !== null) {
        // We have data!!
        await this.setState({ user: JSON.parse(value) })
        // console.log('userRes====>>>>', JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params.details.orderItinerary !== null) {
      const subTotal = params.details.orderItinerary.items.reduce((sum, item) => (
        sum + (item.itemQuantity * item.itemPrice)
      ), 0);
      this.setState({ subTotal: subTotal })
    }
    if (!params.dineIn) {
      if (params.details) {
        if (params.details.orderStatus === 'PENDING') {
          this.setState({ confirmed: true });
        } else if (params.details && params.details.orderStatus === 'CONFIRMED') {
          this.setState({ completed: true })
        }
      }
    }
  }

  componentWillReceiveProps(nextProps, prevProps) {
    const { params } = this.props.navigation.state;
    if (params.details.orderStatus === 'PENDING') {
      this.props.navigation.state.params.dineIn = false;
    }
    if (!params.dineIn) {
      if (nextProps.confirmed && !nextProps.canceled) {
        this.props.navigation.state.params.details.orderStatus = 'CONFIRMED';
        if (!this.state.completed) {
          this.setState({
            completed: true,
            confirmed: false,
            showModal: true
          });
        }
        // this.props.resetState();
      } else {
        //new added
        this.props.navigation.state.params.details.orderStatus = 'CANCELED';
        if (!this.state.completed) {
          this.setState({
            completed: false,
            confirmed: false,
            showModal: true
          });
        }
      }
      if (nextProps.completed ) {
        console.log('naviggggggg: ', nextProps);
        this.props.resetState();
        this.props.navigation.replace('CompletedOrdersScreen');
      } else {
        if ( nextProps.canceled ) {
          // console.log('naviggggggg: ', nextProps);
          this.props.resetState();
          if (!params.dineIn) {
            this.props.navigation.replace('RecentOrdersScreen',{nextProps: nextProps, dineIn :params.dineIn });
          } else {
            this.props.navigation.replace('CompletedOrdersScreen');
          }
        }
      }
    }

  }

  renderOrderItems = (item, index) => {
    return (
      <View key={`menu-item-${index}`} style={styles.orderItemContent}>
        <View
          key={item.id}
          style={styles.orderItemContainer}
        >
          <AppText style={styles.orderDescrip}>{item && item.itemName || ''} </AppText>
          <AppText style={styles.orderQuantity}>Qty: {item && item.itemQuantity || ''} </AppText>
          <AppText style={styles.orderPrice}>${item && item.itemPrice.toFixed(2) || ''} </AppText>
        </View>
      </View>
    )
  }
  renderSubTotals = () => {
    const { details } = this.props.navigation.state.params;
    // console.log('details=============>>>>>',details);
    return (
      <View style={styles.subTotalOrder}>
        <View style={styles.innerViewStyle}>
          <Text style={{ color: '#cccccc', fontWeight: '400' }}>SubTotal</Text>
          <View style={styles.priceStyle}>
            <Text style={{ color: '#cccccc', fontWeight: '400', }}>
              ${subTotalForOrders(details.orderItinerary).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.innerViewStyle}>
          <Text style={{ color: '#cccccc', fontWeight: '400' }}>Taxes</Text>
          <View style={styles.priceStyle}>
            <Text style={{ color: '#cccccc', fontWeight: '400' }}>
              {/* {details.deliveringRestaurant.taxRate}% */}
              {details.deliveringRestaurant.taxRate ?
                <Text>${(subTotalForOrders(details.orderItinerary) * serviceCharges(details.deliveringRestaurant.taxRate)).toFixed(2)}</Text>
                : <Text>($0)</Text>}
            </Text>
          </View>
        </View>
        <View style={styles.innerViewStyle}>
          <Text style={{ color: '#cccccc', fontWeight: '400' }}>Dine-in Service Charges</Text>
          <View style={styles.priceStyle}>
            <Text style={{ color: '#cccccc', fontWeight: '400' }}>
              {details.orderItinerary.collectingServiceCharge}%
              {details.orderItinerary.collectingServiceCharge ?
                <Text>(${(subTotalForOrders(details.orderItinerary) * serviceCharges(details.orderItinerary.collectingServiceCharge)).toFixed(2)})</Text>
                :
                <Text>($0)</Text>
              }
            </Text>
          </View>
        </View>
      </View>
    )
  }


  renderOrderCard = () => {
    const { params } = this.props.navigation.state;
    const pendingNotification = params.details ?
      params.details.orderStatus === 'PENDING' ? 'show' : 'hide'
      : false;
    const { completed, confirmed, user } = this.state
    const { loading, auth } = this.props;
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.orderCardContainer}>
            <View style={styles.detailsContainer}>
              {params && params.details.user.avatarUrl ?
                <Image
                  source={{ uri: params.details.user.avatarUrl }}
                  style={{ height: 60, width: 60, borderRadius: 30 }}
                /> :
                <Image
                  source={require('../../assets/images/account.png')}
                  style={{ height: 60, width: 60, borderRadius: 30 }}
                />}
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{params.details.user.name}</Text>
                <Text style={styles.userContact}>{moment(params.details.createdAt).format("ddd, LT")}</Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.userInfo}>Order Id: {params.details.id}</Text>
            </View>
          </View>
          <View style={[styles.orderContent]}>
            <View style={styles.orderDetail}>
              <Text style={styles.titleText}>Order Details</Text>
              <View styles={{ flexDirection: 'column' }}>
                <View style={styles.orderItemContainer}>
                  <Text style={[styles.orderDescrip, { color: "#cccccc" }]}>
                    Name
                    </Text>
                  <Text style={[styles.orderPrice, { color: "#cccccc" }]}>
                    Unit Price
                    </Text>
                  <Text style={[styles.orderQuantity, { color: "#cccccc" }]}>
                    Qty
                    </Text>
                </View>
                {params && params.details.orderItinerary.items.map((item, index) => (
                  <View key={item + index} style={styles.orderItemContainer}>
                    <Text style={styles.orderDescrip}>
                      {item.itemName}
                    </Text>
                    <Text style={styles.orderPrice}>
                      ${item.itemPrice.toFixed(2)}
                    </Text>
                    <Text style={styles.orderQuantity}>
                      {item.itemQuantity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            {this.renderSubTotals()}
            <View style={styles.orderTotal}>
              <Text style={styles.titleText}>Total</Text>
              <Text style={styles.titleText}> ${calculateCostSub2(params.details.orderItinerary.items, params.details.deliveringRestaurant.taxRate, params.details.orderItinerary.collectingServiceCharge)}
            </Text>
            </View>
            {
              params.userRes.id === params.details.deliveringRestaurant.id ?
                < View style={[styles.actionContainer, { paddingBottom: 0 }]} >
                  {
                    params.orderConfirmed ?
                      <Button
                        title={'Call Customer'}
                        onPress={() => {
                          if (Platform.OS === 'android') {
                            Linking.openURL(`tel:${params.details.user.phone}`);
                          }
                          else {
                            const url = `telprompt:${params.details.user.phone}`;
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
                        textStyle={{ color: '#fff', fontSize: 12, fontWeight: '400', }}
                      /> : null
                  }
                  {
                    (!params.dineIn && !params.orderConfirmed && confirmed) || pendingNotification === 'show' ?
                      <Button
                        title={'Cancel Order'}
                        onPress={async() => {
                          const { details } = params;
                          this.setState({ isCanceled: true })
                          await this.props.updateOrder(
                            `/restaurant/cancel-order/${details.id}`, 'canceled'
                          );
                        }}
                        style={[styles.button, {
                          borderWidth: 1,
                          borderColor: '#ff0000',
                          backgroundColor: '#fff',
                        }]}
                        textStyle={{ color: '#ff0000', fontSize: 14, fontWeight: '400', }}
                      /> : null
                  }
                  {
                    loading ?
                      <ActivityIndicator size={'large'} color={'#1BA2FC'} /> :
                      (!params.orderConfirmed && confirmed) || pendingNotification === 'show' ?
                        <Button
                          title={'Accept Order'}
                          onPress={async() => {
                            const { details } = params;
                            this.setState({ completed: false })
                            await this.props.updateOrder(
                              `/restaurant/confirm-order/${details.id}`, 'accepted'
                            );
                            await this.setState({ isCanceled: false })
                          }}
                          style={[styles.button, {
                            borderWidth: 1,
                            borderColor: '#17820c',
                            backgroundColor: '#fff',
                          }]}
                          textStyle={{ color: '#17820c', fontSize: 14, fontWeight: '400', }}
                        /> : null
                  }
                  {
                    !params.dineIn && !params.orderConfirmed && !loading && completed && params.details.orderStatus === "CONFIRMED" ?
                      <Button
                        title={'Complete Order'}
                        onPress={async() => {
                          const { details } = params;
                          await this.props.updateOrder(
                            `/restaurant/complete-order/${details.id}`, 'completed'
                          );
                        }}
                        style={[styles.button, {
                          width: '40%',
                          borderWidth: 1,
                          borderColor: '#17820c',
                          backgroundColor: '#fff',
                        }]}
                        textStyle={{ color: '#17820c', fontSize: 14, fontWeight: '400', }}
                      /> : null
                  }
                </View >
                :
                < View style={[styles.actionContainer, { paddingBottom: 0 }]} >
                  {
                    loading || params.details.currentOrderStep === '1'  ?
                      null :
                    (!params.dineIn && !params.orderConfirmed && confirmed) || pendingNotification === 'show' ?
                      <Button
                        title={'Cancel Order'}
                        onPress={async() => {
                          const { details } = params;
                          await this.setState({ isCanceled: true })
                          await this.props.updateOrder(
                            `/restaurant/cancel-order/${details.id}`, 'canceled'
                          );
                          console.warn('isCanceled',this.state.isCanceled);
                          
                        }}
                        style={[styles.button, {
                          borderWidth: 1,
                          borderColor: '#ff0000',
                          backgroundColor: '#fff',
                        }]}
                        textStyle={{ color: '#ff0000', fontSize: 14, fontWeight: '400', }}
                      /> : null
                  }
                  {
                    params.details.currentOrderStep !== '1'?
                      loading ?
                        <ActivityIndicator size={'large'} color={'#1BA2FC'} /> :
                        (!params.orderConfirmed && confirmed) || pendingNotification === 'show' ?
                          <Button
                            title={'Accept Order'}
                            onPress={async() => {
                              const { details } = params;
                              this.setState({ completed: false })
                              await this.props.updateOrder(
                                `/restaurant/confirm-order/${details.id}`, 'accepted'
                              );
                              await this.setState({ isCanceled: false })
                            }}
                            style={[styles.button, {
                              borderWidth: 1,
                              borderColor: '#17820c',
                              backgroundColor: '#fff',
                            }]}
                            textStyle={{ color: '#17820c', fontSize: 14, fontWeight: '400', }}
                          /> : null
                          : null
                  }
                  {
                     params.details.currentOrderStep === '1' ?
                      <Button
                        title={'Order Accepted!'}
                        // onPress={() => {
                        //   const { details } = params;
                        //   this.props.updateOrder(
                        //     `/restaurant/complete-order/${details.id}`, 'completed'
                        //   );
                        // }}
                        style={[styles.button, {
                          width: '40%',
                          borderWidth: 1,
                          borderColor: '#17820c',
                          backgroundColor: '#fff',
                        }]}
                        textStyle={{ color: '#17820c', fontSize: 14, fontWeight: '400', }}
                      /> : null
                  }
                </View >
            }

          </View >
        </View>
      </ScrollView>
    )
  }

  render() {
    const { params } = this.props.navigation.state;
    // console.log('paramsss=====>>>>>',params);
    
    return (
      <View style={{ flex: 1, backgroundColor: '#e4e4e4' }}>
        <StatusBar hidden={false} />
        <OrderDetailHeader
          isNotif={params.isNotif}
          navScreen={params.navScreen}
          navNotif={this.handleBackButtonClick}
          navigation={this.props.navigation}
          title={'Order Details'}
        />
        <NavigationEvents
          onWillFocus={(payload) => {
            const { params } = this.props.navigation;
            console.log(params, 'params');
            console.log(payload, '-=-=-=-=-=-=');
          }}
        />
        {
          this.renderOrderCard()
        }
        {this.state.showModal ?
          <FoodModal
            showModal={true}
            heading={this.state.isCanceled ? "Order Canceled" : "Order Accepted"}
            body={params.details? 
                    params.details.currentOrderStep === '0' && this.state.isCanceled === false ? 
                      "Please take the food from Ordering Restaurant and serve to your dine-in customer."
                      :
                      params.details.currentOrderStep === '1' && this.state.isCanceled === false ?
                        "Please start preparing the order."
                        : 
                        params.details.currentOrderStep === '0' || '1' && this.state.isCanceled ?
                          "Your Order is canceled."
                          : null
                    : null  
                  }
            closeModal={() => {
              this.setState({ showModal: false });
            }}
          /> : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15
  },
  orderContent: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  orderNo: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e1e7',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  orderDetail: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e1e7',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  orderTotal: {
    paddingVertical: 15,
    paddingBottom: 0,
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    marginBottom: 7,
  },
  descripText: {
    fontSize: 14,
    color: '#cccccc',
    fontWeight: '300'
  },
  itemDetailsStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  subTotalOrder: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#e2e1e7',
  },
  innerViewStyle: {
    marginVertical: 3,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceStyle: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
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
  detailsContainer: {
    flex: .65,
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
    flex: .35,
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
    paddingTop: 18,
    paddingHorizontal: 15,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  button: {
    height: 40,
    width: '42%',
    borderRadius: 50,
    marginHorizontal: 6,
    textAlign: 'center',
  },
  orderItemContent: {
    paddingHorizontal: 15,
    marginTop: 12,
  },
  orderItemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDescrip: {
    color: '#cccccc',
    fontSize: 15,
    fontWeight: '300',
    flex: 0.25,
    flexWrap: 'wrap',
  },
  orderQuantity: {
    color: '#cccccc',
    fontSize: 15,
    fontWeight: '300',
    flex: 0.25,
    flexWrap: 'wrap',
    textAlign: 'right',
    paddingRight: 5,
    paddingLeft: 5,
  },
  orderPrice: {
    color: '#cccccc',
    fontSize: 15,
    fontWeight: '300',
    flex: 0.25,
    textAlign: 'right',
    flexWrap: 'nowrap',
  },
});

const mapStateToProps = state => ({
  loading: selectors.makeSelectOrderLoading()(state),
  confirmed: selectors.makeSelectConfirmed()(state),
  completed: selectors.makeSelectCompleted()(state),
  canceled: selectors.makeSelectCanceled()(state),
  orders: selectors.makeSelectGetOrders()(state),
  auth: authSelectors.makeSelectData()(state)
});

const mapDispatchToProps = dispatch => {
  return {
    updateOrder: (url, orderStatus) => {
      dispatch(actions.updateOrderStatusAction(url, orderStatus));
      // dispatch(actions.updateLocally(type));
    },
    resetState: () => dispatch(actions.resetOrderState())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetailsScreen); 