import React, {
  PropTypes,
  Component,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-icons';
import * as styles from './styles.js';

export default class Alarm extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    onTimePress: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    onToggleDay: PropTypes.func.isRequired
  };

  render() {
    const alarmStyle = this.props.item.enabled ? styles.alarm : styles.inactiveAlarm;

    return (
        <View style={ alarmStyle }>
          <View key="top" style={ styles.alarmTop }>
            <View key="left" style={ styles.alarmLeft }>
              { this._renderTime() }
            </View>
            <View key="right" style={ styles.alarmRight }>
              { this._renderDelete() }
              { this._renderSwitch() }
            </View>
          </View>
          <View key="bottom" style={ styles.alarmBottom }>
            { this._renderDays() }
          </View>
        </View>
    );
  }

  _renderSwitch = () => {
    return (
      <View key="switch" style={ styles.alarmSwitch }>
        <Switch value={ this.props.item.enabled }
                onValueChange={ this._onToggle }/>
      </View>
    );
  };

  _renderTime = () => {
    const twentyFourHours = Math.floor(this.props.item.time / 60);
    const isPm = twentyFourHours > 12;
    const twelveHours = isPm ? twentyFourHours - 12 : twentyFourHours;
    const minutes = this.props.item.time % 60;
    const minuteString = minutes > 9 ? minutes.toString() : '0' + minutes.toString();
    const clockTime = `${twelveHours}:${minuteString}`;
    const clockPm = isPm ? 'pm' : 'am';

    return (
      <TouchableOpacity onPress={ this._onTimePress }>
        <View key="clockTime" style={ styles.clock }>
          <Text key="time" style={ styles.clockTime }>
            { clockTime }
          </Text>
          <Text key="pm" style={ styles.clockPm }>
            { clockPm }
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return days.map((day, idx) => {
      const isActive = this.props.item.days[idx];
      const dayStyle = isActive ? styles.activeDay : styles.inactiveDay;
      const textStyle = isActive ? styles.activeDayText : styles.inactiveDayText;

      return (
        <TouchableOpacity key={ `day:${idx}`}
                          style={ dayStyle }
                          onPress={ () => this._onToggleDay(idx) }>
          <Text style={ textStyle }>
            { day }
          </Text>
        </TouchableOpacity>
      );
    });
  };

  _renderDelete = () => {
    return (
      <TouchableOpacity key="delete"
                        style={ styles.deleteAlarm }
                        onPress={ this._onRemove}>
        <Icon name='fontawesome|trash-o'
              size={ 32 }
              style={ styles.icon } />
      </TouchableOpacity>
    );
  };

  _onTimePress = () => {
    this.props.onTimePress(this.props.item.id);
  };

  _onRemove = () => {
    this.props.onRemove(this.props.item.id);
  };

  _onToggle = () => {
    this.props.onToggle(this.props.item.id);
  };

  _onToggleDay = (dayId) => {
    this.props.onToggleDay(this.props.item.id, dayId);
  };
}
