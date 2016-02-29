int ledOut = D0;
int buttonIn = D1;
int buzzerOut = D2;
int alarmDisabledTime = 1;
bool alarmIsActive = false;
bool lightIsActive = false;
char alarmTimes[512] = "";
char message[64];

int setAlarmTimes(String command);

void setup()
{
    pinMode(ledOut, OUTPUT);
    pinMode(buzzerOut, OUTPUT);
    
    pinMode(buttonIn, INPUT_PULLDOWN); 
    
    digitalWrite(ledOut, LOW);
    digitalWrite(buzzerOut, LOW);
    attachInterrupt(buttonIn, onButton, RISING);
    
    setAlarmTimes(String("2:200"));
    Particle.function("alarmTime", setAlarmTimes);
    
    // int now = Time.now();
    // alarmDisabledTime = now;
}

void loop()
{
    alarmIfTimesAreActive();
}

void onButton() {
    if (alarmIsActive) {
        disableAlarm();
    } else {
        toggleLight();
    }
}

void disableAlarm() {
    digitalWrite(buzzerOut, LOW);
    digitalWrite(ledOut, LOW);
    alarmDisabledTime = Time.now();
    alarmIsActive = false;
    lightIsActive = false;
}

void toggleLight() {
    if (lightIsActive) {
        digitalWrite(ledOut, LOW);
        lightIsActive = false;
    } else {
        digitalWrite(ledOut, HIGH);
        lightIsActive = true;
    }
}

bool isSameDay(int firstTime, int secondTime) {
    int difference = secondTime - firstTime;
    int dayDifference = 24 * 60 * 60;
    return abs(difference) < dayDifference;
}

int getSecondsFromStartOfDay(int epochTime) {
    return (Time.hour(epochTime) * 60 * 60) + (Time.minute(epochTime) * 60) + Time.second(epochTime);
}

int getSecondsPastAlarm(int alarmTime) {
    int now = Time.now();
    int alarmDisabledToday = isSameDay(alarmDisabledTime, now) ? getSecondsFromStartOfDay(alarmDisabledTime) : 0;
    int alarmIsActive = alarmDisabledToday < alarmTime;
    if (alarmIsActive) {
        return getSecondsFromStartOfDay(now) - alarmTime;
    }
    
    return -1;
}

void blink(int blinkOnInterval, int blinkOffInterval) {
  digitalWrite(ledOut, HIGH);
  delay(blinkOnInterval);
  digitalWrite(ledOut, LOW);
  delay(blinkOffInterval);
}

void animateAlarm(int secondsPastAlarm) {
    if (lightIsActive || (secondsPastAlarm > 120)) {
        blink(100, 100);
    } else if (secondsPastAlarm > 90) {
        blink(250, 250);
    } else if (secondsPastAlarm > 60) {
        blink(500, 500);
    } else if (secondsPastAlarm > 45) {
        blink(1000, 750);
    } else if (secondsPastAlarm > 30) {
        blink(2000, 1000);
    } else if (secondsPastAlarm > 0) {
        blink(30000, 0);
    }
}

void buzz(int secondsPastAlarm) {
    if (secondsPastAlarm > 180) {
        if (secondsPastAlarm % 4 == 0) {
            digitalWrite(buzzerOut, LOW);
        } else if (secondsPastAlarm % 2 == 0) {
            digitalWrite(buzzerOut, HIGH);
        }
    }
}

void alarmIfActive(int day, int alarmTime) {
    if (day == Time.weekday()) {
        int secondsPastAlarm = getSecondsPastAlarm(alarmTime);
        alarmIsActive = secondsPastAlarm > 0;
        if (alarmIsActive) {
            buzz(secondsPastAlarm);
            animateAlarm(secondsPastAlarm);
        }
    }
}

void alarmIfTimesAreActive() {
    const char alarmSeparator[2] = ":";
    char alarmString[512];
    strcpy(alarmString, alarmTimes);
    
    bool isDay = true;
    char *token = NULL;
    char *dayToken = NULL;
    char *secondsToken = NULL;
    int day = 0;
    int seconds = 0;
    
    token = strtok(alarmString, alarmSeparator);
    while(token != NULL) {
        if (isDay) {
            dayToken = token;
            isDay = false;
        } else {
            secondsToken = token;
            // TODO: input validation
            day = strtol(dayToken, NULL, 10);
            seconds = strtol(secondsToken, NULL, 10);
            alarmIfActive(day, seconds);
        }
        
        token = strtok(NULL, alarmSeparator);
    }
}

int setAlarmTimes(String command) {
    if (command.length() < 512) {
        command.toCharArray(alarmTimes, 512);
        return 1;
    }
    
    return -1;
}
