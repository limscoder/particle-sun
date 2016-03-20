#include "InternetButton/InternetButton.h"
#include "math.h"

int button1 = 4;
int button2 = 5;
int button3 = 6;
int button4 = 7;

bool lightIsOn = false;
bool alarmIsActive = false;
int alarmDisabledTime = 0;
int ledCount = 12;
int lastButtonPress = 0;
char alarmTimes[512] = "";

int alarmDuration = 300;
int riseDuration = floor(alarmDuration * .18);
int greenDuration = floor(alarmDuration * .33);
int blueDuration = floor(alarmDuration * .13);
int whiteDuration = floor(alarmDuration * .15);
int blinkDuration = floor(alarmDuration *.09);
int blinkFastDuration = floor(alarmDuration * .09);
int buzzDuration = 60 * 5;

InternetButton b = InternetButton();

int setAlarmTimes(String command);

void setup() {
    alarmDisabledTime = Time.now();
    b.begin();

    attachInterrupt(button1, onButton, FALLING);
    attachInterrupt(button2, onButton, FALLING);
    attachInterrupt(button3, onButton, FALLING);
    attachInterrupt(button4, onButton, FALLING);
    Particle.function("alarmTime", setAlarmTimes);

    RGB.control(true);
    RGB.brightness(0);
}

void loop() {
    alarmIfTimesAreActive();
}

void onButton() {
    if (millis() - lastButtonPress > 300) { // debounce
        lastButtonPress = millis();
        if (alarmIsActive) {
            disableAlarm();
        } else {
            toggleLight();
        }
    }
}

void disableAlarm() {
    alarmIsActive = false;
    alarmDisabledTime = Time.now();
    b.allLedsOff();
}

void toggleLight() {
    if (lightIsOn) {
        lightIsOn = false;
        turnLightOff();
    } else {
        lightIsOn = true;
        turnLightOn();
    }
}

void turnLightOn() {
    b.allLedsOn(255, 255, 255);
}

void turnLightOff() {
    b.allLedsOff();
}

void animateAlarm(int secondsPastAlarm) {
    int greenStart = riseDuration;
    int blueStart = greenStart + greenDuration;
    int whiteStart = blueStart + blueDuration;
    int blinkStart = whiteStart + whiteDuration;
    int blinkFastStart = blinkStart + blinkDuration;
    int buzzStart = blinkFastStart + blinkFastDuration;
    int alarmTimeout = buzzStart + buzzDuration;

    if (secondsPastAlarm > alarmTimeout) {
        // way past alarm, turn off
        b.allLedsOff();
    } else if (secondsPastAlarm > buzzStart) {
        animateBuzz();
    } else if (secondsPastAlarm > blinkFastStart) {
        animateBlink(750, 500);
    } else if (secondsPastAlarm > blinkStart) {
        animateBlink(1500, 750);
    } else if (secondsPastAlarm > whiteStart) {
        b.allLedsOn(255, 255, 255);
    } else if (secondsPastAlarm > blueStart) {
        animateBlue(secondsPastAlarm - blueStart);
    } else if (secondsPastAlarm > greenStart) {
        animateGreen(secondsPastAlarm - greenStart);
    } else {
        animateRise(secondsPastAlarm);
    }
}

void animateBuzz() {
    b.allLedsOn(255, 255, 255);
    delay(750);
    b.allLedsOff();
    b.playSong("C4,8,E4,8,G4,8,C5,8,G5,4");
    delay(500);
}

void animateBlink(int onDuration, int offDuration) {
    b.allLedsOn(255, 255, 255);
    delay(onDuration);
    b.allLedsOff();
    delay(offDuration);
}

void animateBlue(int animationSeconds) {
    int red = 255;
    int green = 255;
    int blue = 0;
    int frameRange = (255 - blue) / blueDuration;
    blue += frameRange * animationSeconds;

    b.allLedsOn(red, green, blue);
}

void animateGreen(int animationSeconds) {
    int red = 255;
    int green = 35;
    int blue = 0;
    int frameRange = (255 - green) / greenDuration;
    green += frameRange * animationSeconds;

    b.allLedsOn(red, green, blue);
}

void animateRise(int animationSeconds) {
    int red = 255;
    int green = 35;
    int blue = 0;
    int frameTime = riseDuration / 5;

    if (animationSeconds > (frameTime * 4)) {
        b.ledOn(1, red, green, blue);
        b.ledOn(11, red, green, blue);
    }

    if (animationSeconds > (frameTime * 3)) {
        b.ledOn(2, red, green, blue);
        b.ledOn(10, red, green, blue);
    }

    if (animationSeconds > (frameTime * 2)) {
        b.ledOn(3, red, green, blue);
        b.ledOn(9, red, green, blue);
    }

    if (animationSeconds > frameTime) {
        b.ledOn(4, red, green, blue);
        b.ledOn(8, red, green, blue);
    }

    b.ledOn(5, red, green, blue);
    b.ledOn(6, red, green, blue);
    b.ledOn(7, red, green, blue);
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

void alarmIfActive(int day, int alarmTime) {
    if (day == Time.weekday()) {
        int secondsPastAlarm = getSecondsPastAlarm(alarmTime);
        alarmIsActive = secondsPastAlarm > 0;
        if (alarmIsActive) {
            animateAlarm(secondsPastAlarm);
        }
    }
}

void alarmIfTimesAreActive() {
    char alarmSeparator[2] = "-";
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
            day = strtol(dayToken, NULL, 10);
            seconds = strtol(secondsToken, NULL, 10);
            alarmIfActive(day, seconds);
            isDay = true;
        }

        token = strtok(NULL, alarmSeparator);
    }
}

int setAlarmTimes(String command) {
    if (command.length() < 512) {
        // TODO: input validation
        command.toCharArray(alarmTimes, 512);
        return 1;
    }

    return -1;
}
