import React, { Component } from 'react';
import { View, Text, StatusBar, StyleSheet, Image, BackHandler } from 'react-native';

import { PageHeader } from '../../components/common/header';
import ItemDetailContainer from '../../containers/user-containers/item-details-container'

class ItemDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { subTotal: 0, showModal: false }

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
          title={'Item Details'}
        />
        {params.item ? <View style={{ flex: 1 }}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: params.item.imageUrl }} style={styles.bannerStyle} />
          </View>
          <View style={styles.dataContainer}>
            <ItemDetailContainer
              data={params.list}
              catId={params.catId}
              detail={params.item}
              navigation={this.props.navigation}
            />
          </View>
        </View> :
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Details not available</Text>
          </View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 0.4,
    marginBottom: -15,
  },
  bannerStyle: {
    width: '100%',
    height: '100%',
  },
  dataContainer: {
    flex: 0.6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  }
})

export default ItemDetailScreen