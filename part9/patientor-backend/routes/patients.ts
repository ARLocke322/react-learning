import express from 'express';
import patientsService from '../services/patientsService';
import { NewPatient, NonSensitivePatient, Patient } from '../types';
import { Response, Request, NextFunction } from 'express';
import z from 'zod';
import newPatientSchema from '../utils';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
    res.send(patientsService.getNonSensitiveEntries());
});

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
    } else {
        next(error);
    }
};

router.post('/', (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const newPatient = newPatientSchema.parse(req.body);
    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
});

router.use(errorMiddleware);

export default router;