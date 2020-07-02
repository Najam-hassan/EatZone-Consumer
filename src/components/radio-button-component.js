import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButton = ({ item, value, onChange }) => (
    <View key={item.key} style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.circle}
            onPress={() => onChange(item.value)}
        >
            {value === item.value ?
                <View style={styles.checkedCircle} />
                : null
            }
        </TouchableOpacity>
        <Text>{item.label}</Text>
        <Text>+{item.price} $</Text>
    </View>
)

const styles = StyleSheet.create({
    buttonContainer: {
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    circle: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ACACAC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#1BA2FC',
    },
});

export default RadioButton;