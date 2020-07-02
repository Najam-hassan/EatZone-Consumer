import moment from 'moment';
import { connect } from 'react-redux';
import React, { Component,PureComponent } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  View, Text, StatusBar, TouchableOpacity, StyleSheet, RefreshControl, BackHandler,
  Linking, ActivityIndicator, FlatList, Platform, ScrollView, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { height } = Dimensions.get('screen');

import { Header } from '../../components/common/header';
import * as actions from '../../actions/user-actions/order-list-actions';
import * as selectors from '../../selectors/user-selectors/order-list-selectors';
let offset = 1
class OrderScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { subTotal: 0 ,offset :1}

    //Binding handleBackButtonClick function with this
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    this.props.fetchList(0);
    offset = offset + 1
  }
  componentWillReceiveProps(nextProps){
    if(this.props.navigation != nextProps.navigation)
    {
      this.refresher()
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('HomeScreen');
    return true;
  }

  renderOrderCard = ({ item, index }) => {
    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          key={index}
          onPress={() => {
            const { navigation } = this.props;
            navigation.navigate('OrderDetailScreen', {
              details: item
            })
          }}
        >
          <View style={styles.itemContentsHead}>
            <Text style={styles.hotelName}>
              {item.deliveringRestaurant ? item.deliveringRestaurant.name : ""}
            </Text>
            <View style={styles.orderStatus}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Text style={{ color: '#222222', fontSize: 13, fontWeight: '400', }}>Status: </Text>
                <View style={[styles.statueText, {
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
                  <Text style={{ color:'#fff', fontSize: 12, }}>
                    {item.orderStatus}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.contentMain}>
            <Text style={{ color: '#000000', fontSize: 14, fontWeight: '400', }}>
              Order Date: {moment(item.createdAt).format("LLL")}
            </Text>
            <View style={styles.orderFind} ref={this.setPhoneIconRef}>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === 'android') {
                    Linking.openURL(
                      `tel:${item.deliveringRestaurant ? item.deliveringRestaurant.phone : 123}`
                    );
                  }
                  else {
                    const url = `telprompt:${item.deliveringRestaurant ? item.deliveringRestaurant.phone : 123}`;
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
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  handleLoadMore = () => {
// alert('called')
    if(this.props.list.length > 0){
      let pagination = (offset - 1)*10
      this.props.fetchList(pagination);
      offset = offset + 1
    }
  };
  refresher = () =>{
    offset = 1
    this.props.resetOrder()
    this.props.fetchList(0);
    offset = offset + 1

  }
  render() {
    const { loading, list } = this.props;
    console.log("showing lists after notifiy ",this.props)

    return (
      <View style={{ flex: 1, backgroundColor: '#e4e4e4' }}>
        <StatusBar hidden={false} />
        <Header
          navigation={this.props.navigation}
          title={'My Orders'}
        />
        <NavigationEvents
          onWillFocus={payload => {
            // this.props.fetchList(this.state.offset);
          }}
        />
        {/* {loading ?
          <View style={[styles.contentCentered, { height: height - 50 }]}>
            <ActivityIndicator
              size={'large'}
              color={'#1BA2FC'}
            />
          </View> : list && list.length ?
            // <ScrollView
            //   refreshControl={
            //     <RefreshControl
            //       refreshing={false}
            //       onRefresh={() => this.props.fetchList()}
            //       progressBackgroundColor='#FFFFFF'
            //       tintColor="#1BA2FC"
            //       colors={["#1BA2FC", "#1BA2FC"]}
            //     />
            //   }
            // >
            //   <FlatList
            //     data={list}
            //     extraData={this.props.list}
            //     keyExtractor={(item, index) => index.toString()}
            //     renderItem={this.renderOrderCard}
            //     onEndReached={()=>this.handleLoadMore()}
            //     onEndReachedThreshold = {0.1}

            //   />
            // </ScrollView> :
            // <ScrollView
            //   contentContainerStyle={{ justifyContent: 'center', flex: 1 }}
            //   refreshControl={
            //     <RefreshControl
            //       refreshing={false}
            //       onRefresh={() => this.props.fetchList()}
            //       progressBackgroundColor='#FFFFFF'
            //       tintColor="#1BA2FC"
            //       colors={["#1BA2FC", "#1BA2FC"]}
            //     />
            //   }
            // >
            //   <View style={[styles.contentCentered]}>
            //     <Text style={{
            //       color: '#000000', fontSize: 16, fontWeight: '400', textAlign: 'center'
            //     }}>You haven't placed any order yet!!</Text>
            //   </View>
            // </ScrollView>
            
        } */}
        {
          list && list.length ?
          <FlatList
          contentContainerStyle ={{paddingBottom:50}}
          data={list}
          extraData={this.props.list}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderOrderCard}
          onEndReached={()=>this.handleLoadMore()}
          onEndReachedThreshold = {Platform.OS === 'ios' ? 0 :1}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={this.refresher}
                  progressBackgroundColor='#FFFFFF'
                  tintColor="#1BA2FC"
                  colors={["#1BA2FC", "#1BA2FC"]}
                />
              }

        />
         :
            <View style={[styles.contentCentered]}>
                <Text style={{
                  color: '#000000', fontSize: 16, fontWeight: '400', textAlign: 'center'
                }}>You haven't placed any order yet!!</Text>
              </View>

        }
       
              {/* {loading ?
          <View style={[styles.contentCentered, { height: height - 100,margin:20 }]}>
            <ActivityIndicator
              size={'large'}
              color={'#1BA2FC'}
            />
            </View>
            :null
            } */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
  },
  itemContentsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  hotelName: {
    flex: 0.5,
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
    fontWeight: '400'
  },
  orderStatus: {
    flex: .5,
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statueText: {
    marginLeft: 6,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 7,
    lineHeight: 18,
    backgroundColor: '#00a651',
    marginRight: -2,
  },
  contentMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  contentCentered: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  }
});

const mapStateToProps = state => ({
  list: selectors.makeSelectOrderList()(state),
  error: selectors.makeSelectOrderListError()(state),
  loading: selectors.makeSelectOrderListLoading()(state),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchList: (offset) => dispatch(actions.fetchOrdersAction(offset)),
    resetOrder: () => dispatch(actions.resetOrder()),

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderScreen);