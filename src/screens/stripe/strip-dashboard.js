import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StatusBar, WebView, Dimensions } from 'react-native';

import { connect } from 'react-redux';

import * as actions from '../../actions/restaurant-actions/stripe-dashboard-actions';
import * as selectors from '../../selectors/restaurant-selectors/stripe-dashboard-selector';

const { height, width } = Dimensions.get('screen');
import { Header } from '../../components/common/header';
class StripDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentWillMount = async () => {
        await this.props.fetchURL()
        // console.log('selectorValue==========>>>', this.props.dashboardURL);
    }

    render() {
        const { dashboardURL } = this.props;
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#f9f9f9',
            }}>
                <StatusBar hidden={false} />
                <Header
                    navigation={this.props.navigation}
                    title={'Stripe Dashboard'}
                />
                {
                    dashboardURL ?
                        <WebView
                            useWebKit={false}
                            source={{ uri: dashboardURL.url }} //https://connect.stripe.com/express/Yj8I7WLraAZf
                            // style={{ height: height, width: width }}
                            scalesPageToFit={true}
                            startInLoadingState={true}
                            renderLoading={() => <ActivityIndicator size='large' color='#1BA2FC' animating={true} />}
                            // onLoadStart={()=>console.warn('start')}
                            // onLoadEnd={()=>console.warn('end')}
                            javaScriptEnabled={true}
                        />
                        :
                        <ActivityIndicator color='#1BA2FC' size='large' animating={true} style={{ flex: 1, alignSelf:'center' }} />
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    dashboardURL: selectors.makeSelectDashboardURL()(state),
    loading: selectors.makeSelectLoading()(state),
});

const mapDispatchToProps = dispatch => {
    return {
        fetchURL: () => dispatch(actions.fetchDashboardURLAction()),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StripDashboard);