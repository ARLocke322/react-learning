import { useState } from "react";
import { EntryFormValues, HealthCheckRating } from '../types';


const EntryForm = ({ addEntry }: { addEntry: (entry: EntryFormValues) => void }) => {
  // Basic entry fields
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [type, setType] = useState('');

  // Health Check specific
  const [healthRating, setHealthRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  // Hospital entry specific
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  // Occupational Healthcare specific
  const [employer, setEmployer] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');


  const submit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log('submit');
    /*
    event.preventDefault();
    const newDiary = {
      date,
      weather,
      visibility,
      comment
    };
    addDiary(newDiary);
    setDate('');
    setWeather(Weather.Sunny);
    setVisibility(Visibility.Great);
    setComment('');
    */

    if (!description || !date || !specialist || !type) {
      alert('Please fill in all required fields');
      return;
    }

    // Type-specific validation
    if (type === "Hospital" && (!dischargeDate || !dischargeCriteria)) {
      alert('Please fill in discharge date and criteria');
      return;
    }

    if (type === "OccupationalHealthcare" && !employer) {
      alert('Please fill in employer name');
      return;
    }

    switch (type) {
      case "HealthCheck":
        const newHealthCheckEntry = {
          description,
          date,
          specialist,
          diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
          type: "HealthCheck" as const,
          healthCheckRating: healthRating
        };
        addEntry(newHealthCheckEntry);
        setDescription('');
        setDate('');
        setSpecialist('');
        setDiagnosisCodes([]);
        setType('');
        // Reset HealthCheck specific field
        setHealthRating(HealthCheckRating.Healthy);
        break;
      case "Hospital":
        const newHospitalEntry = {
          description,
          date,
          specialist,
          diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
          type: "Hospital" as const,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
        addEntry(newHospitalEntry);
        // Reset common fields
        setDescription('');
        setDate('');
        setSpecialist('');
        setDiagnosisCodes([]);
        setType('');
        // Reset Hospital specific fields
        setDischargeDate('');
        setDischargeCriteria('');
        break;
      case "OccupationalHealthcare":
        const newOccupationalEntry = {
          description,
          date,
          specialist,
          diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
          type: "OccupationalHealthcare" as const,
          employerName: employer,
          sickLeave: (sickLeaveStart && sickLeaveEnd) ? {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd
          } : undefined
        };
        addEntry(newOccupationalEntry);
        setDescription('');
        setDate('');
        setSpecialist('');
        setDiagnosisCodes([]);
        setType('');
        // Reset OccupationalHealthcare specific fields
        setEmployer('');
        setSickLeaveStart('');
        setSickLeaveEnd('');
        break;
      default:
        console.error("Invalid entry type");

    }
  };

  const additionalOptions = () => {
    if (type === "Hospital") {
      return (
        <div>
          <div>
            discharge date
            <input
              type="date"
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
          </div>
          <div>
            discharge criteria
            <input
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </div>
        </div>
      );
    } else if (type === "HealthCheck") {
      return (
        <div>
          health rating
          <select value={healthRating} onChange={({ target }) => setHealthRating(Number(target.value) as HealthCheckRating)}>
            <option key={HealthCheckRating.Healthy} value={HealthCheckRating.Healthy}>Healthy</option>
            <option key={HealthCheckRating.LowRisk} value={HealthCheckRating.LowRisk}>Low Risk</option>
            <option key={HealthCheckRating.HighRisk} value={HealthCheckRating.HighRisk}>High Risk</option>
            <option key={HealthCheckRating.CriticalRisk} value={HealthCheckRating.CriticalRisk}>Critical Risk</option>
          </select>
        </div>
      );
    } else {
      return (
        <div>
          <div>
            employer
            <input
              value={employer}
              onChange={({ target }) => setEmployer(target.value)}
            />
          </div>
          <div>
            sick leave start date
            <input
              type="date"
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
            />
          </div>
          <div>
            sick leave end date
            <input
              type="date"
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <h3>Add new entry</h3>
      <form onSubmit={submit}>
        <div>
          description
          <input
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </div>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          specialist
          <input
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
          />
        </div>

        <div>
          type
          <select onChange={({ target }) => setType(target.value)}>
            <option key={"Hospital"} value={"Hospital"}>Hospital</option>
            <option key={"HealthCheck"} value={"HealthCheck"}>HealthCheck</option>
            <option key={"OccupationalHealthcare"} value={"OccupationalHealthcare"}>OccupationalHealthcare</option>
          </select>
        </div>

        <div>
          diagnosis codes (comma separated)
          <input
            type="text"
            value={diagnosisCodes.join(', ')}
            placeholder="e.g. Z00.00, K35.9, M54.5"
            onChange={({ target }) => {
              const codes = target.value
                .split(',')
                .map(code => code.trim())
                .filter(code => code.length > 0);
              setDiagnosisCodes(codes);
            }}
          />
        </div>
        {additionalOptions()}


        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default EntryForm;