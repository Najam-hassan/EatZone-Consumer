import { connect } from 'react-redux';
import React, { Component } from 'react';
import { guid } from '../../utils/misc';
import { Text, View, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import * as actions from '../../actions/user-actions/resturant-detail-actions';

import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class RestaurantDetail extends Component {

  _renderItem = ({ item, index }) => (
    <View key={index} style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
      <Text style={[styles.title, styles.category, { marginVertical: 5 }]}>{item}</Text>
      {this.props.data.map(row => {
        if (item === row.name) {
          return row.menu_items.map(item => (
            <TouchableOpacity
              key={guid()}
              activeOpacity={0.7}
              onPress={() => {
                this.props.navigation.navigate(
                  'ItemDetailScreen', {
                    list: this.props.data,
                    catId: row.id,
                    item: item,
                  })
              }}
            >
              <View style={styles.itemStyling}>
                <Image source={{ uri: item.imageUrl }} style={{ width: 70, height: 70, borderRadius: 10 }} />
                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 15, }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <View style={{ flex:1, }} >
                      <Text style={styles.title}>{item.name}</Text>
                    </View>
                    <View style={{ flex:0.3, alignItems:'flex-end',}} >
                      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                    </View>
                  </View>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 4,
                  }}>
                    <Text style={styles.description} numberOfLines={3}>
                      {item.description}
                    </Text>
                    <View style={[styles.stockStyle]}>
                      <Button
                        buttonStyle={{
                          margin: 0, padding: 0, color: '#fff', height: 24, width: 24, borderRadius: 24
                        }}
                        icon={
                          <Icon
                            name="minus"
                            size={15}
                            color="#fff"
                          />
                        }
                        onPress={() => {
                          this.subtractQuantity(row.id, item.id, item.quantity, item.price);
                        }}
                      />
                      {/* <TouchableOpacity style={{ backgroundColor: '#00a0ff', height: 24, width: 24, borderRadius: 24, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                          this.subtractQuantity(row.id, item.id, item.quantity);
                          this.props.subtractFromTotal(item.price);
                        }}>
                        <Text style={styles.blueBtn}> - </Text>
                      </TouchableOpacity> */}
                      <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
                      <Button
                        buttonStyle={{
                          margin: 0, padding: 0, color: '#fff', height: 24, width: 24, borderRadius: 24
                        }}
                        icon={
                          <Icon
                            name="plus"
                            size={15}
                            color="#fff"
                          />
                        }
                        onPress={() => {
                          this.addQuantity(row.id, item.id);
                          this.props.addToTotal(item.price);
                        }}
                      />
                      {/* <TouchableOpacity
                        style={{ backgroundColor: '#00a0ff', height: 24, width: 24, borderRadius: 24, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                          this.addQuantity(row.id, item.id);
                          this.props.addToTotal(item.price);
                        }}
                      >
                        <Text style={styles.blueBtn}> + </Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        }
      })}
    </View>
  );

  addQuantity (categoryId, itemId) {
    let categoryIndex = this.props.data.findIndex(e => e.id === categoryId);
    if (categoryIndex >= 0) {
      let itemIndex = this.props.data[categoryIndex].menu_items.findIndex(e => e.id === itemId);
      if (itemIndex >= 0) {
        this.props.data[categoryIndex].menu_items[itemIndex].quantity++;
      }
    }
    this.props.addItemQuantity(this.props.data);
  }
  subtractQuantity (categoryId, itemId, quantity, price) {
    if (quantity > 0) {
      this.props.subtractFromTotal(price);
      let categoryIndex = this.props.data.findIndex(e => e.id === categoryId);
      if (categoryIndex >= 0) {
        let itemIndex = this.props.data[categoryIndex].menu_items.findIndex(e => e.id === itemId);
        if (
          itemIndex >= 0 &&
          this.props.data[categoryIndex].menu_items[itemIndex].quantity > 0
        ) {
          this.props.data[categoryIndex].menu_items[itemIndex].quantity--;
        }
      }
      this.props.addItemQuantity(this.props.data);
    }
  }

  render () {
    const { list } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {list && list.length ?
          <FlatList
            extraData={this.state}
            data={list.filter(row => row)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem}
          /> : <View style={{
            flex: .5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text>No data Found</Text>
          </View>
        }
      </View >
    )
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    addItemQuantity: data => {
      dispatch(actions.addQuantityToItem(data));
      dispatch(actions.addItemToCard(data));
    },
  }
}

const styles = StyleSheet.create({
  itemStyling: {
    flex: 1,
    marginVertical: 7.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000'
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000'
  },
  description: {
    fontSize: 13,
    fontWeight: '300',
    color: '#cccccc',
    flexWrap: 'wrap',
    flex: 0.65,
  },
  category: {
    fontWeight: '700'
  },
  stockStyle: {
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    // flex: 0.35,
    backgroundColor: '#f7f8fa',
    height: 24,
    justifyContent: 'space-between',
  },
  blueBtn: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center'
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestaurantDetail)
