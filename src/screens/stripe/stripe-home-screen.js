import React, { Component } from 'react';
import { View, Text, TouchableOpacity, WebView, Dimensions, StatusBar, ActivityIndicator } from 'react-native';

import { Header } from '../../components/common/header';
const { height, width } = Dimensions.get('screen');

class StripeConnectHome extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#f9f9f9',
            }}>
                <StatusBar hidden={false} />
                <Header
                    navigation={this.props.navigation}
                    title={'Stripe Connect'}
                    // profile={true}
                />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ height: 110, width: 100, backgroundColor: '#00a0ff', alignSelf: 'center', marginTop: 150, borderRadius: 10, marginBottom: 10 }}>
                        <Text style={{ fontSize: 80, color: '#fff', fontWeight: 'bold', alignSelf: 'center' }}>S</Text>
                    </View>
                    <Text style={{ fontSize: 16, color: 'black', alignSelf: 'center', marginHorizontal: 55, textAlign: 'center', marginVertical: 20 }}>Please connect with stripe to take advantage of online payments.</Text>
                    <TouchableOpacity style={{ backgroundColor: '#00a0ff', borderRadius: 25, marginVertical: 10 }} onPress={()=>this.props.navigation.navigate('StripeSignUp',{ user: params.user })}>
                        <Text style={{ fontSize: 16, marginHorizontal: 70, marginVertical: 12, color: '#fff' }}>Connect with Stripe</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default StripeConnectHome; 