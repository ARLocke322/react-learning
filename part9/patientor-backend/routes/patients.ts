import express from 'express'
import patientsService from '../services/patientsService';
import { NonSensitivePatient } from '../types';
import { Response } from 'express';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
    res.send(patientsService.getNonSensitiveEntries())
})

router.post('/', (req, res) => {
    const {name, dateOfBirth, ssn, gender, occupation} = req.body;
    const addedPatient = patientsService.addPatient({
        name,
        dateOfBirth,
        ssn,
        gender,
        occupation
    })
    res.json(addedPatient)
})

export default router