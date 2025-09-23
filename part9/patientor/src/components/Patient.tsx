import { Patient, Entry, Diagnosis, EntryFormValues } from "../types";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkOffIcon from '@mui/icons-material/WorkOff';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import patientService from '../services/patients';
import diagnosisService from '../services/diagnoses';
import EntryForm from "./EntryForm";

const DiagnosisView = ({ diagnosis }: { diagnosis: Diagnosis }) => {
    console.log(diagnosis);
    return (
        <li>{diagnosis.code} {diagnosis.name}</li>
    );
};

const EntryView = ({ entry, diagnoses }: { entry: Entry, diagnoses: Diagnosis[] }) => {
    const boxStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px 0',
        backgroundColor: '#f9f9f9'
    };
    switch (entry.type) {
        case "HealthCheck": {
            const getHeartColor = (rating: number) => {
                switch (rating) {
                    case 0: return "success"; // Green - healthy
                    case 1: return "warning"; // Orange - ok
                    case 2: return "error";   // Red - critical
                    case 3: return "disabled"; // Grey - unknown
                    default: return "inherit";
                }
            };
            return (
                <div style={boxStyle}>
                    <p>{entry.date} <MedicalServicesIcon /></p>
                    <p>{entry.description}</p>
                    <FavoriteIcon color={getHeartColor(entry.healthCheckRating)} />
                    <p>diagnosed by {entry.specialist}</p>
                </div>
            );
        }
        case "Hospital": {
            return (
                <div style={boxStyle}>
                    <p>{entry.date} <WorkOffIcon /> </p>
                    <p>{entry.description}</p>
                    <ul>
                        {entry.diagnosisCodes?.map(code => {
                            const diagnosisFound = diagnoses.find(diagnosis => diagnosis.code === code);
                            if (diagnosisFound) return <DiagnosisView key={diagnosisFound.code} diagnosis={diagnosisFound} />;
                            else return null;
                        })}
                    </ul>
                    <p>diagnosed by {entry.specialist}</p>
                </div>
            );
        }
        case "OccupationalHealthcare": {
            return (
                <div style={boxStyle}>
                    <p>{entry.date} <WorkIcon /> {entry.employerName}</p>
                    <p>{entry.description}</p>
                    <ul>
                        {entry.diagnosisCodes?.map(code => {
                            const diagnosisFound = diagnoses.find(diagnosis => diagnosis.code === code);
                            if (diagnosisFound) return <DiagnosisView key={diagnosisFound.code} diagnosis={diagnosisFound} />;
                            else return null;
                        })}
                    </ul>
                    <p>diagnosed by {entry.specialist}</p>
                </div>
            );
        }

    }
};

const PatientView = () => {
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);



    useEffect(() => {
        if (id) {
            const fetchPatient = async () => {
                try {
                    const fetchedPatient = await patientService.getById(id);
                    const fetchedDiagnoses = await diagnosisService.getAll();
                    setDiagnoses(fetchedDiagnoses);
                    setPatient(fetchedPatient);
                } catch (error) {
                    console.error('Error fetching patient:', error);
                }
            };
            void fetchPatient();
        }
    }, [id]);

    if (!patient || !diagnoses) {
        return <div>Loading...</div>;
    }

    const addEntry = async (entry: EntryFormValues) => {
        if (!id) return;
        try {
            const newEntry = await patientService.createEntry(entry, id);
            setPatient({
                ...patient,
                entries: patient.entries.concat(newEntry)
            });
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    const getGenderIcon = () => {
        if (patient.gender === 'male') {
            return <MaleIcon />;
        } else if (patient.gender === 'female') {
            return <FemaleIcon />;
        }
    };

    return (
        <div>
            <h2>{patient.name} {getGenderIcon()}</h2>
            <p>ssn: {patient.ssn}</p>
            <p>occupation: {patient.occupation}</p>

            <b>entries</b>
            {patient.entries.map(entry => <EntryView key={entry.id} entry={entry} diagnoses={diagnoses} />)}
            
            <EntryForm addEntry={addEntry}/>
        </div>
    );
};

export default PatientView;