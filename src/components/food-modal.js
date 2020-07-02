import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class FoodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: this.props.showModal,
      heading: this.props.heading,
      body: this.props.body
    }
  }

  render() {
    return (
      <Modal isVisible={true}
        animationInTiming={600}
      >
        <View style={{ backgroundColor: '#fff', paddingVertical: 40, borderRadius: 4, alignItems: 'center', marginHorizontal: 30 }}>
          <View style={styles.check}>
            <MaterialCommunityIcons name="check" size={34} style={{ color: '#fff' }}></MaterialCommunityIcons>
          </View>
          <View style={styles.profileDetail}>
            <Text style={{ marginTop: 30, fontSize: 26, color: '#000' }}>{this.state.heading}</Text>
            <Text style={{ color: '#000', opacity: 0.5, marginTop: 15, textAlign: 'center' }}>{this.state.body}</Text>

            <TouchableOpacity onPress={() => this.props.closeModal()} style={styles.cartBtn}>
              <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center' }}>DONE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  profileDetail: {
    paddingHorizontal: 15,
    alignItems: 'center'
  },
  cartBtn: {
    backgroundColor: '#00a0ff',
    padding: 8,
    borderRadius: 5,
    width: '100%',
    marginTop: 30,
    width: 120
  },
  check: {
    height: 66,
    width: 66,
    backgroundColor: '#00a0ff',
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -73,
  }
});