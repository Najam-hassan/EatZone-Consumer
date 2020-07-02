import { connect } from 'react-redux';
import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
    View, StatusBar, ActivityIndicator, Dimensions, BackHandler, AsyncStorage, Text, StyleSheet, FlatList, ScrollView, RefreshControl
} from 'react-native';

import { Header } from '../../components/common/header';

import * as actions from '../../actions/restaurant-actions/payment-history-actions';
import * as selectors from '../../selectors/restaurant-selectors/payment-history-selectors';

class TransactionHistoryScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: 'first', title: 'My Orders' },
                { key: 'second', title: 'Dine In Orders' },
                { key: 'second', title: 'Dine In Orders' },
                { key: 'second', title: 'Dine In Orders' }
            ],
            user: null,
            refreshing: false
        };

        //Binding handleBackButtonClick function with this
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    async componentDidMount() {
        await AsyncStorage.getItem('userRes').then(value => {
            this.setState({ user: JSON.parse(value) })
            // console.log('user============>>>>', this.state.user);
        })
        await this.props.fetchList();
        // console.log('paymentData============>>>>', this.props.paymentData);
    }

    pullToRefresh = async() => await this.props.fetchList();

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

    RenderPaymentCard = (item) => {
        const { routes, user } = this.state;
        const { loading, paymentData } = this.props;
        return (
            <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <Text style={{ marginVertical: 15, fontSize: 12, color: 'gray', fontWeight: '500' }}>{item.item.date}</Text>
                    <Text style={{ marginVertical: 15, fontSize: 12, color: 'gray', fontWeight: '500' }}>Total: ${parseFloat((item.item.dailyEarnings).toFixed(2))}</Text>
                </View>
                <View style={{ backgroundColor: '#fff', borderRadius: 3, marginHorizontal: 10 }}>
                    <View style={{ marginVertical: 2 }}>
                        {
                            item.item.orders.map((item, key) => {
                                return (
                                    <View style={styles.historyItem}>
                                        <Text style={{ marginHorizontal: 10, fontSize: 12, color: '#00a0ff' }}>{
                                            user ?
                                                user.id === item.collectingRestaurant.id ?
                                                    'Dine-in'
                                                    :
                                                    'Ordering'
                                                : '...'
                                        }
                                        </Text>
                                        <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 12, color: 'black' }}>{item.id}</Text>
                                            <Text style={{ fontSize: 12, color: 'black' }}>
                                                {
                                                    user ?
                                                        user.id === item.collectingRestaurant.id ?
                                                            item.deliveringRestaurant.name
                                                            :
                                                            item.collectingRestaurant.name
                                                        : '...'
                                                }
                                            </Text>
                                            <Text style={{ fontSize: 12, color: 'black' }}>{
                                                user ?
                                                    user.id === item.collectingRestaurant.id ?
                                                        item.paidToDineIn ? 'Total: $'+(item.paidToDineIn / 100) : 'Payment failed'
                                                        :
                                                        item.paidToDelivery ? 'Total: $'+(item.paidToDelivery / 100) : 'Payment failed'
                                                    : null
                                            }</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { loading, paymentData } = this.props;
        if (loading) {
            return (

                <View style={{ flex: 1, backgroundColor: '#e4e4e4', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} color={'#1BA2FC'} />
                </View>
            )
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#e4e4e4', }}>
                <StatusBar hidden={false} />
                <Header
                    navigation={this.props.navigation}
                    title={'Payment History'}
                />
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 15 }}
                    refreshControl={
                        <RefreshControl
                          colors={['white']}
                          progressBackgroundColor={'white'}
                          tintColor={'#1BA2FC'}
                          refreshing={loading}
                          onRefresh={this.pullToRefresh}
                        />
                    }
                >
                    {
                        paymentData !== null ?
                            <FlatList
                                data={paymentData}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={
                                    this.RenderPaymentCard
                                }
                            />
                            : 
                            <Text style={{ alignSelf:'center', fontSize: 16, marginTop: '90%' }}>No Record!</Text>
                    }
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    paymentData: selectors.makeSelectPaymentHistory()(state) || null,
    loading: selectors.makeSelectLoading()(state),
    error: selectors.makeSelectError()(state),
});

const mapDispatchToProps = dispatch => {
    return {
        fetchList: () => dispatch(actions.fetchPaymentAction()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionHistoryScreen);

const styles = StyleSheet.create({
    historyItem: {
        height: 50,
        width: '95%',
        marginBottom: 0.2,
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginHorizontal: 10,
        justifyContent: 'center',
        borderBottomWidth: 0.4,
        borderBottomColor: '#c4c4c4'
    },
});