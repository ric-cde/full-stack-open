import type {
	DiaryEntry,
	NewDiaryEntry,
	NonSensitiveDiaryEntry,
} from "../types.ts"
import diaryEntries from "../../data/entries.ts"

const diaries: DiaryEntry[] = diaryEntries

const findById = (id: number): DiaryEntry | undefined => {
	const entry = diaries.find((d) => d.id === id)
	return entry
}

const getEntries = (): DiaryEntry[] => {
	return diaries
}

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
	return diaries.map(({ id, date, weather, visibility }) => ({
		id,
		date,
		weather,
		visibility,
	}))
}

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
	const newDiaryEntry = {
		id: Math.max(...diaries.map((d) => d.id)) + 1,
		...entry,
	}

	diaries.push(newDiaryEntry)
	return newDiaryEntry
}

export default {
	getEntries,
	addDiary,
	getNonSensitiveEntries,
	findById,
}
