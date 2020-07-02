
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';


export const ButtonComponent = (props) => {
  const { title = 'Enter', style = {}, textStyle = {}, onPress, disabled } = props;

  return (
    <View>
      {props.isSocialBtn ?
        <TouchableOpacity
          onPress={onPress}
          style={[styles.socialBtnContainer, style]}
          activeOpacity={1}
          disabled={disabled}
        >
          <View style={{ width: '10%' }}>
            <Image
              style={styles.image}
              source={props.socialIcon}
            />
          </View>
          <View style={{ width: '60%' }}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity
          onPress={onPress}
          style={[styles.button, style]}
          activeOpacity={1}
          disabled={disabled}
        >
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>

      }
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 7,
    backgroundColor: '#1BA2FC',
    shadowColor: '#1BA2FC',
  },
  socialBtnContainer: {
    height: 50,
    width: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 7,
    // backgroundColor: '#1BA2FC',
    backgroundColor: 'red',
    shadowColor: '#1BA2FC',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:'space-evenly'
  },

  text: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  image: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  }
});

export default ButtonComponent;