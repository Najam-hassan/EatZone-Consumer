import React, { Component } from 'react';
import { View, BackHandler, StatusBar } from 'react-native';

import MenuItemForm from '../forms/menu-item-form';
import { PageHeader } from '../../components/common/header';

class AddMenuItemScreen extends Component {
  constructor(props) {
    super(props);

    //Binding handleBackButtonClick function with this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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

  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={false} />
        <PageHeader
          navigation={this.props.navigation}
          title={'Add Menu Item'}
        />
        <View style={{ flex: 1 }}>
          <MenuItemForm
            categoryId={params.catId}
            navigation={this.props.navigation}
            itemId={params ? params.itemId : null}
            imageUrl={params ? params.imageUrl : null}
          />
        </View>
      </View>
    )
  }
}

export default AddMenuItemScreen 