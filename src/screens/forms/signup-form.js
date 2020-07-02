import { Text } from 'react-native';
import { connect } from "react-redux";
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form/immutable'
import TermsModal from '../../components/terms-modal';
import { View, StyleSheet, Dimensions, ActivityIndicator, Keyboard } from 'react-native'
const { width, height } = Dimensions.get('screen');
import Button from '../../components/common/button';
import * as actions from '../../actions/auth-actions';
import InputField from '../../components/common/input';
import { isAlphabetsWithSpecialChar } from '../../utils/regex';
import * as selectors from '../../selectors/auth-selectors';
import {CheckBox } from 'react-native-elements';
import Toast from 'react-native-easy-toast';

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = { subTotal: 0, showModal: false, terms: false, termsModal: false }
        //Binding handleBackButtonClick function with this
      }
      closeTermsModal() {
        this.setState({ termsModal: false })
      }
     
     
      
    onSubmit = (values) => {
        console.warn(this.props.userType)
        if(this.state.terms == true){
            if (values) {
                Keyboard.dismiss();
                if (this.props.userType === 'admin') {
                    this.props.onSubmit('/restaurant/sign-up', values)
                } else {
                    this.props.onSubmit('/user/sign-up', values);
                }
            }

        }
        else {
            alert('Please tap on terms and services')

        }
        
       
    }

    render() {
        const { handleSubmit, submitting, loading, userType } = this.props;
        return (
            <View style={styles.container}>
                <View>
                    <Field
                        name='name'
                        placeholder={userType === 'admin' ? 'Restaurant Name' : 'Name'}
                        errorTextColor="red"
                        component={InputField}
                        keyboardType='default'
                        customContainerStyle={styles.input}
                        customInputStyle={{ color: "#000" }}
                    />
                    <Field
                        name='email'
                        placeholder='Email'
                        errorTextColor="red"
                        component={InputField}
                        keyboardType='email-address'
                        customContainerStyle={styles.input}
                        customInputStyle={{ color: "#000" }}
                    />
                    <Field
                        name='password'
                        errorTextColor="red"
                        style={styles.input}
                        placeholder='Password'
                        keyboardType='default'
                        component={InputField}
                        secureTextEntry={true}
                        customContainerStyle={styles.input}
                        customInputStyle={{ color: "#000" }}
                    />
                        {
                        userType == 'user' ?
                           <CheckBox
                    checked={this.state.terms}
                    textStyle={styles.checkBoxText}
                    title='I have read and agree to the terms and services'
                    containerStyle={styles.checkBoxContainer}
                    onPress={() => {
                      const { terms } = this.state;
                      if (terms) {
                        this.setState({ terms: false })
                      }
                      terms ? this.setState({ termsModal: false }) : this.setState({ termsModal: true })
                    }}
                  /> 
                        :
                        null
                    }
                    {submitting || loading ?
                        <ActivityIndicator size="large" color="#1BA2FC" /> :
                        <Button
                            title="Sign Up"
                            onPress={handleSubmit(this.onSubmit)}
                            style={styles.button}
                            textStyle={{ /* styles for button title */ }}
                        />
                    }
                    <View style={{ flex: 1, marginTop: '10%' }}>
                        <View style={styles.textView}>
                            <Text style={styles.textStyle}>
                                Already have an account?
                                <Text
                                    style={styles.signUpTextStyle}
                                    onPress={() => {
                                        this.props.resetState();
                                        this.props.navigateTo('SignInScreen');
                                    }}
                                > Sign In
                                </Text>
                            </Text>
                        </View>
                    </View>
                </View>
                
                {this.state.termsModal ?
                <TermsModal
                  showModal={true}
                  closeModal={() => this.closeTermsModal()}
                  acceptTermAndCond={() => {
                    this.setState({ terms: true, termsModal: false })
                  }}
                /> : null
              }
            </View>
        )
    }
}

const validate = values => {
    const errors = {};

    if (!values.get('name')) {
        errors.name = '*Required';
    } else if (isAlphabetsWithSpecialChar(values.get('name'))) {
        errors.name = 'numeric values not allowed'
    } else if (values.get('name').length < 4 || values.get('name').length > 15) {
        errors.name = 'name must be 4 to 15 charecters long!'
    }

    if (!values.get('email')) {
        errors.email = '*Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.get('email'))) {
        errors.email = 'not valid email!'
    }

    if (!values.get('password')) {
        errors.password = '*Required';
    } else if (values.get('password').length < 6) {
        errors.password = "must be at least 6 characters long"
    }

    return errors;
};

const mapStateToProps = state => ({
    loading: selectors.makeSelectLoading()(state),
    user: selectors.makeSelectSignUpUser()(state),
});

const mapDispatchToProps = dispatch => {
    return {
        resetState: () => dispatch(actions.resetAuthState()),
        change: (fieldName, value) => {
            dispatch(change('SigninForm', fieldName, value));
        },
        onSubmit: (url, values) => {
            const { email, password, name } = values && values.toJS();
            dispatch(actions.registerAction(url, { email, password, name }))
        },
    }
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1BA2FC',
        width: width - 50,
        color: 'gray',
        marginTop: 10,
        lineHeight: 37,
        borderRadius: 50,
        textAlign: 'center',
    },
    container: {
        paddingTop: 30,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        borderRadius: 50,
        width: width - 50,
        backgroundColor: '#F0F1F3'
    },
    textStyle: {
        textAlign: 'center',
        color: '#000',
        fontWeight: "400"
    },
    signUpTextStyle: {
        color: '#1BA2FC',
        fontWeight: "800"
    },
    checkBoxText: {
        fontSize: 16,
        color: '#2b2b2b',
        fontWeight: '400',
      },
      checkBoxContainer: {
        backgroundColor: 'transparent',
        width:'80%',
      },
    
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(reduxForm({
    form: 'SignupForm',
    enableReinitialize: true,
    validate,
})(SignUpForm))
