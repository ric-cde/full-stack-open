import type { NewDiaryEntry } from "./types.ts"
import { z } from "zod"

export const Weather = ["sunny", "rainy", "cloudy", "windy", "stormy"] as const
export const Visibility = ["great", "good", "ok", "poor"] as const

export const newEntrySchema = z.object({
	weather: z.enum(Weather),
	visibility: z.enum(Visibility),
	date: z.iso.date(),
	comment: z.string().optional(),
})

export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
	return newEntrySchema.parse(object)
}
