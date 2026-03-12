import axios from "axios"
import type { NewDiaryEntry } from "../../../flight-tracker/src/types"

const baseUrl = "http://localhost:3000/api/diaries"
export const getAllDiaries = () => {
	return axios.get(baseUrl).then((response) => response.data)
}

export const createDiary = (newDiary: NewDiaryEntry) => {
	return axios
		.post(baseUrl, newDiary)
		.then((response) => response.data)
		.catch((error) => {
			if (axios.isAxiosError(error)) {
				throw new Error(
					error.response?.data?.error
						?.map((e: { message: string }) => e.message)
						.join(", ") ?? error.message,
				)
			}
			throw error
		})
}
