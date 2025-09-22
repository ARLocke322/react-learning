import patientsData from '../data/patients';
import { NonSensitivePatient, Patient, NewPatient } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientsData as Patient[];

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return patients.map(({ssn, ...patient}) => patient);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getNonSensitiveEntries,
  addPatient
};