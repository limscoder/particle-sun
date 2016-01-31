import React, {
  Component,
  PropTypes,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as styles from './styles';

export default class AddButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired
  };

  render() {
    return (
      <View style={ styles.centerButton } elevation={ 1 }>
        <TouchableOpacity style={ styles.roundButton }
                          elevation={ 2 }
                          onPress={ this.props.onPress }>
          <Text style={ styles.addButtonText }>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
