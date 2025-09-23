import express from 'express';
import patientsService from '../services/patientsService';
import { Entry, NewEntry, NewPatient, NonSensitivePatient, Patient } from '../types';
import { Response, Request, NextFunction } from 'express';
import z from 'zod';
import { newPatientSchema, newEntrySchema } from '../utils';

const router = express.Router();

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
    } else {
        next(error);
    }
};

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
    res.send(patientsService.getNonSensitiveEntries());
});

router.get('/:id', (req, res: Response<Patient | undefined>) => {
    const { id } = req.params;
    res.send(patientsService.getPatient(id));
});


router.post('/', (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>, next: NextFunction) => {
    try {
        const newPatient = newPatientSchema.parse(req.body);
        const addedPatient = patientsService.addPatient(newPatient);
        res.json(addedPatient);
    } catch (error) {
        next(error);
    }

});

router.post('/:id/entries', (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>, next: NextFunction) => {
    try {
        const { id } = req.params;
        const newEntry = newEntrySchema.parse(req.body);
        const addedEntry = patientsService.addEntry(id, newEntry);
        res.json(addedEntry);
    } catch (error) {
        next(error);
    }

});

router.use(errorMiddleware);

export default router;