import type { NewPatient } from "./types.ts"
import { Gender } from "./types.ts"

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
	return (Object.values(Gender) as string[]).includes(param)
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
