import WorkoutProvider from "./Context/workoutProvider";
import { IDatesResponse, ISet, IUserProfile, IWorkout } from "./interfaces";
import Workout from "./Pages/workout";

export function calculateBMI(height: number, weight: number) {
  return weight / ((height * height) / 10000);
}

//function to calculate calories burn
// weight x MET x 0.0175 x Mins
export function calculateSetCalories(weight: number, exer: string, mins: number) {
  let MET: number;
  switch (exer) {
    case "squats":
      MET = 5.5;
      break;
    case "push-ups":
      MET = 8;
      break;
    case "lunges":
      MET = 6;
      break;
    case "jumping-jacks":
      MET = 8;
      break;
    case "side-squats":
      MET = 6;
      break;
    default:
      MET = 0;
  }
  return weight * MET * 0.0175 * mins; //total calories of an exercise
}

export function calculateWorkoutCalories(workout: ISet[], profile: IDatesResponse, duration: number) {
  let res: number = 0;
  for (let i = 0; i < workout.length; i++) {
    res += calculateSetCalories(profile.weight, workout[i].exer, duration);
  }
  return Math.round(res);
}

export function calculateRepCalories(weight: number, exer: string, mins: number) {
  return calculateSetCalories(weight, exer, mins) / mins / 30; //calories burnt per repetition
}

export function calculateSetTime(workout: ISet) {
  const restSeconds = workout.rest * 60;
  return workout.reps * 2 + restSeconds;
}

export function calculateWorkoutTime(workout: ISet[]) {
  let res: number = 0;
  for (let i = 0; i < workout.length; i++) {
    res += calculateSetTime(workout[i]);
  }
  if (res < 60) res = 60;
  return Math.round(res / 60);
}

export function calculateSetDifficulty(workout: ISet) {
  let difficulty: number = 0;
  if (workout.reps < 10) return (difficulty = 0.5);
  if (workout.reps < 20) return (difficulty = 1);
  if (workout.reps < 30) return (difficulty = 2);
  if (workout.reps < 40) return (difficulty = 3);
  if (workout.reps < 50) return (difficulty = 4);
  if (workout.reps < 60) return (difficulty = 5);
  return difficulty;
}

export function calculateWorkoutDifficulty(workout: ISet[]) {
  let res: number = 0;
  for (let i = 0; i < workout.length; i++) {
    res += calculateSetDifficulty(workout[i]);
  }
  return Math.round((res / workout.length) * 10) / 10;
}
