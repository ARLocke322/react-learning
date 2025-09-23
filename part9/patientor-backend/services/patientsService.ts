import { NonSensitivePatient, Patient, NewPatient, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';
import patients from '../data/patients';

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return patients.map(({ssn, entries, ...patient}) => patient);
};

const getPatient = (id: string): Patient | undefined => {
  const patientFound = patients.find(patient => patient.id === id);
  return patientFound;
 
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Entry | undefined=> {
  const patient = getPatient(id);
  const newEntry = {
    id: uuid(),
    ...entry
  };
  if (patient) {
    patient.entries.push(newEntry);
  }
  
  return newEntry;
};

export default {
  getNonSensitiveEntries,
  getPatient,
  addPatient,
  addEntry
};