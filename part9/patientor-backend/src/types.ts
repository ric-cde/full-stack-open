import { newPatientSchema } from "./utils.ts"
import { z } from "zod"

// Special utility type which removes properties from nested types
// e.g. type EntryWithoutId = UnionOmit<Entry, 'id'>;
type UnionOmit<T, K extends string | number | symbol> = T extends unknown
	? Omit<T, K>
	: never

// Domain types
export type Diagnosis = {
	code: string
	name: string
	latin?: string
}

interface BaseEntry {
	id: string
	date: string
	specialist: string
	description: string
	diagnosisCodes?: Array<Diagnosis["code"]>
}

export enum HealthCheckRating {
	"Healthy" = 0,
	"LowRisk" = 1,
	"HighRisk" = 2,
	"CriticalRisk" = 3,
}

interface HealthCheckEntry extends BaseEntry {
	type: "HealthCheck"
	healthCheckRating: HealthCheckRating
}

export type SickLeave = {
	startDate: string
	endDate: string
}

interface OccupationalHealthcareEntry extends BaseEntry {
	type: "OccupationalHealthcare"
	employerName: string
	sickLeave?: SickLeave
}

export type Discharge = {
	date: string
	criteria: string
}

interface HospitalEntry extends BaseEntry {
	type: "Hospital"
	discharge?: {
		date: string
		criteria: string
	}
}

export type Entry =
	| HospitalEntry
	| OccupationalHealthcareEntry
	| HealthCheckEntry

export interface Patient {
	id: string
	name: string
	dateOfBirth: string
	ssn: string
	gender: Gender
	occupation: string
	entries: Entry[]
}

export type NewEntry = UnionOmit<Entry, "id">

export const genderEnum = z.enum(["male", "female", "other"])
export type Gender = z.infer<typeof genderEnum>

// export type NewPatient = Omit<Patient, "id">
export type NewPatient = z.infer<typeof newPatientSchema>

export type RedactedPatient = Omit<Patient, "ssn" | "entries">

// Express-related types

export type ErrorResponse = { error: string }

// export const healthCheckRating = {
// 	Healthy: 0,
// 	LowRisk: 1,
// 	HighRisk: 2,
// 	CriticalRisk: 3,
// } as const

// export type HealthCheckRating =
// 	(typeof healthCheckRating)[keyof typeof healthCheckRating]
