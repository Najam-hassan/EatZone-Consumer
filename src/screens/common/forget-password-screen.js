import { connect } from "react-redux";
import React, { Component } from 'react';
import Toast from 'react-native-easy-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    View, StyleSheet, ImageBackground, Dimensions, Text, ScrollView, TouchableOpacity
} from 'react-native';

import ForgetPasswordForm from '../forms/forgot-password-form';

const { height } = Dimensions.get('screen');

class ForgetPasswordScreen extends Component {
    constructor(props) {
        super(props);
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

    showMessage = message => {
        this.refs.toast.show(message, 2000);
    }

    render () {
        const { state } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={require('../../assets/images/auth-bg.jpg')}
                    style={styles.backgroundImage}
                >
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{ position: 'relative', margin: 15, zIndex: 9999 }}>
                        <Icon name="arrow-left" style={{ fontSize: 18, color: '#000' }} />
                    </TouchableOpacity>
                    <View style={styles.overlay}>
                        <View style={styles.imageHeader}>
                            <Text style={styles.textStyle}>Forgot Password</Text>
                        </View>
                        <View style={styles.formContainer}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <ForgetPasswordForm
                                    navigateTo={this.navigateTo}
                                    userType={state.params.type}
                                    showToastMessage={this.showMessage}
                                />
                            </ScrollView>
                        </View>
                    </View>
                </ImageBackground>
                <Toast ref="toast" position='top' />
            </View>
        )
    }
}

const mapStateToProps = state => ({});

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: height - 20,
    },
    imageHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.4,
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

export default connect(mapStateToProps, null)(ForgetPasswordScreen)