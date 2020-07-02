import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, StatusBar, BackHandler } from 'react-native';

import { Header } from '../../components/common/header';
import * as actions from '../../actions/user-actions/nearby-restaurants-actions';
import { makeSelectCollectingResturant } from '../../selectors/user-selectors/home-selectors';
import NearByRestaurant from '../../containers/user-containers/nearby-restaurents-container'

class RestaurantsScreen extends Component {
  constructor(props) {
    super(props);

    //Binding handleBackButtonClick function with this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    const { resturant, fetchNearByList } = this.props;
    if (resturant) {
      fetchNearByList(resturant.id);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('HomeScreen');
    return true;
  }

  render() {
    return (
      <View style={{ flex: 1, }}>
        <StatusBar hidden={false} />
        <Header
          navigation={this.props.navigation}
          title={'Restaurants Nearby'}
        />
        <NearByRestaurant
          navigateTo={(item) => {
            this.props.navigation.navigate(
              'RestaurantDetailScreen', {
                restaurantId: item.id,
                name: item.name
              }
            )
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  resturant: makeSelectCollectingResturant()(state),
})

const mapDispatchToProps = dispatch => {
  return {
    fetchNearByList: (id) => dispatch(actions.fetchNearByListAction(id)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestaurantsScreen)
