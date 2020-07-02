import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';

import CategoryForm from '../forms/category-form';
import { PageHeader } from '../../components/common/header';

class CategoryScreen extends Component {
    constructor(props) {
        super(props);

        //Binding handleBackButtonClick function with this
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillMount () {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick () {
        this.props.navigation.navigate('HomeScreen');
        return true;
    }

    render () {
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <StatusBar hidden={false} />
                <PageHeader
                    navigation={this.props.navigation}
                    title={'Add Category'}
                />
                <View style={{ flex: 1 }}>
                    <CategoryForm
                        navigation={this.props.navigation}
                        imageUrl={params ? params.imageUrl : null}
                        catId={params ? params.catId : null}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default CategoryScreen
