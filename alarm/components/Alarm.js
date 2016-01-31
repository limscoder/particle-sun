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
    onToggle: PropTypes.func.isRequired,
    onToggleDay: PropTypes.func.isRequired
  };

  render() {
    const alarmStyle = this.props.item.enabled ? styles.alarm : styles.inactiveAlarm;

    return (
        <View style={ alarmStyle }>
          <View style={ styles.alarmTop }>
            <View style={ styles.alarmLeft }>
              { this._renderTime() }
            </View>
            <View style={ styles.alarmRight }>
              { this._renderSwitch() }
            </View>
          </View>
          <View style={ styles.alarmBottom }>
            { this._renderDays() }
            { this._renderDelete() }
          </View>
        </View>
    );
  }

  _renderSwitch = () => {
    return (
      <View style={ styles.alarmSwitch }>
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
    const clockTime = `${twelveHours}:${minutes}`;
    const clockPm = isPm ? 'pm' : 'am';

    return (
      <View style={ styles.clock }>
        <Text style={ styles.clockTime }>
          { clockTime }
        </Text>
        <Text style={ styles.clockPm }>
          { clockPm }
        </Text>
      </View>
    );
  };

  _renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return days.map((day, idx) => {
      const isActive = this.props.item.days[idx];
      const dayStyle = isActive ? styles.activeDay : styles.inactiveDay;
      const textStyle = isActive ? styles.activeDayText : styles.inactiveDayText;

      return (
        <TouchableOpacity style={ dayStyle } onPress={ () => this._onToggleDay(idx) }>
          <Text style={ textStyle }>
            { day }
          </Text>
        </TouchableOpacity>
      );
    });
  };

  _renderDelete = () => {
    return (
      <TouchableOpacity style={ styles.deleteAlarm }
                        onPress={ this._onRemove}>
        <Icon name='fontawesome|trash-o'
              size={ 32 }
              style={ styles.icon } />
      </TouchableOpacity>
    );
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
