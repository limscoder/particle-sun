import {
  REVIVE_ALARMS,
  ADD_ALARM,
  REMOVE_ALARM,
  TOGGLE_ALARM,
  TOGGLE_DAY,
  UPDATE_ALARM
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

function updateAlarmWithId(state, alarmId, func) {
  return state.alarms.map((item) => {
    if (item.id === alarmId) {
      return func(item);
    }

    return item;
  });
}

function onReviveAlarms(state, { payload }) {
  return payload || initialState;
}

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
    alarms: updateAlarmWithId(state, payload, (item) => {
      return {
        ...item,
        enabled: !item.enabled
      };
    })
  };
}

function onToggleDay(state, { payload }) {
  return {
    ...state,
    alarms: updateAlarmWithId(state, payload.alarmId, (item) => {
      return {
        ...item,
        days: {
          ...item.days,
          [payload.dayId]: (!item.days[payload.dayId])
        }
      };
    })
  };
}

function onUpdateAlarm(state, { payload }) {
  return {
    ...state,
    alarms: updateAlarmWithId(state, payload.alarmId, (item) => {
      return {
        ...item,
        time: payload.time
      };
    })
  };
}

function getUTCTime(day, minutes) {
  const maxMinutes = 24 * 60;
  const offset = new Date().getTimezoneOffset();
  let offsetTime;
  if (offset < 0) {
    offsetTime = minutes + offset;
    if (offsetTime < 0) {
      day -= 1;
      offsetTime = maxMinutes + offsetTime;
    }
  } else {
    offsetTime = offset + minutes;
    if (offsetTime > maxMinutes) {
      day += 1;
      offsetTime -= maxMinutes;
    }
  }

  if (day > 6) {
    day = 0;
  }

  if (day < 0) {
    day = 6;
  }

  return {
    day: (day + 1),
    seconds: (offsetTime * 60)
  };
}

function getAlarmTimeString(alarm) {
  return Object.keys(alarm.days).reduce((acc, day) => {
    if (alarm.days[day]) {
      const utcTime = getUTCTime(parseInt(day, 10), alarm.time);
      acc.push(utcTime.day.toString());
      acc.push(utcTime.seconds.toString());
    }
    return acc;
  }, []);
}

const actionMap = {
  [REVIVE_ALARMS]: onReviveAlarms,
  [ADD_ALARM]: onAddAlarm,
  [REMOVE_ALARM]: onRemoveAlarm,
  [TOGGLE_ALARM]: onToggleAlarm,
  [TOGGLE_DAY]: onToggleDay,
  [UPDATE_ALARM]: onUpdateAlarm
};

export default function(state = initialState, action) {
  if (actionMap.hasOwnProperty(action.type)) {
    return actionMap[action.type](state, action);
  }

  return state;
}

export function getTimeString(state) {
  return state.alarms.reduce((acc, alarm) => {
    if (alarm.enabled) {
      return acc.concat(getAlarmTimeString(alarm));
    }
    return acc;
  }, []).join('-');
}
