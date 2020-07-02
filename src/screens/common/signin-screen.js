import { connect } from "react-redux";
import React, { Component } from 'react';
import Toast from 'react-native-easy-toast';
import OneSignal from 'react-native-onesignal';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
	View, StyleSheet, ImageBackground, Dimensions, Text, AsyncStorage, ScrollView, TouchableOpacity
} from 'react-native';

import * as actions from '../../actions/auth-actions'
import * as selectors from '../../selectors/auth-selectors'

import SignInForm from '../forms/signin-form';

const { height } = Dimensions.get('screen');

class SignInScreen extends Component {
	constructor(props) {
		super(props);
		this.state = { playerId: '' }

		// OneSignal.configure()
	}

	componentDidMount () {
		OneSignal.addEventListener("ids", this.onIds.bind(this));
	}
	onIds (device) {
		this.setState({ playerId: device.userId })
	}

	componentWillReceiveProps (nextProps) {
		const { params } = this.props.navigation.state;
		if (nextProps.authUser !== null) {
			this.refs.toast.show(
				'Confirmation email has been sent to you. Please confirm to login',
				2000
			);
		}
		if (nextProps.user !== null) {
			// console.log('nextProps=======>>>>',nextProps.user);
			try {
				AsyncStorage.setItem(
					'user',
					JSON.stringify(nextProps.user),
					() => {
							if (params && params.type === 'user') {
								this.props.navigation.navigate('HomeScreen');
							} else {
								if (nextProps.user.stripeId) {
									this.props.navigation.navigate('EditRestaurantProfile'); //('CreateRestaurantProfile');
								} else {
									this.props.navigation.navigate('StripeConnectHome',{ user: nextProps.user });
								}
							}
						this.forceUpdate();
					}
				);
			} catch (error) {
			}
		}
		if (nextProps.isAuthenticated) {
			if (nextProps.error && nextProps.error.message) {
				this.refs.toast.show(nextProps.error.message, 2000);
				this.props.resetState();
			} else {
				this.refs.toast.show('Confirmation email has been sent to your account!');
				// this.props.resetState();
			}
		}
		if (nextProps.data && nextProps.data.code === 200) {
			this.refs.toast.show('Please check your email, and follow the Instruction!');
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
				<ScrollView
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle = {styles.container}
				>
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
							<View style={{
								alignItems: 'center',
								justifyContent: 'center',
								flex: 0.4,
							}}><Text style={styles.textStyle}>Sign In</Text></View>
							<View style={styles.formContainer}>
								<SignInForm
									navigateTo={this.navigateTo}
									userType={state.params.type}
									playerId={this.state.playerId}
								/>
							</View>
						</View>
						<Toast ref='toast' position='top' />
					</ImageBackground>
				</ScrollView>
		)
	}
}

const mapStateToProps = state => ({
	user: selectors.makeSelectData()(state),
	error: selectors.makeSelectSignInError()(state),
	authUser: selectors.makeSelectSignUpUser()(state),
	data: selectors.makeSelectForgotPasswordData()(state),
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
	container:{
		flexGrow:1,
		paddingBottom:50
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignInScreen)