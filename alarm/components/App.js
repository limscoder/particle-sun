import React, { Component, View } from 'react-native';
import AlarmList from './AlarmList';
import AddButton from './AddButton';
import * as styles from './styles';

export default class App extends Component {
  render() {
    return (
      <View style={ styles.app } elevation={ 1 }>
        <AlarmList />
        <AddButton />
      </View>
    );
  }
}
