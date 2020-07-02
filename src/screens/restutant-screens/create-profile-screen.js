import { connect } from 'react-redux';
import React, { Component } from 'react';
import Toast from 'react-native-easy-toast';
import { change } from 'redux-form/immutable';
import { View, StatusBar, ActivityIndicator, BackHandler } from 'react-native';

import { Header } from '../../components/common/header';
import ProfileForm from '../forms/restaurant-profile-form';

import * as actions from '../../actions/restaurant-actions/profile-actions';
import * as selectors from '../../selectors/restaurant-selectors/profile-selectors';

class CreateProfileScreen extends Component {
    constructor(props) {
        super(props);

        //Binding handleBackButtonClick function with this
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillMount () {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidMount () {
        this.props.fetchDetails();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.profile && nextProps.profile.name) {
            this.props.change('name', nextProps.profile.name);
            this.props.change("collectionServiceCharges", "10");
            this.props.change("deliveryServiceCharges", "10");
            if (nextProps.profile.phone !== null) {
                this.props.navigation.navigate('HomeScreen');
            }
            this.props.resetState();
        }
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick () {
        this.props.navigation.navigate('HomeScreen');
        return true;
    }

    showToaster = message => {
        this.refs.toast.show(message, 2000);
    }

    render () {
        const { loading } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={false} />
                <Header
                    navigation={this.props.navigation}
                    title={'Restaurant Detail'}
                    profile={true}
                />
                {loading ?
                    <ActivityIndicator
                        size={'large'}
                        color={'#1BA2FC'}
                    /> : <ProfileForm
                        showToaster={this.showToaster}
                        onSubmitForm={this.props.onSubmit}
                        navigation={this.props.navigation}
                    />
                }
                <Toast ref="toast" />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    loading: selectors.makeSelectProfileLoading()(state),
    profile: selectors.makeSelectProflieData()(state),
});

const mapDispatchToProps = dispatch => {
    return {
        fetchDetails: () => dispatch(actions.updateProfileAction()),
        change: (fieldName, value) => {
            dispatch(change("RestaurantProfileForm", fieldName, value))
        },
        onSubmit: values => dispatch(actions.updateProfileAction(values)),
        resetState: () => dispatch(actions.resetState())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateProfileScreen) 