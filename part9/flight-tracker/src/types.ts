import { z } from "zod"
import { newEntrySchema } from "./utils.ts"

export { Weather, Visibility } from "./utils.ts"

// export interface DiaryEntry {
// 	id: number
// 	date: string
// 	weather: Weather
// 	visibility: Visibility
// 	comment?: string
// }

export type NewDiaryEntry = z.infer<typeof newEntrySchema>

export interface DiaryEntry extends NewDiaryEntry {
	id: number
}

// export type NewDiaryEntry = Omit<DiaryEntry, "id">

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, "comment">
