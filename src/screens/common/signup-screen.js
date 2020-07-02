import { connect } from 'react-redux';
import React, { Component } from 'react';
import Toast from 'react-native-easy-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    View, StyleSheet, ImageBackground, Dimensions, Text, ScrollView, TouchableOpacity
} from 'react-native';

import SignUpForm from '../forms/signup-form';

import * as selectors from '../../selectors/auth-selectors';
import * as actions from '../../actions/auth-actions';

const { height } = Dimensions.get('screen');

class SignInScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.user !== null) {
            this.props.navigation.navigate('SignInScreen');
            this.props.resetState();
        }
        if (nextProps.isAuthenticated) {
            if (nextProps.error && nextProps.error.message) {
                this.refs.toast.show('Email already registered', 1500);
                this.props.resetState();
            } else {
                this.refs.toast.show('Failed to registered, please try again ');
                this.props.resetState();
            }
        }
    }

    navigateTo = screen => {
        const { state } = this.props.navigation;
        if (screen) {
            if (state.params && state.params.type)
                this.props.navigation.navigate(screen, {
                    type: state.params.type
                })
            else
                this.props.navigation.navigate(screen);
        }
    }

    render () {
        const { state } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <ImageBackground
                        source={require('../../assets/images/auth-bg.jpg')}
                        style={styles.backgroundImage}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{ position: 'absolute', margin: 15, zIndex: 9999 }}>
                            <Icon name="arrow-left" style={{
                                fontSize: 18, color: '#000', zIndex: 555
                            }}
                            />
                        </TouchableOpacity>
                        <View style={styles.overlay}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 0.4,
                            }}>
                                <Text style={styles.textStyle}>Sign Up</Text>
                            </View>
                            <View style={styles.formContainer}>
                                <SignUpForm
                                    navigateTo={this.navigateTo}
                                    userType={state.params.type}
                                />
                                                
                            </View>
      
                        </View>
                        <Toast ref='toast' position='top' />
                    </ImageBackground>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: selectors.makeSelectSignUpUser()(state),
    error: selectors.makeSelectSignUpError()(state),
    isAuthenticated: selectors.makeSelectAuthStatue()(state),
});

const mapDispatchToProps = dispatch => {
    return {
        resetState: () => dispatch(actions.resetAuthState()),
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: height - 20,
    },
    formContainer: {
        flex: 1,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: '#FEFFFF',
    },
    textStyle: {
        fontSize: 30,
        color: '#fff',
        width: '100%',
        fontWeight: '700',
        textAlign: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)