import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Modal from "react-native-modal";

const Spinner = ({ size, color }) => {
    return (
        <View style={styles.spinnerStyle}>
            <Modal isVisible={true}>
                <ActivityIndicator size={size || 'large'} color={color || '#000'} />
            </Modal>
        </View>
    );
};

const styles = {
    spinnerStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export default Spinner;
