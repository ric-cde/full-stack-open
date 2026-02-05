export const parseNum = (input: string): number => {
	const num = Number(input)
	if (Number.isNaN(num)) throw new Error("A provided value is not a number.")
	return num
}
