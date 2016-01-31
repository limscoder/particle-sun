import {
  ADD_ALARM,
  REMOVE_ALARM,
  TOGGLE_ALARM,
  TOGGLE_DAY
} from '../actions/ActionTypes';

const initialState = {
  alarms: []
};
const initialAlarm = {
  enabled: true,
  days: {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true
  }
};

function onAddAlarm(state, { payload }) {
  return {
    ...state,
    alarms: [
      ...state.alarms,
      {
        ...initialAlarm,
        id: state.alarms.length,
        time: payload
      }
    ]
  };
}

function onRemoveAlarm(state, { payload }) {
  return {
    ...state,
    alarms: state.alarms.filter((item) => item.id !== payload)
  };
}

function onToggleAlarm(state, { payload }) {
  return {
    ...state,
    alarms: state.alarms.map((item) => {
      if (item.id === payload) {
        return {
          ...item,
          enabled: !item.enabled
        };
      }

      return item;
    })
  };
}

function onToggleDay(state, { payload }) {
  return {
    ...state,
    alarms: state.alarms.map((item) => {
      if (item.id === payload.alarmId) {
        return {
          ...item,
          days: {
            ...item.days,
            [payload.dayId]: (!item.days[payload.dayId])
          }
        };
      }

      return item;
    })
  };
}

const actionMap = {
  [ADD_ALARM]: onAddAlarm,
  [REMOVE_ALARM]: onRemoveAlarm,
  [TOGGLE_ALARM]: onToggleAlarm,
  [TOGGLE_DAY]: onToggleDay
};

export default function(state = initialState, action) {
  if (actionMap.hasOwnProperty(action.type)) {
    return actionMap[action.type](state, action);
  }

  return state;
}
