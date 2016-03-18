import { Dimensions } from 'react-native';

const backgroundColor = '#1A237E';
const textColor = '#E8EAF6';

export const app = {
  backgroundColor,
  flex: 1,
  elevation: 1
};

export const alarmList = {
};

const roundButtonRadius = 42;
const centerWidth = (Dimensions.get('window').width / 2) - (roundButtonRadius / 2);
export const centerButton = {
  position: 'absolute',
  left: centerWidth,
  bottom: 15
};

export const roundButton = {
  backgroundColor: '#009688',
  width: roundButtonRadius,
  height: roundButtonRadius,
  borderRadius: roundButtonRadius
};

export const buttonText = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 42,
  textAlign: 'center'
};

export const addButtonText = {
  color: 'white',
  fontSize: 24,
  left: 14,
  top: 4
};

export const alarm = {
  margin: 10,
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#5C6BC0'
};

export const inactiveAlarm = {
  ...alarm,
  opacity: 0.5
};

export const alarmTop = {
  alignItems: 'center',
  flexDirection: 'row'
};

export const alarmSwitch = {};

export const alarmLeft = {};

export const alarmRight = {
  alignItems: 'flex-end',
  flex: 1,
  flexDirection: 'row'
};

export const alarmBottom = {
  flexDirection: 'row',
  alignItems: 'center'
};

export const clock = {
  flexDirection: 'row'
};

export const clockTime = {
  color: textColor,
  fontSize: 48
};

export const clockPm = {
  color: textColor,
  fontSize: 24,
  marginLeft: 5,
  marginTop: 24
};

const day = {
  margin: 6,
  height: 36,
  width: 36,
  borderRadius: 18,
  borderWidth: 2,
  borderColor: textColor
};

export const activeDay = {
  ...day,
  backgroundColor: textColor,
};

export const inactiveDay = {
  ...day,
  backgroundColor
}

const dayText = {
  marginTop: 6,
  textAlign: 'center',
  fontWeight: 'bold'
};

export const activeDayText = {
  ...dayText,
  color: backgroundColor
};

export const inactiveDayText = {
  ...dayText,
  color: textColor
};

export const deleteAlarm = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginRight: 10
};

export const icon = {
  color: textColor,
  height: 32,
  width: 32
};
