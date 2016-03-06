import { deviceId, accessToken } from './private.js';

export function setTime(alarmTime) {
  const body = `access_token=${encodeURIComponent(accessToken)}&args=${encodeURIComponent(alarmTime)}`;
  console.log('sending time', body);

  fetch(`https://api.particle.io/v1/devices/${deviceId}/alarmTime`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body
  }).catch((error) => {
    console.warn(error);
  }).then((response) => {
    console.log(response);
  });
}
