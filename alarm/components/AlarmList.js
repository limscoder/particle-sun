import React, {
  Component,
  PropTypes,
  Text,
  ListView
} from 'react-native';
import Alarm from './Alarm';
import * as styles from './styles.js';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class AlarmList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    onAlarmTimePress: PropTypes.func.isRequired,
    onRemoveAlarm: PropTypes.func.isRequired,
    onToggleAlarm: PropTypes.func.isRequired,
    onToggleDay: PropTypes.func.isRequired
  };

  render() {
    return <ListView style={ styles.alarmList }
                     dataSource={ ds.cloneWithRows(this.props.items) }
                     renderRow={ this._renderAlarm }/>;
  }

  _renderAlarm = (item) => {
    return <Alarm key={ item.id }
                  item={ item }
                  onTimePress={ this.props.onAlarmTimePress }
                  onRemove={ this.props.onRemoveAlarm }
                  onToggle={ this.props.onToggleAlarm }
                  onToggleDay={ this.props.onToggleDay } />
  };
}
