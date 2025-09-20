import express from 'express';
import qs from 'qs';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';


const app = express();

app.use(express.json());

app.set('query parser',
    (str: string) => qs.parse(str));

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    // Validate directly in route
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (!req.query.height || !req.query.weight) {
        return res.status(400).json({ error: 'Height and weight are required' });
    }

    if (isNaN(height) || isNaN(weight)) {
        return res.status(400).json({ error: 'Height and weight must be valid numbers' });
    }

    if (height <= 0 || weight <= 0) {
        return res.status(400).json({ error: 'Height and weight must be positive' });
    }

    const bmi = calculateBmi(height, weight);
    return res.json({ height, weight, bmi });
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {daily_exercises, target} = req.body;

    if (!daily_exercises || !target) {
        return res.status(400).send({error: 'parameters missing'});
    }

    if (!Array.isArray(daily_exercises) || daily_exercises.some(e => isNaN(Number(e))) || isNaN(Number(target))) {
        return res.status(400).send({error: 'malformatted parameters'});
    }

    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const exerciseReport = calculateExercises(daily_exercises, target);
    return res.json(exerciseReport);
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});