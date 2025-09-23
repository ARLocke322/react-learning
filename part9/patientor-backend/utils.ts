import z from "zod";
import { HealthCheckRating, Gender } from "./types";

export const newPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.iso.date().optional(),
    ssn: z.string().optional(),
    gender: z.enum(Gender),
    occupation: z.string(),
    entries: z.array(z.string()).optional()
});



const baseEntrySchema = z.object({
    description: z.string(),
    date: z.iso.date(), // ISO date string
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional()
});

// Health check entry schema
const healthCheckEntrySchema = baseEntrySchema.extend({
    type: z.literal("HealthCheck"),
    healthCheckRating: z.enum(HealthCheckRating)
});

// Hospital entry schema
const hospitalEntrySchema = baseEntrySchema.extend({
    type: z.literal("Hospital"),
    discharge: z.object({
        date: z.iso.date(),
        criteria: z.string()
    })
});

// Occupational healthcare entry schema
const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
    type: z.literal("OccupationalHealthcare"),
    employerName: z.string(),
    sickLeave: z.object({
        startDate: z.iso.date(),
        endDate: z.iso.date()
    }).optional()
});

// Union schema for all entry types
export const newEntrySchema = z.discriminatedUnion("type", [
    healthCheckEntrySchema,
    hospitalEntrySchema,
    occupationalHealthcareEntrySchema
]);
