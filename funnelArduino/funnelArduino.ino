#include <AccelStepper.h>


#define M1_IN1 8
#define M1_IN2 9
#define M1_IN3 10
#define M1_IN4 11

#define M2_IN1 4
#define M2_IN2 5
#define M2_IN3 6
#define M2_IN4 7


const long STEPS_PER_REV = 2048;


AccelStepper stepper1(AccelStepper::FULL4WIRE, M1_IN1, M1_IN3, M1_IN2, M1_IN4);
AccelStepper stepper2(AccelStepper::HALF4WIRE, M2_IN1, M2_IN3, M2_IN2, M2_IN4);


float m1_rpm = 18.0;
// float m1_rpm = 6.0;
float m2_rpm = 18.0;


long target1 = 0;
long target2 = 0;

double m1_frac_accum = 0.0;


float rpmToStepsPerSec(float rpm) {
  return (STEPS_PER_REV * rpm) / 60.0f;
}

// 유틸: 설정 적용
void applySpeeds() {
  stepper1.setAcceleration(3000.0);
  stepper2.setAcceleration(400.0);
  stepper1.setMaxSpeed(rpmToStepsPerSec(m1_rpm));
  stepper2.setMaxSpeed(rpmToStepsPerSec(m2_rpm));
}

void moveMotor1Deg36(float deg, int dir, float rpmF = 50, float rpmR = 50) {
 
  double ideal   = (deg / 360.0) * (double)STEPS_PER_REV;
  double desired = ideal + m1_frac_accum; 
  long   whole   = lround(desired);
  m1_frac_accum  = desired - (double)whole;

  float spsF = rpmToStepsPerSec(rpmF);
  float spsR = rpmToStepsPerSec(rpmR);

  long startPos = stepper1.currentPosition();
  long targetF  = startPos + dir * whole;

  stepper1.setSpeed((dir > 0) ? +spsF : -spsF);
  while ((dir > 0) ? (stepper1.currentPosition() < targetF)
                   : (stepper1.currentPosition() > targetF)) {
    stepper1.runSpeed();
  }

  long targetR = targetF - dir * whole;
  stepper1.setSpeed((dir > 0) ? -spsR : +spsR);
  while ((dir > 0) ? (stepper1.currentPosition() > targetR)
                   : (stepper1.currentPosition() < targetR)) {
    stepper1.runSpeed();
  }
}

void moveMotor2Deg720(int dir) {
  Serial.println("ACK");  

  const long steps = 2L * STEPS_PER_REV; 
  target2 += (long)dir * steps;
  stepper2.moveTo(target2);

  while (stepper2.distanceToGo() != 0) {
    stepper2.run();
  }


}


double m1_frac_accum_10 = 0.0; 


void moveMotor1Deg10(bool cw) {
  const double stepsIdeal = (10.0 / 360.0) * (double)STEPS_PER_REV; 
  const double desired    = stepsIdeal + m1_frac_accum_10;
  const long   whole      = lround(desired);
  m1_frac_accum_10        = desired - (double)whole; 

  const int dir = cw ? +1 : -1;
  target1 += dir * whole;
  stepper1.moveTo(target1);
}


void setup() {
  Serial.begin(115200);
  while (!Serial) { ; }

  applySpeeds();
  stepper1.setCurrentPosition(0);
  stepper2.setCurrentPosition(0);
  target1 = 0;
  target2 = 0;


}

void loop() {
  // 시리얼 입력 처리
  if (Serial.available()) {
    char c = Serial.read();
    // String c = Serial.readStringUntil('\n'); c.trim();

    if (c == '1') {
      moveMotor1Deg36(24.0f, -1);
    } 
    else if (c == '2') {
      moveMotor1Deg10(true);
    } 
    else if (c == '3') {
      moveMotor1Deg10(false);
    } 
    else if (c == '4') {
      moveMotor2Deg720(+2);
      Serial.println("DONE");

    } else if (c == '5') {
      moveMotor2Deg720(-2);
      Serial.println("DONE"); 
    } else if (c == '6') {
      moveMotor2Deg720(+1);
      Serial.println("DONE"); 
    }else if (c == '7') {
      moveMotor2Deg720(-1);
      Serial.println("DONE"); 
    }else if (c == 'a') {
      m1_rpm = max(2.0f, m1_rpm - 2.0f);
      applySpeeds();
      Serial.print(F("[M1] RPM -> "));
      Serial.println(m1_rpm, 1);
    } else if (c == 'z') {
      m1_rpm = min(60.0f, m1_rpm + 2.0f);
      applySpeeds();
      Serial.print(F("[M1] RPM -> "));
      Serial.println(m1_rpm, 1);
    } else if (c == 'k') {
      m2_rpm = max(2.0f, m2_rpm - 2.0f);
      applySpeeds();
      Serial.print(F("[M2] RPM -> "));
      Serial.println(m2_rpm, 1);
    } else if (c == 'm') {
      m2_rpm = min(60.0f, m2_rpm + 2.0f);
      applySpeeds();
      Serial.print(F("[M2] RPM -> "));
      Serial.println(m2_rpm, 1);
    } 
  }


  stepper1.run();
  stepper2.run();


}