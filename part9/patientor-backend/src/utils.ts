import type {
	NewPatient,
	NewEntry,
	Diagnosis,
	HealthCheckRating,
	SickLeave,
	Discharge,
} from "./types.ts"
import { genderEnum } from "./types.ts"
import type { Gender } from "./types.ts"
import { z } from "zod"

export const newPatientSchema = z.object({
	name: z.string(),
	dateOfBirth: z.iso.date(),
	ssn: z.string(),
	occupation: z.string(),
	gender: genderEnum,
})

const parseName = (name: unknown): string => {
	if (!isString(name)) {
		throw new Error("Incorrect or missing name: " + name)
	}
	return name
}

const parseSsn = (ssn: unknown): string => {
	if (!isString(ssn)) {
		throw new Error("Incorrect or missing ssn: " + ssn)
	}
	return ssn
}

const parseDateOfBirth = (dateOfBirth: unknown): string => {
	if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
		throw new Error("Incorrect or missing date of birth: " + dateOfBirth)
	}
	return dateOfBirth
}

const parseOccupation = (occupation: unknown): string => {
	if (!isString(occupation)) {
		throw new Error("Incorrect or missing occupation: " + occupation)
	}
	return occupation
}

const parseGender = (gender: unknown): Gender => {
	if (!isString(gender) || !isGender(gender)) {
		throw new Error("Incorrect or missing gender:" + gender)
	}
	return gender
}

const isString = (text: unknown): text is string => {
	return typeof text === "string"
}

const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date))
}

const isGender = (param: string): param is Gender => {
	return genderEnum.safeParse(param).success
}

export const toNewPatient = (object: unknown): NewPatient => {
	if (!object || typeof object !== "object") {
		throw new Error("Incorrect or missing data")
	}
	if (
		"name" in object &&
		"dateOfBirth" in object &&
		"ssn" in object &&
		"occupation" in object &&
		"gender" in object
	) {
		const newPatient: NewPatient = {
			name: parseName(object.name),
			dateOfBirth: parseDateOfBirth(object.dateOfBirth),
			ssn: parseSsn(object.ssn),
			occupation: parseOccupation(object.occupation),
			gender: parseGender(object.gender),
		}

		return newPatient
	}
	throw new Error("Incorrect data: some fields are missing")
}

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
	if (
		!object ||
		typeof object !== "object" ||
		!("diagnosisCodes" in object)
	) {
		return [] as Array<Diagnosis["code"]>
	}

	return object.diagnosisCodes as Array<Diagnosis["code"]>
}

const parseString = (value: unknown, fieldName: string): string => {
	if (!value || !isString(value)) {
		throw new Error(`Incorrect or missing ${fieldName}: ${value}`)
	}
	return value
}

const parseDate = (value: unknown, fieldName: string): string => {
	if (!value || !isString(value) || !isDate(value)) {
		throw new Error(`Empty or invalid ${fieldName}: ${value}`)
	}
	return value
}

const parseHealthCheckRating = (value: unknown): HealthCheckRating => {
	if (
		value === undefined ||
		value === null ||
		!Number.isInteger(value) ||
		(value as number) < 0 ||
		(value as number) > 3
	) {
		throw new Error(`Missing or invalid HealthCheckRating: ${value}`)
	}
	return value as HealthCheckRating
}

const parseSickLeave = (object: unknown): SickLeave => {
	if (!object || typeof object !== "object") {
		throw new Error("Incorrect or missing sickLeave data")
	}
	if (!("startDate" in object) || !("endDate" in object)) {
		throw new Error("Incorrect sick leave: missing startDate or endDate")
	}
	return {
		startDate: parseDate(object.startDate, "sickLeave.startDate"),
		endDate: parseDate(object.endDate, "sickLeave.endDate"),
	}
}

const parseDischarge = (object: unknown): Discharge => {
	if (!object || typeof object !== "object") {
		throw new Error("Incorrect or missing discharge data")
	}
	if (!("date" in object) || !("criteria" in object)) {
		throw new Error(`Discharge is missing date or criteria`)
	}
	return {
		date: parseDate(object.date, "discharge.date"),
		criteria: parseString(object.criteria, "discharge.criteria"),
	}
}

export const toNewEntry = (object: unknown): NewEntry => {
	if (!object || typeof object !== "object") {
		throw new Error("Incorrect or missing data")
	}
	if (
		!("type" in object) ||
		!("date" in object) ||
		!("specialist" in object) ||
		!("description" in object)
	) {
		throw new Error("Missing required field(s)")
	}

	const baseFields = {
		date: parseDate(object.date, "date"),
		specialist: parseString(object.specialist, "specialist"),
		description: parseString(object.description, "description"),
		// diagnosisCodes: parseDiagnosisCodes(object),
		...("diagnosisCodes" in object
			? { diagnosisCodes: parseDiagnosisCodes(object) }
			: {}),
	}

	switch (object.type) {
		case "HealthCheck":
			if (!("healthCheckRating" in object)) {
				throw new Error(
					"Missing healthCheckRating for HealthCheck entry",
				)
			}
			return {
				...baseFields,
				type: "HealthCheck",
				healthCheckRating: parseHealthCheckRating(
					object.healthCheckRating,
				),
			}
		case "OccupationalHealthcare":
			if (!("employerName" in object)) {
				throw new Error(
					"Missing employerName in OccupationalHealthcare entry",
				)
			}
			return {
				...baseFields,
				type: "OccupationalHealthcare",
				employerName: parseString(object.employerName, "employerName"),
				...("sickLeave" in object
					? { sickLeave: parseSickLeave(object.sickLeave) }
					: {}),
			}

		case "Hospital":
			return {
				...baseFields,
				type: "Hospital",
				...("discharge" in object
					? { discharge: parseDischarge(object.discharge) }
					: {}),
			}

		default:
			throw new Error(`Unsupported entry type: ${object.type}`)
	}
}
