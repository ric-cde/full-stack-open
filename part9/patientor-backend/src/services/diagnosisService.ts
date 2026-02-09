import type { Diagnosis } from "../types.js"
import diagnoses from "../../data/diagnoses.ts"

const getDiagnoses = (): Diagnosis[] => {
	return diagnoses
}

export default { getDiagnoses }
