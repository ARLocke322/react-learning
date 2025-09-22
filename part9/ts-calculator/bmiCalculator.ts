export const calculateBmi = (height: number, weight: number): string => {
  const heightInMetres = height / 100;
  const bmi = weight / (heightInMetres ** 2);

  if (bmi < 18.5) return "Underweight";
  else if (bmi >= 18.5 && bmi < 25) return "Normal Weight";
  else if (bmi >= 25 && bmi < 30) return "Overweight";
  else return "Obese";

};

interface ParsedBmiData {
  height: number;
  weight: number;
}

interface BmiArgs {
  height: string | number;
  weight: string | number;
}


const parseBmiArguments = (args: BmiArgs): ParsedBmiData => {
  if (!args.height) throw new Error('Height not provided');
  if (!args.weight) throw new Error('Weight not provided');

  if (!isNaN(Number(args.height)) && !isNaN(Number(args.weight))) {
    return {
      height: Number(args.height),
      weight: Number(args.weight),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};



if (require.main === module) {
  try {
    const { height, weight } = parseBmiArguments({ height: process.argv[2], weight: process.argv[3] });
    console.log({
      height,
      weight,
      bmi: calculateBmi(height, weight)
    });
  } catch (error: unknown) {
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage += 'Error: ' + error.message;
    }
    console.log({ error: errorMessage });
  }
}

