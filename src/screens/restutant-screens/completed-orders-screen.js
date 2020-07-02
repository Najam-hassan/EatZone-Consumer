import { connect } from 'react-redux';
import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import { View, StatusBar, ActivityIndicator, BackHandler, AsyncStorage } from 'react-native';

import { Header } from '../../components/common/header';

import * as actions from '../../actions/restaurant-actions/order-listing-actions';
import * as selectors from '../../selectors/restaurant-selectors/order-list-selectors';

import OrdersContainer from '../../containers/restaurant-containers/my-orders-container';

class CompletedOrdersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null }
    //Binding handleBackButtonClick function with this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  async componentDidMount() {
    this.props.fetchList();
    await this._retrieveData()
  }

  componentWillMount() {
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
        console.log('userRes====>>>>',JSON.parse(value));
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  render() {
    const { loading, deliveries } = this.props;
    if (loading) {
      return (
        <View style={{ flex: 1, backgroundColor: '#e4e4e4' }}>
          <StatusBar hidden={false} />
          <Header
            navigation={this.props.navigation}
            title={'Completed Orders'}
          />
          <ActivityIndicator size={'large'} color={'#1BA2FC'} />
        </View>
      )
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#e4e4e4' }}>
        <StatusBar hidden={false} />
        <Header
          navigation={this.props.navigation}
          title={'Completed Orders'}
        />
        <NavigationEvents
          onWillFocus={payload => {
            this.props.fetchList();
          }}
        />
        <OrdersContainer
          navScreen="CompletedOrdersScreen"
          isDelivery={true}
          isCollecting={true}
          userRes= {this.state.user}
          navigation={this.props.navigation}
          fetchList={() => this.props.fetchList()}
          list={deliveries && deliveries.filter(row => (
            row.orderStatus === 'COMPLETED' || row.orderStatus === 'CANCELLED'
          ))}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  deliveries: selectors.makeSelectDeliveryOrderList()(state),
  loading: selectors.makeSelectOrderListLoading()(state),
  error: selectors.makeSelectOrderListError()(state),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchList: () => dispatch(actions.fetchOrdersAction()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedOrdersScreen); 