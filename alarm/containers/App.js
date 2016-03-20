import React, {
  AsyncStorage,
  Component,
  PropTypes,
  NativeModules,
  View
} from 'react-native';
import { connect, Provider } from 'react-redux/native';
import {
  createStore,
  applyMiddleware,
  bindActionCreators
} from 'redux';
import {
  reviveAlarms,
  addAlarm,
  removeAlarm,
  toggleAlarm,
  toggleDay,
  updateAlarm
} from '../actions/AlarmActions';
import { setTime } from '../api/api';

import AlarmReducer, { getTimeString } from '../reducers/AlarmReducer';
import AlarmList from '../components/AlarmList';
import AddButton from '../components/AddButton';
import * as styles from '../components/styles';

const store = createStore(AlarmReducer);
store.subscribe(() => {
  setTime(getTimeString(store.getState()));
});

const storageKey = 'AlarmState';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    reviveAlarms: reviveAlarms,
    onAddAlarm: addAlarm,
    onAlarmUpdate: updateAlarm,
    onRemoveAlarm: removeAlarm,
    onToggleAlarm: toggleAlarm,
    onToggleDay: toggleDay
  }, dispatch);
}

class App extends Component {
  static propTypes = {
    alarms: PropTypes.array.isRequired,
    onAddAlarm: PropTypes.func.isRequired,
    onAlarmUpdate: PropTypes.func.isRequire,
    onRemoveAlarm: PropTypes.func.isRequired,
    onToggleAlarm: PropTypes.func.isRequired,
    onToggleDay: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    AsyncStorage.getItem(storageKey).then((state) => {
      props.reviveAlarms(JSON.parse(state));

      store.subscribe(() => {
        AsyncStorage.setItem(storageKey, JSON.stringify(store.getState()));
      });
    });
  }

  render() {
    return (
      <View style={ styles.app } elevation={ 1 }>
        <AlarmList items={ this.props.alarms }
                   onAlarmTimePress={ this._onAlarmTimePress }
                   onRemoveAlarm={ this.props.onRemoveAlarm }
                   onToggleAlarm={ this.props.onToggleAlarm }
                   onToggleDay={ this.props.onToggleDay } />
        <AddButton onPress={ this._onAddAlarm }/>
      </View>
    );
  }

  _onAddAlarm = () => {
    NativeModules.DateAndroid.showTimepicker(() => {}, (hour, minute) => {
      const minutes = (hour * 60) + minute;
      this.props.onAddAlarm(minutes);
    });
  };

  _onAlarmTimePress = (alarmId) => {
    const currentAlarm = this.props.alarms.filter((alarm) => alarm.id === alarmId)[0];
    const currentHours = Math.floor(currentAlarm.time / 60);
    const currentMinutes = currentAlarm.time % 60;
    const initialTime = new Date();
    initialTime.setHours(currentHours);
    initialTime.setMinutes(currentMinutes);
    initialTime.setSeconds(0);
    const initialTimeIso = initialTime.toISOString();

    NativeModules.DateAndroid.showTimepickerWithInitialTime(initialTimeIso,
      () => {},
      (hour, minute) => {
        const minutes = (hour * 60) + minute;
        this.props.onAlarmUpdate(alarmId, minutes);
    });
  };
};
const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default class AppContainer extends Component {
  render() {
    return (
      <Provider store={ store }>
        { () => <ConnectedApp /> }
      </Provider>
    );
  }
}
