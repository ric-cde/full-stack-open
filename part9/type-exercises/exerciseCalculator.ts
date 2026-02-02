interface Result {
	periodLength: number
	trainingDays: number
	success: boolean
	rating: number
	ratingDescription: string
	target: number
	average: number
}

type ExerciseData = number[]

export const calculateExercises = (hours: number[], target: number): Result => {
	const average = hours.reduce((acc, val) => acc + val, 0) / hours.length
	let rating, ratingDescription

	if (average / target <= 1.1 && average / target >= 0.9) {
		rating = 2
		ratingDescription = "good enough"
	} else if (average > target) {
		rating = 3
		ratingDescription = "great"
	} else {
		rating = 1
		ratingDescription = "could be better"
	}

	let exerciseData = {
		periodLength: hours.length,
		trainingDays: hours.filter((d) => d > 0).length,
		success: average >= target,
		rating,
		ratingDescription,
		target,
		average,
	}

	return exerciseData
}

export const parseNumbers = (data: string[]): number[] => {
	return data.map((n) => {
		const num = Number(n)
		if (Number.isNaN(num)) throw new Error(`${n} is not a number`)
		return num
	})
}

if (require.main === module) {
	try {
		const exerciseData: ExerciseData = parseNumbers(process.argv.slice(3))

		const target: number = parseNumbers([process.argv[2]])[0]

		console.log(calculateExercises(exerciseData, target))
	} catch (error) {
		let errorMsg = "Something went wrong: "
		if (error instanceof Error) {
			errorMsg += error.message
		}
		console.log(errorMsg)
	}
}
