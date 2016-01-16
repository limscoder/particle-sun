import React, {
  Component,
  Text,
  ListView
} from 'react-native';
import Alarm from './Alarm';
import * as styles from './styles.js';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const sampleAlarm = {
  time: 1035,
  enabled: true,
  days: [1, 2, 3, 4]
};

export default class AlarmList extends Component {
  render() {
    return <ListView style={ styles.alarmList }
                     dataSource={ ds.cloneWithRows([sampleAlarm]) }
                     renderRow={ (item) => <Alarm item={ item } /> }/>;
  }
}
