import React from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';

import iconClaw from '../assets/images/icon_claw.png'

const Screen = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}
const DragHeader = () => (
    <View style={styles.cart_layout}>
        <View style={styles.overlayView} />
        <View style={styles.cart_detail}>
            <Image style={styles.icon_claw} source={iconClaw} />
        </View>
    </View>
)

const styles = StyleSheet.create({
    cart_layout: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 30,
    },
    cart_detail: {
        paddingLeft: 20,
        paddingRight: 20,
        height: 20,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon_claw: {
        position: 'absolute',
        top: 7,
        bottom: 0,
        left: (Screen.width / 2) - 16,
        right: (Screen.width / 2) - 16,
        width: 30,
        height: 10,
    },
    overlayView: {
        height: 4,
        width: Screen.width,
        // backgroundColor: '#FD792E'
    }
})

export default DragHeader