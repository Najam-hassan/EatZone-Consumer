import { connect } from "react-redux";
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form/immutable'
import {
    View, StyleSheet, Dimensions, ActivityIndicator, Text, TouchableOpacity
} from 'react-native'

const { width, height } = Dimensions.get('screen');

import InputField from '../../components/common/input';
import Button from '../../components/common/button';

import * as actions from '../../actions/auth-actions';
import * as selectors from '../../selectors/auth-selectors';

class ForgetPasswordForm extends Component {

    componentWillReceiveProps (nextProps) {
        if (nextProps.data && nextProps.data.code === 200) {
            this.props.navigateTo('SignInScreen');
            this.props.resetState();
            this.forceUpdate();
        } else if (nextProps.data && nextProps.data.code === 404) {
            this.props.showToastMessage(
                'Email does not exist!!!'
            );
            this.props.resetState();
        }
    }

    onSubmit = (values) => {
        if (values) {
            if (this.props.userType === 'admin') {
                this.props.onSubmit('/restaurant/req-forgot-password', values);
            } else {
                this.props.onSubmit('/user/req-forgot-password', values);
            }
        }
    }

    render () {
        const { handleSubmit, submitting, loading } = this.props;
        return (
            <View style={styles.container}>
                <View>
                    <Field
                        name='email'
                        placeholder='Email'
                        errorTextColor="red"
                        component={InputField}
                        keyboardType='email-address'
                        customContainerStyle={styles.input}
                        customInputStyle={{ color: "#000" }}
                    />
                    {submitting || loading ?
                        <ActivityIndicator size="large" color="#1BA2FC" /> :
                        <Button
                            title="Reset Password"
                            onPress={handleSubmit(this.onSubmit)}
                            style={styles.button}
                            textStyle={{ /* styles for button title */ }}
                        />
                    }
                    <View style={{ marginTop: 10 }}>
                        <Text
                            style={[styles.textStyle, {}]}
                            onPress={() => {
                                this.props.navigateTo('SignInScreen');
                            }}
                        >Back to login</Text>
                    </View>
                </View>
            </View >
        )
    }
}

const validate = values => {
    const errors = {};
    if (!values.get('email')) {
        errors.email = '*Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.get('email'))) {
        errors.email = 'not valid email!'
    }
    return errors;
};

const mapStateToProps = state => ({
    data: selectors.makeSelectForgotPasswordData()(state),
    loading: selectors.makeSelectForgotPasswordLoading()(state),
});

const mapDispatchToProps = dispatch => {
    return {
        onSubmit: (url, values) => {
            if (values.toJS()) {
                dispatch(actions.forgotPasswordAction(url, values.toJS()));
            }
        },
        resetState: () => dispatch(actions.resetAuthState())
    }
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#1BA2FC',
        width: width - 50,
        color: 'gray',
        marginTop: 10,
        lineHeight: 37,
        borderRadius: 50,
        textAlign: 'center',
    },
    input: {
        borderRadius: 50,
        width: width - 50,
        backgroundColor: '#F0F1F3'
    },
    textStyle: {
        textAlign: 'center',
        fontWeight: "400",
        color: '#000',
    },
    signUpTextStyle: {
        color: '#1BA2FC',
        fontWeight: "800"
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(reduxForm({
    form: 'ForgetPasswordFrom',
    enableReinitialize: true,
    validate,
})(ForgetPasswordForm))
