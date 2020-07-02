import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class TestScreen extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: 'red',
                justifyContent: 'center',
            }}>
                <Text>screen details will go here!!!!</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('WelcomeScreen')}>
                    <Text>Navigation</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default TestScreen 