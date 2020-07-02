import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet, BackHandler, ScrollView } from 'react-native';
import { calculateCostSub2, serviceCharges } from '../../utils/misc';
import { PageHeader } from '../../components/common/header';

class OrderDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { subTotal: 0 }

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const subTotal = params.details.orderItinerary.items.reduce((sum, item) => (
      sum + (item.itemQuantity * item.itemPrice)
    ), 0);
    this.setState({ subTotal: subTotal })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('HomeScreen');
    return true;
  }

  renderSubTotals = () => {
    const { details } = this.props.navigation.state.params;
    return (
      <View style={styles.subTotalOrder}>
        <View style={styles.innerViewStyle}>
          <Text style={{ color: '#cccccc', fontWeight: '400' }}>SubTotal</Text>
          <View style={styles.priceStyle}>
            <Text style={{ color: '#cccccc', fontWeight: '400', }}>
              ${this.state.subTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.innerViewStyle}>
          <Text style={{ color: '#cccccc', fontWeight: '400' }}>Taxes</Text>
          <View style={styles.priceStyle}>
            <Text style={{ color: '#cccccc', fontWeight: '400' }}>
              {/* {details.deliveringRestaurant.taxRate}% */}
              {details.deliveringRestaurant.taxRate ?
                <Text>${(this.state.subTotal * serviceCharges(details.deliveringRestaurant.taxRate)).toFixed(2)}</Text>
                : <Text>$0</Text>}
            </Text>
          </View>
        </View>
        <View style={styles.innerViewStyle}>
          <Text style={{ color: '#cccccc', fontWeight: '400' }}>Dine-in Service Charges</Text>
          <View style={styles.priceStyle}>
            <Text style={{ color: '#cccccc', fontWeight: '400' }}>
              {details.orderItinerary.collectingServiceCharge}%
              {details.orderItinerary.collectingServiceCharge ?
                <Text>(${(this.state.subTotal * serviceCharges(details.orderItinerary.collectingServiceCharge)).toFixed(2)})</Text>
                :
                <Text>($0)</Text>
              }
            </Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const { params } = this.props.navigation.state;
    const { subTotal } = this.state;
    console.log('collectingResturant============>>>>',params.details);
    return (

      <View style={{ flex: 1, backgroundColor: '#ebebeb', }}>
        <StatusBar hidden={false} />
        <PageHeader
          navigation={this.props.navigation}
          title={'Order Details'}
        />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.orderContent}>
              <View style={styles.orderNo}>
                <Text style={styles.titleText}>Order No: {params.details.id}</Text>
                <Text style={styles.descripText}>
                  Order Date: {moment(params.details.createdAt)
                    .format(("LLL"))}
                </Text>
              </View>
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
                  {params && params.details.orderItinerary.items.map(item => (
                    <View style={styles.orderItemContainer}>
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
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  orderContent: {
    marginVertical: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e1e7',
    borderRadius: 8,
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
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    marginBottom: 2,
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

export default OrderDetailScreen