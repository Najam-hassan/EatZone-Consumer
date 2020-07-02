import React, { Component } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class TermsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: this.props.showModal,

    }
  }

  render() {
    return (
      <Modal isVisible={true}
        animationInTiming={600}
        style={{ backgroundColor: "#fff", borderRadius: 10, position: 'relative', paddingTop: 15 }}
      >
        <TouchableOpacity
          style={{ position: 'absolute', height: 40, width: 40, borderRadius: 30, top: -15, right: -15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00a0ff', zIndex: 44 }}
          onPress={() => { this.props.closeModal() }}
        >
          <MaterialCommunityIcons name="close" size={20} style={{ color: '#fff', padding: 5 }}></MaterialCommunityIcons>
        </TouchableOpacity>
        <ScrollView>
          <View>
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 4, alignItems: 'center' }}>
              <View style={styles.profileDetail}>
                <Text style={{ fontSize: 26, color: '#000' }}>WAIVER AND RELEASE OF LIABILITY</Text>
                <Text style={{ color: '#000', opacity: 0.5, marginTop: 15 }}>In exchange for participation in the activity of dine-in organized by EatZone, and/or use of the property, facilities and services of  EatZone and/or dine-in restaurant/facility, I, Customer of EatZone and/or dine-in restaurant/facility agree for myself and (if applicable) for the members of my dine-In group, to the following:</Text>
                <Text style={{ color: '#000', opacity: 0.5, marginTop: 5 }}>ASSUMPTION OF THE RISK AND RELEASE. I recognize that there arecertain inherent risks associated with the above described activity and I assume full responsibility for personal injury to myself and (if applicable) to the members of my dine-In group, and further release and discharge EatZone and/or dine-in facility for injury, loss or damage arising out of my or my dine-in group’s use of or presence upon the facilities of EatZone and/or dine-in facility, whether cause by the fault of myself, my dine-in group, EatZone, dine-in facility or other third parties.</Text>
                <Text style={{ color: '#000', opacity: 0.5, marginTop: 5 }}>INDEMNIFICATION. I agree to indemnify and defend EatZone and/or dine-infacility against all claims, causes of action, damages, judgments, costs or expenses,including attorney fees and other litigation costs, which may in any way arise from my or my dine-in group’s use of or presence upon the facilities of EatZone and/or dine-in facility.</Text>
                <Text style={{ color: '#000', opacity: 0.5, marginTop: 5 }}>FEES. I agree to pay for all damages to the facilities of EatZone and/or dine-in facility caused by the negligent, reckless, or willful actions by me or any member of my dine-In group.</Text>
                <Text style={{ color: '#000', opacity: 0.5, marginTop: 5 }}>Any side effect, health issues, harm or damage caused by the food from ordering restaurant/facility will not be the responsibility of EatZone and/or dine-in restaurant/facility. </Text>
                <Text style={{ color: '#000', fontSize: 15, marginTop: 5 }}>I HAVE READ THIS DOCUMENT AND UNDERSTAND IT. I FURTHER UNDERSTAND THAT BY AGREEING THIS RELEASE, I VOLUNTARILY SURRENDER CERTAIN LEGAL RIGHTS.</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity onPress={() => this.props.acceptTermAndCond()} style={styles.cartBtn}>
          <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center' }}>Accept</Text>
        </TouchableOpacity>
      </Modal >
    )
  }
}

const styles = StyleSheet.create({
  profileDetail: {
    alignItems: 'center'
  },
  cartBtn: {
    backgroundColor: '#00a0ff',
    padding: 12,
    borderRadius: 30,
    marginVertical: 10,
    marginHorizontal: 20
  },
  check: {
    height: 10,
    width: 10,
    backgroundColor: '#00a0ff',
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -73,
  }
});