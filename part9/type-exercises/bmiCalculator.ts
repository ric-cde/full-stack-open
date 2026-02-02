export const calculateBmi = (height: number, weight: number): string => {
	if (height < 0) throw new Error("Height must be a positive number.")
	if (Number.isNaN(height) || Number.isNaN(weight))
		throw new Error("Height and weight must be numbers.")

	const bmi = weight / (height / 100) ** 2

	if (bmi < 20) return "Underweight"
	if (bmi > 25) return "Overweight"
	return "Normal range"
}

if (require.main === module) {
	try {
		const height = Number(process.argv[2])
		const weight = Number(process.argv[3])

		if (Number.isNaN(height) || Number.isNaN(weight))
			throw new Error("Provided values were not numbers")
		console.log(calculateBmi(height, weight))
	} catch (error) {
		let errorMsg = "Something went wrong: "
		if (error instanceof Error) {
			errorMsg += error.message
		}
		console.log(errorMsg)
	}
}
