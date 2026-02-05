import { parseNum } from "./utils"

export const calculateBmi = (height: number, weight: number): string => {
	if (height <= 0 || weight <= 0)
		throw new Error("Inputs must be positive numbers.")

	const bmi = weight / (height / 100) ** 2

	if (bmi < 20) return "Underweight"
	if (bmi > 25) return "Overweight"
	return "Normal range"
}

if (require.main === module) {
	try {
		const bmi = calculateBmi(
			parseNum(process.argv[2]),
			parseNum(process.argv[3]),
		)
		console.log(bmi)
	} catch (error: unknown) {
		let errorMsg = "Something went wrong: "
		if (error instanceof Error) {
			errorMsg += error.message
		}
		console.log(errorMsg)
	}
}
