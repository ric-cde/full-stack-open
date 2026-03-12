import type {
	RedactedPatient,
	Patient,
	NewPatient,
	NewEntry,
} from "../types.ts"
import patients from "../../data/patients.ts"
import { v1 as uuid } from "uuid"

const patientList: Patient[] = patients

const getPatients = (): Patient[] => {
	return patientList
}

const getPatient = (id: string): Patient => {
	const patient = patientList.find((p) => p.id === id)
	if (!patient) {
		throw new Error(`Patient with id ${id} not found.`)
	}
	return patient
}

const getRedactedPatients = (): RedactedPatient[] => {
	// omits ssn
	return patientList.map(
		(patient): RedactedPatient => ({
			id: patient.id,
			name: patient.name,
			gender: patient.gender,
			occupation: patient.occupation,
			dateOfBirth: patient.dateOfBirth,
		}),
	)
}

const addPatient = (object: NewPatient): Patient => {
	const newPatient = {
		id: uuid(),
		entries: [],
		...object,
	}
	patientList.push(newPatient)
	return newPatient
}

const addEntry = (id: string, object: NewEntry) => {
	const newEntry = {
		id: uuid(),
		...object,
	}
	const patient = patientList.find((p) => p.id === id)
	if (!patient) {
		throw new Error("Patient not found.")
	}
	patient.entries = [...patient.entries, newEntry]
	return newEntry
}

export default {
	getPatients,
	getPatient,
	getRedactedPatients,
	addPatient,
	addEntry,
}
