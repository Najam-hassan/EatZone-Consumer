import { connect } from 'react-redux';
import React, { Component } from 'react';
import Toast from 'react-native-easy-toast';
import PhotoUpload from 'react-native-photo-upload';
import { Field, reduxForm } from 'redux-form/immutable';
import {
	View, ActivityIndicator, StyleSheet, Dimensions,
	Image, Alert, ScrollView, Platform, KeyboardAvoidingView
} from 'react-native';

const { width, height } = Dimensions.get('screen');

import { fetchCategoryListAction } from '../../actions/restaurant-actions/home-actions';
import * as actions from '../../actions/restaurant-actions/category-item-actions';
import * as selectors from '../../selectors/restaurant-selectors/category-item-selectors';

import Button from '../../components/common/button';
import InputField from '../../components/common/input';
import TextAreaFiled from '../../components/common/text-area';

class MenuItemForm extends Component {

	state = { imageData: null, imageLoading: false };

	componentWillReceiveProps(nextProps) {
		const { categoryId } = this.props;
		if (nextProps.categoryItem && nextProps.categoryItem.name) {
			this.refs.toast.show('Category created successfully', 1500);
			this.props.navigation.navigate('MenuItemsScreen', {
				catId: categoryId
			});
			this.props.fetchList();
			this.props.resetState();
		}
	}

	onSubmit = values => {
		const { categoryId, itemId } = this.props;
		const { imageData } = this.state;
		if (values && values.toJS()) {
			if (itemId) {
				if (imageData) {
					this.props.updateItem({
						...values.toJS(),
						imageData: imageData
					}, categoryId, itemId);
				} else {
					this.props.updateItem(values.toJS(), categoryId, itemId);
				}
			} else if (imageData) {
				this.props.onSubmit(categoryId, {
					...values.toJS(),
					imageData: imageData
				});
			} else {
				return Alert.alert(
					"Required",
					'Please select image!!',
					[
						{ text: 'OK', onPress: () => console.log('OK Pressed') },
					],
					{ cancelable: false },
				)
			}
		}
	};

	renderFormBody = () => {
		const { handleSubmit, submitting, loading, itemId } = this.props;
		return (
			<ScrollView
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				<View style={{
					alignItems: 'center',
					flex: 1
				}}>
					<Field
						name='name'
						errorTextColor="red"
						keyboardType='default'
						component={InputField}
						placeholder='Enter Item Name'
						customContainerStyle={styles.input}
						customInputStyle={{ color: "#000" }}
					/>
					<Field
						name='price'
						errorTextColor="red"
						keyboardType='number-pad'
						component={InputField}
						placeholder='Price $'
						customContainerStyle={styles.input}
						customInputStyle={{ color: "#000" }}
					/>
					<Field
						name='description'
						errorTextColor="red"
						keyboardType='default'
						component={TextAreaFiled}
						placeholder='Enter Item Description'
						customContainerStyle={[styles.input, {
							height: 100,
							borderRadius: 10
						}]}
						description={true}
						customInputStyle={{ color: "#000" }}
					/>
					{submitting || loading ?
						<ActivityIndicator size="large" color="#1BA2FC" /> :
						<Button
							title={itemId ? "Update" : "Save"}
							onPress={handleSubmit(this.onSubmit)}
							style={styles.button}
							textStyle={{ /* styles for button title */ }}
						/>
					}
				</View>
			</ScrollView>
		)
	}

	render() {
		const { imageUrl } = this.props;
		const { imageLoading } = this.state;
		return (
			<View style={styles.container}>
				<Toast
					ref="toast"
					position='bottom'
					fadeOutDuration={3000}
					textStyle={{ color: '#fff' }}
				/>
				{/* <View style={{}}> */}
				<View style={{ flex: 0.4 }}>
					<PhotoUpload
						onStart={() => this.setState({ imageLoading: true })}
						onPhotoSelect={avatar => {
							if (avatar) {
								this.setState({
									imageData: avatar,
									imageLoading: false
								});
							}
						}}
						onCancel={() => this.setState({ imageLoading: false })}
					>{imageUrl ?
						<Image
							style={{
								width: width,
								height: "100%",
							}}
							source={{ uri: imageUrl }}
							resizeMode='cover'
						/> :
						<Image
							style={{
								width: width,
								height: "100%",
							}}
							source={require('../../assets/images/placeholder-img.png')}
							resizeMode='cover'
						/>}
						{imageLoading ? <ActivityIndicator
							size="large" color="#000" style={styles.indicator}
						/> : null}
					</PhotoUpload>
				</View>
				{Platform.OS === 'android' ?
					<View style={{
						top: -20,
						flex: 0.6,
						paddingTop: 25,
						backgroundColor: '#fff',
						borderTopLeftRadius: 15,
						borderTopRightRadius: 15,
					}}>
						{this.renderFormBody()}
					</View> : <KeyboardAvoidingView
						behavior="padding"
						keyboardVerticalOffset={60}
						style={{
							top: -20,
							flex: 0.6,
							paddingTop: 25,
							backgroundColor: '#fff',
							borderTopLeftRadius: 15,
							borderTopRightRadius: 15,
						}}>
						{this.renderFormBody()}
					</KeyboardAvoidingView>}
				{/* </View> */}
			</View >
		);
	}
}

const validate = values => {
	const errors = {};
	if (!values.get('name')) {
		errors.name = '*Required';
	} else if (values.get('name').length < 3) {
		errors.name = "must be at least 3 characters long"
	}
	if (!values.get('price')) {
		errors.price = '*Required';
	} else if (!/^[+]?([.]\d+|\d+[.]?\d*)$/i.test(values.get('price'))) {
		errors.price = "Price must be greater than 0"
	}
	if (values.get('description') && values.get('description').length > 250) {
		errors.description = "Not be greater the 250 characters."
	}

	return errors;
};

const mapStateToProps = state => ({
	loading: selectors.makeSelectLoading()(state),
	listLoading: selectors.makeSelectListLoading()(state),
	categoryItem: selectors.makeSelectCategoryItem()(state),
});

const mapDispatchToProps = dispatch => {
	return {
		resetState: () => dispatch(actions.resetState()),
		onSubmit: (catId, values) => {
			dispatch(actions.addCategoryItemAction(catId, values))
		},
		fetchList: () => dispatch(fetchCategoryListAction()),
		updateItem: (data, catId, itemId) => {
			dispatch(actions.updateCategoryItemAction(data, catId, itemId))
		},
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
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
	indicator: {
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		position: 'absolute',
	}
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(reduxForm({
	form: 'MenuItemForm',
	enableReinitialize: true,
	validate,
})(MenuItemForm));
