import { connect } from 'react-redux';
import React, { Component } from 'react';
import PhotoUpload from 'react-native-photo-upload';
import { Field, reduxForm } from 'redux-form/immutable';
import Toast from 'react-native-easy-toast';
import {
    View, ActivityIndicator, StyleSheet, Dimensions, Image, Alert, ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('screen');

import * as actions from '../../actions/restaurant-actions/category-actions';
import * as selectors from '../../selectors/restaurant-selectors/category-selectors';

import InputField from '../../components/common/input';
import Button from '../../components/common/button';

class CategoryForm extends Component {

    state = { imageData: null, imageLoading: false };

    componentWillReceiveProps (nextProps) {
        if (nextProps.category && nextProps.category.name) {
            this.props.navigation.navigate('HomeScreen');
            this.props.resetState();
        }
        if (nextProps.error) {
            this.refs.toast.show(nextProps.error.message, 2000);
        }
    }

    onSubmit = values => {
        const { imageData } = this.state;
        const { catId } = this.props;
        if (values && values.toJS()) {
            if (catId) {
                if (imageData) {
                    this.props.updateCategory({
                        ...values.toJS(),
                        // imageData: `data:image/jpeg;base64,${imageData}`
                        imageData: imageData
                    }, catId);
                } else {
                    this.props.updateCategory(values.toJS(), catId);
                }
            } else if (imageData) {
                this.props.addCategory({
                    ...values.toJS(),
                    // imageData: `data:image/jpeg;base64,${imageData}`
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

    render () {
        const { handleSubmit, submitting, loading, imageUrl, error } = this.props;
        // console.warn('error===>>>',error);
        const { imageLoading } = this.state;
        return (
            <View style={styles.container}>
                <Toast
                    ref="toast"
                    position='bottom'
                    fadeOutDuration={3000}
                    textStyle={{ color: '#fff' }}
                />
                <View style={{ flex: 0.4 }}>
                    <PhotoUpload
                        onStart={() => this.setState({ imageLoading: true })}
                        onPhotoSelect={avatar => {
                            if (avatar) {
                                this.setState({
                                    imageData: avatar,
                                    imageLoading: false,
                                });
                            }
                        }}
                        onCancel={() => this.setState({ imageLoading: false })}
                    >{imageUrl ?
                        <Image
                            style={{
                                width: width,
                                height: '100%',
                            }}
                            source={{ uri: this.props.imageUrl }}
                            resizeMode='cover'
                        /> :
                        <Image
                            style={{
                                width: width,
                                height: '100%',
                            }}
                            source={require('../../assets/images/placeholder-img.png')}
                            resizeMode='cover'
                        />}
                        {imageLoading ? <ActivityIndicator
                            size="large" color="#000" style={styles.indicator}
                        /> : null}
                    </PhotoUpload>
                </View>
                <View style={{
                    top: -20,
                    flex: 0.6,
                    paddingTop: 35,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }}>
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
                                placeholder='Enter Category Name'
                                customContainerStyle={styles.input}
                                customInputStyle={{ color: "#000" }}
                            />
                            {submitting || loading ?
                                <ActivityIndicator size="large" color="#1BA2FC" /> :
                                <Button
                                    title={imageUrl ? "Update" : "Save"}
                                    onPress={handleSubmit(this.onSubmit)}
                                    style={styles.button}
                                    textStyle={{ /* styles for button title */ }}
                                />
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.get('name')) {
        errors.name = '*Required';
    } else if (values.get('name').length < 5) {
        errors.name = "must be at least 5 characters long"
    }

    return errors;
};

const mapStateToProps = state => ({
    error: selectors.makeSelectError()(state),
    loading: selectors.makeSelectLoading()(state),
    category: selectors.makeSelectCategory()(state),
});

const mapDispatchToProps = dispatch => {
    return {
        resetState: () => dispatch(actions.resetState()),
        addCategory: category => dispatch(actions.addCategoryAction(category)),
        updateCategory: (data, id) => dispatch(actions.updateCategoryAction(data, id)),
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
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(reduxForm({
    form: 'CategoryForm',
    enableReinitialize: true,
    validate,
})(CategoryForm));
