import React from 'react';
import { Text, StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';

const FloatingButton = ({ onPress }) => (
    <ActionButton
        size={54}
        offsetX={8}
        offsetY={28}
        buttonColor={'#00a0ff'}
        onPress={() => onPress()}
        // renderIcon={() => <Text style={styles.testStyle}></Text>}
    />
);

const styles = StyleSheet.create({
    testStyle: {
        color: '#fff',
        fontSize: 40,
        fontWeight: '300'
    },
})

export default FloatingButton;