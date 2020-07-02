import { connect } from 'react-redux';
import React, { Component } from 'react';
import Toast from 'react-native-easy-toast';
import { View, ScrollView, StatusBar, BackHandler } from 'react-native';

import { Header } from '../../components/common/header';
import UserProfileForm from '../forms/user-profile-form';

import * as actions from '../../actions/user-actions/profile-actions';
import * as selectors from '../../selectors/user-selectors/profile-selectors';

class ProfileScreen extends Component {
    constructor(props) {
        super(props);

        //Binding handleBackButtonClick function with this
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.refs.toast.show(nextProps.error.message, 2000);
            this.props.resetState();
        }
        if (nextProps.success) {

            // this.refs.toast.show('Profile update successfully!', 2000);
            // this.props.resetState();
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
            <View style={{ flex: 1 }}>
                <StatusBar hidden={false} />
                <Header
                    navigation={this.props.navigation}
                    title={'Profile'}
                />
                <UserProfileForm navigation={this.props.navigation} />
                <Toast
                    ref="toast"
                    position='bottom'
                    fadeOutDuration={3000}
                    textStyle={{ color: '#fff' }}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    error: selectors.makeSelectProfileError()(state),
    success: selectors.makeSelectUpdateStatue()(state),
    profile: selectors.makeSelectProfileData()(state),
});

const mapDispatchToProps = dispatch => {
    return {
        resetState: () => dispatch(actions.resetState()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileScreen);
