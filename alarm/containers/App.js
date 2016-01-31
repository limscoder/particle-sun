import React, { Component, PropTypes, View } from 'react-native';
import { connect, Provider } from 'react-redux/native';
import { createStore, applyMiddleware, bindActionCreators } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
  addAlarm,
  removeAlarm,
  toggleAlarm,
  toggleDay
} from '../actions/AlarmActions';

import AlarmReducer from '../reducers/AlarmReducer';
import AlarmList from '../components/AlarmList';
import AddButton from '../components/AddButton';
import * as styles from '../components/styles';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
const store = createStoreWithMiddleware(AlarmReducer);

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onAddAlarm: () => addAlarm(1035),
    onRemoveAlarm: removeAlarm,
    onToggleAlarm: toggleAlarm,
    onToggleDay: toggleDay
  }, dispatch);
}

class App extends Component {
  static propTypes = {
    alarms: PropTypes.array.isRequired,
    onAddAlarm: PropTypes.func.isRequired,
    onRemoveAlarm: PropTypes.func.isRequired,
    onToggleAlarm: PropTypes.func.isRequired,
    onToggleDay: PropTypes.func.isRequired
  };

  render() {
    return (
      <View style={ styles.app } elevation={ 1 }>
        <AlarmList items={ this.props.alarms }
                   onRemoveAlarm={ this.props.onRemoveAlarm }
                   onToggleAlarm={ this.props.onToggleAlarm }
                   onToggleDay={ this.props.onToggleDay } />
        <AddButton onPress={ this.props.onAddAlarm }/>
      </View>
    );
  }
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
