import React from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import CallIcon from 'react-native-vector-icons/Feather';
import {
  View, StyleSheet, TouchableOpacity,
  Image, Text, Keyboard, Platform, Linking
} from 'react-native';

const Header = ({ navigation, title, profile }) => {
  const { iconsViewStyle, navTitle, navRight } = styles;
  return (
    <View style={{ backgroundColor: '#00a0ff', }}>
      <View style={[iconsViewStyle, { backgroundColor: '#00a0ff' }]}>
        {!profile ?
          <TouchableOpacity
            style={{ paddingHorizontal: 5, paddingVertical: 10, flex: 0.1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}
            hitSlop={{ top: 5, bottom: 5, right: 5, left: 5 }}
            onPress={() => {
              Keyboard.dismiss();
              navigation.openDrawer();
            }}
          >
            <Image source={require('../../assets/images/menuIcon.png')} />
          </TouchableOpacity> : <TouchableOpacity
            style={{ paddingHorizontal: 5, paddingVertical: 10, flex: 0.1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}
            hitSlop={{ top: 5, bottom: 5, right: 5, left: 5 }}
          >
          </TouchableOpacity>}
        <View style={navTitle}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500', lineHeight: 24, }}>{title}</Text>
        </View>
        <View style={navRight}>
          {/* <Icon name="chevron-right" size={34} color={'#fff'} /> */}
        </View>
      </View>
    </View>
  )
}

const PageHeader = ({ navigation, title, isCartScreen, id, phone }) => {
  const { iconsViewStyle, navTitle, navRight } = styles;
  return (
    <View style={{ backgroundColor: '#00a0ff', }}>
      <View style={[iconsViewStyle, { backgroundColor: '#00a0ff' }]}>
        <TouchableOpacity
          style={{ paddingHorizontal: 5, paddingVertical: 10, flex: 0.1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}
          onPress={() => {
            if (isCartScreen) {
              navigation.navigate("RestaurantDetailScreen", {
                restaurantId: id,
                name: title
              });
            } else {
              navigation.goBack()
            }
          }}
        >
          <Icon name="chevron-left" size={34} color={'#fff'} />
        </TouchableOpacity>
        <View style={navTitle}>
          <Text numberOfLines={1} style={{ color: '#fff', fontSize: 18, fontWeight: '500', lineHeight: 24, textAlign: "center" }}>{title}</Text>
        </View>
        <View style={navRight}>
          {phone ?
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'android') {
                  Linking.openURL(
                    `tel:${phone ? phone : 123}`
                  );
                }
                else {
                  const url = `telprompt:${phone ? phone : 123}`;
                  Linking.canOpenURL(url).then((supported) => {
                    if (supported) {
                      return Linking.openURL(url)
                        .catch(() => null);
                    }
                  });
                }
              }}
            >
              <CallIcon name="phone-call" size={18} color="#fff" />
            </TouchableOpacity> : null}
        </View>
      </View>
    </View>
  )
}

const OrderDetailHeader = ({ navigation, title, isCartScreen, id, phone, navScreen, isNotif }) => {
  const { iconsViewStyle, navTitle, navRight } = styles;
  return (
    <View style={{ backgroundColor: '#00a0ff', }}>
      <View style={[iconsViewStyle, { backgroundColor: '#00a0ff' }]}>
        <TouchableOpacity
          style={{ paddingHorizontal: 5, paddingVertical: 10, flex: 0.1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}
          onPress={() => {
            if (isNotif) {
              navigation.replace('RecentOrdersScreen');
            } else {
              navigation.replace(navScreen);
            }
            // navigation.replace(navScreen);
          }}
        >
          <Icon name="chevron-left" size={34} color={'#fff'} />
        </TouchableOpacity>
        <View style={navTitle}>
          <Text numberOfLines={1} style={{ color: '#fff', fontSize: 18, fontWeight: '500', lineHeight: 24, textAlign: "center" }}>{title}</Text>
        </View>
        <View style={navRight}>
          {phone ?
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'android') {
                  Linking.openURL(
                    `tel:${phone ? phone : 123}`
                  );
                }
                else {
                  const url = `telprompt:${phone ? phone : 123}`;
                  Linking.canOpenURL(url).then((supported) => {
                    if (supported) {
                      return Linking.openURL(url)
                        .catch(() => null);
                    }
                  });
                }
              }}
            >
              <CallIcon name="phone-call" size={18} color="#fff" />
            </TouchableOpacity> : null}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  iconsViewStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    fontSize: 18,
    fontWeight: '500',
  },
  navTitle: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  navRight: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 5,
    paddingVertical: 15,
  }
})

export { Header, PageHeader, OrderDetailHeader };