import React, { Component } from 'react';
import { View, Text, TouchableOpacity, WebView, Dimensions, StatusBar, ActivityIndicator, AsyncStorage } from 'react-native';

import { Header } from '../../components/common/header';
const { height, width } = Dimensions.get('screen');

class StripeConnectWebview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0
        }
    }
    _getQueryParams(url) {
        var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
        while (match = regex.exec(url)) {
            params[match[1]] = match[2];
        }
        return params
    }
    render() {
        const { params } = this.props.navigation.state;
        const { counter } = this.state;
        console.log('userID: ',params.user.id);
        
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
                <WebView
                    useWebKit={false}
                    // source={{ uri: 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://connect.stripe.com/connect/default_new/oauth/test&client_id=ca_FsNIRisYyOsfWi3YQ68vnOK7B1TsYXEa&state=' + params.user.id }} //ca_FsNIRisYyOsfWi3YQ68vnOK7B1TsYXEa
                    source={{ uri: 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://foodallinone.com/api/v1/restaurant/stripe-register&client_id=ca_GaCo9nikqYziRwMNcndbsdgz86oxL33A&state=' + params.user.id }} //ca_FsNIRisYyOsfWi3YQ68vnOK7B1TsYXEa                    
                    style={{ height: height, width: width }}
                    // onLoadStart={(navState) => console.log('OnloadPage start======>>>>>>>>>',navState)}
                    // scalesPageToFit={true}
                    startInLoadingState={true}
                    onNavigationStateChange={async (value) => {
                        // console.log('value============>>>>>>>>>>>>>',value);
                        // if (value.url.includes('http://www.endnow.com/?stripeId')) {
                        if (value.url.includes('stripe-end-webview')) {
                            try {
                                //http://www.endnow.com/?stripeId=acct_1FZBSOCDvsp3WBVj
                                const urlRes = await this._getQueryParams(value.url);
                                await AsyncStorage.getItem('user').then((user)=>{
                                    const userRes = JSON.parse(user);
                                    userRes.stripeId = urlRes.stripeId;
                                    AsyncStorage.setItem('user', JSON.stringify(userRes)).then(()=>{
                                        this.props.navigation.replace('EditRestaurantProfile');
                                        // this.props.navigation.navigate(params.user ? 'App' : 'Auth');
                                    })
                                })
                            } catch (error) {
                                console.log('error===>>>', error);
                            }
                        }
                    }}
                    renderLoading={() => <ActivityIndicator size='large' color='#1BA2FC' animating={true} />}
                    javaScriptEnabled={true}
                />
            </View>
        )
    }
}

export default StripeConnectWebview 