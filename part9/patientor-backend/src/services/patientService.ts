import type { RedactedPatient, Patient, NewPatient } from "../types.ts"
import patients from "../../data/patients.ts"
import { v1 as uuid } from "uuid"

const patientList: Patient[] = patients

const getPatients = (): Patient[] => {
	return patientList
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
		...object,
	}
	patientList.push(newPatient)
	return newPatient
}

export default { getPatients, getRedactedPatients, addPatient }
