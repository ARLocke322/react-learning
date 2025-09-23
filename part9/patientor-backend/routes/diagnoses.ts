import express from 'express';
import diagnosesService from '../services/diagnosesService';
import { Diagnosis } from '../types';
import { Response } from 'express';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
    res.send(diagnosesService.getEntries());
});

export default router;