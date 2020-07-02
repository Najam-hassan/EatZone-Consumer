import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import ButtonCom from '../../components/common/button';
import * as actions from '../../actions/user-actions/resturant-detail-actions';

import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class ItemDetailsContainer extends Component {
  state = { value: null, quantity: 0 }

  componentDidMount() {
    const { detail } = this.props;
    if (detail) {
      this.setState({ quantity: detail.quantity && detail.quantity || 0 })
    }
  }

  addQuantity(itemId) {
    const { catId } = this.props;
    let categoryIndex = this.props.data.findIndex(e => e.id === catId);
    if (categoryIndex >= 0) {
      let itemIndex = this.props.data[categoryIndex].menu_items.findIndex(e => e.id === itemId);
      if (itemIndex >= 0) {
        this.props.data[categoryIndex].menu_items[itemIndex].quantity++;
        this.setState({ quantity: this.state.quantity + 1 });
      }
    }
    this.props.addItemQuantity(this.props.data);
  }

  subtractQuantity(itemId, quantity) {
    const { catId } = this.props;
    if (quantity > 0 && catId) {
      let categoryIndex = this.props.data.findIndex(e => e.id === catId);
      if (categoryIndex >= 0) {
        let itemIndex = this.props.data[categoryIndex].menu_items.findIndex(e => e.id === itemId);
        if (
          itemIndex >= 0 &&
          this.props.data[categoryIndex].menu_items[itemIndex].quantity > 0
        ) {
          this.props.data[categoryIndex].menu_items[itemIndex].quantity--;
          this.setState({ quantity: this.state.quantity - 1 });
        }
      }
      this.props.addItemQuantity(this.props.data);
    }
  }

  render() {
    const { detail, navigation } = this.props;
    const { quantity } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.headerText}>{detail.name ? detail.name : 'Some Name'}</Text>
            <Text style={styles.headerPrice}>${detail.price ? (detail.price).toFixed(2) : 0}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.headerDescrip}>
              {detail.description}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.fixedBottom}>
          <View style={styles.fixedLeft}>
            <View style={styles.stockStyle}>
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
                  this.subtractQuantity(detail.id, detail.quantity)
                }}
              />
              <Text style={{ marginHorizontal: 10 }}>{quantity}</Text>
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
                  this.addQuantity(detail.id)
                }}
              />
            </View>
          </View>
          <View style={styles.fixedRight}>
            <ButtonCom
              title="View Cart"
              onPress={() => {
                navigation.navigate('ItemCartScreen');
              }}
              disabled={quantity <= 0}
              style={styles.button}
              textStyle={{ fontSize: 12 }}
            />
          </View>
        </View>
      </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginVertical: 20,
  },
  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    flex: 0.8,
  },
  headerPrice: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    flex: 0.2,
    textAlign: 'right',
  },
  headerDescrip: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ccc',
    marginBottom: 2,
  },
  divider: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#c6c3d0',
  },
  softContainer: {
  },
  selectionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  stockStyle: {
    width: 80,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  blueBtn: {
    backgroundColor: '#00a0ff',
    height: 24,
    width: 24,
    borderRadius: 24,
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 24
  },
  fixedBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7f8fa',
  },
  button: {
    height: 36,
    width: 200,
    color: '#fff',
    borderWidth: 1,
    borderRadius: 50,
    marginVertical: -5,
    fontSize: 12,
    textAlign: 'center',
    borderColor: '#fff',
    backgroundColor: '#1BA2FC',
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetailsContainer)