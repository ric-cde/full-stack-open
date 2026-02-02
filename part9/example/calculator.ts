type Operator = "multiply" | "add" | "subtract" | "divide"
type Result = number | string

const calculator = (a: number, b: number, op: Operator): Result => {
	switch (op) {
		case "multiply":
			return a * b
		case "add":
			return a + b
		case "subtract":
			return a - b
		case "divide":
			if (b === 0) throw new Error("Can't divide by 0")
			return a / b
		default:
			throw new Error(
				"Operation must be multiply, add, subtract, or divide",
			)
	}
}

try {
	console.log(calculator(2, 0, "divide"))
} catch (error: unknown) {
	let errorMessage = "something went wrong: "
	if (error instanceof Error) {
		errorMessage += error.message
	}
	console.log(errorMessage)
}

console.log(process.argv)
