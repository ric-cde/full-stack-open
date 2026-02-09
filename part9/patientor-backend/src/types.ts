// Domain types

export type Diagnosis = {
	code: string
	name: string
	latin?: string
}

export type Patient = {
	id: string
	name: string
	dateOfBirth: string
	ssn: string
	gender: Gender
	occupation: string
}

export enum Gender {
	Male = "male",
	Female = "female",
	Other = "other",
}

export type NewPatient = Omit<Patient, "id">

export type RedactedPatient = Omit<Patient, "ssn">

// Express-related types

export type ErrorResponse = { error: string }
