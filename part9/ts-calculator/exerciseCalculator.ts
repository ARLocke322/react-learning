interface result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: 1 | 2 | 3,
    ratingDescription: 'terrible' | 'not too bad but could be better' | 'good job'
    target: number,
    average: number,
}

export const calculateExercises = (dailyHours: number[], target: number): result => {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.reduce((a, c) => c !== 0 ? a + 1 : a, 0);

    const average = dailyHours.reduce((a, c) => a + c, 0) / periodLength;

    let success: boolean;
    let rating: 1 | 2 | 3;
    let ratingDescription: 'terrible' | 'not too bad but could be better' | 'good job';

    if (average > target) {
        success = true;
        rating = 3;
        ratingDescription = 'good job';

    } else if (average < target && average > target / 2) {
        success = false;
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    } else {
        success = false;
        rating = 1;
        ratingDescription = 'terrible';
    }
    
    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

interface ExerciseValues {
  value1: number[];
  value2: number;
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const argArray = args.map(arg => Number(arg)).slice(3);

  if (!isNaN(Number(args[2])) && !argArray.some(arg => isNaN(Number(arg)))) {
    return {
      value1: argArray,
      value2: Number(args[2])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

try {
  const { value1, value2 } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(value1, value2));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
