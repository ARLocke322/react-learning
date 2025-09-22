import z from "zod";
import { Gender } from "./types";

const newPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.iso.date().optional(),
    ssn: z.string().optional(),
    gender: z.enum(Gender),
    occupation: z.string()
});

export default newPatientSchema;