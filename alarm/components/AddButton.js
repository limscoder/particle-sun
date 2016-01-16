import React, { Component, Text, TouchableOpacity, View, NativeModules } from 'react-native';
import * as styles from './styles';

export default class AddButton extends Component {
  render() {
    return (
      <View style={ styles.centerButton } elevation={ 1 }>
        <TouchableOpacity style={ styles.roundButton } elevation={ 2 }>
          <Text style={ styles.addButtonText }>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
