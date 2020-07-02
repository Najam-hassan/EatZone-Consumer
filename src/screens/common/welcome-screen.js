import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, StyleSheet, AsyncStorage } from 'react-native';

import Button from '../../components/common/button';

const { height } = Dimensions.get('screen');

class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../../assets/images/welcome-bg.jpg')}
                    style={styles.backgroundImage}
                >
                    <View style={[styles.container, styles.overlay]}>
                        <View></View>
                        <View>
                            <View>
                                <Text style={styles.textStyle}>Multiple Restaurants,</Text>
                                <Text style={styles.OnetextStyle}>ONE <Text style={styles.textStyle}>Dine-in table!</Text></Text>
                               
                            </View>
                            {/* <View style={{ marginTop: 30 }}>
                                <Text style={styles.description}>
                                    Different cuisine’s food at your
                                </Text>
                                <Text style={styles.description}>dine-in restaurant table</Text>
                            </View> */}
                        </View>
                        <View>
                            <View style={{ marginBottom: 50 }}>
                                     <Button
                                        title="My Dine-in Options"
                                        onPress={() => {
                                            AsyncStorage.setItem('user_type', 'user');
                                            this.props.navigation.navigate('SignInScreen', {
                                                type: 'user'
                                            });
                                        }}
                                    /> 
                                {/* <Button
                                    title= "Restaurant Management" //"Restaurant Owner"
                                    onPress={() => {
                                        AsyncStorage.setItem('user_type', 'admin');
                                        this.props.navigation.navigate('SignInScreen', {
                                            type: 'admin'
                                        });
                                    }}
                                /> */}
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    textStyle: {
        fontSize: 30,
        fontWeight: '700',
        color: '#fff',
    },
    OnetextStyle:{
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        color: '#fff',
        fontSize: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 30,
    }
})

export default WelcomeScreen 