import {
  ADD_ALARM,
  REMOVE_ALARM,
  TOGGLE_ALARM,
  TOGGLE_DAY
} from './ActionTypes';

export function addAlarm(time) {
  return {
    type: ADD_ALARM,
    payload: time
  };
}

export function removeAlarm(alarmId) {
  return {
    type: REMOVE_ALARM,
    payload: alarmId
  };
}

export function toggleAlarm(alarmId) {
  return {
    type: TOGGLE_ALARM,
    payload: alarmId
  };
}

export function toggleDay(alarmId, dayId) {
  return {
    type: TOGGLE_DAY,
    payload: {
      alarmId,
      dayId
    }
  };
}
