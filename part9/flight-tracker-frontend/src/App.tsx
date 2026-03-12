import { useEffect, useState } from "react"
import "./App.css"
import type {
	DiaryEntry,
	NewDiaryEntry,
} from "../../flight-tracker/src/types.ts"
import { Weather, Visibility } from "../../flight-tracker/src/types.ts"
import { getAllDiaries, createDiary } from "./services/diaryService.ts"

function App() {
	const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		getAllDiaries().then((data) => setDiaryEntries(data))
	}, [])

	const addDiary = (newDiary: NewDiaryEntry) => {
		createDiary(newDiary)
			.then((data) => {
				setDiaryEntries([...diaryEntries, data])
				setError(null)
			})
			.catch((error) => {
				setError(error.message || "Failed to add diary entry")
			})
	}

	return (
		<div>
			{error && <p style={{ color: "red" }}>Error: {error}</p>}

			<AddEntry onSubmit={addDiary} />
			<Entries diaryEntries={diaryEntries} />
		</div>
	)
}

interface EntriesProps {
	diaryEntries: DiaryEntry[]
}

const Entries = ({ diaryEntries }: EntriesProps) => {
	return (
		<div>
			<h1>Diary entries</h1>
			{diaryEntries?.map((e) => {
				return (
					<div key={e.id}>
						<h2>{e.date}</h2>
						<table>
							<tbody>
								<tr>
									<td>
										<strong>Visibility:</strong>
									</td>
									<td>{e.visibility}</td>
								</tr>
								<tr>
									<td>
										<strong>Weather:</strong>
									</td>
									<td>{e.weather}</td>
								</tr>
								<tr>
									<td>
										<strong>Comment:</strong>
									</td>
									<td>{e.comment}</td>
								</tr>
							</tbody>
						</table>
					</div>
				)
			})}
		</div>
	)
}

interface AddEntryProps {
	onSubmit: (entry: NewDiaryEntry) => void
}

const AddEntry = ({ onSubmit }: AddEntryProps) => {
	const [newDiary, setNewDiary] = useState<NewDiaryEntry>({
		date: "",
		visibility: "ok",
		weather: "sunny",
		comment: "",
	})

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		onSubmit(newDiary)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewDiary({
			...newDiary,
			[e.target.name]: e.target.value,
		})
	}

	return (
		<>
			<h1>Add new entry</h1>

			<form onSubmit={handleSubmit}>
				<EntryField
					handleChange={handleChange}
					data={newDiary.date}
					name="date"
				/>
				<EntryField
					handleChange={handleChange}
					data={newDiary.visibility}
					name="visibility"
				/>

				<EntryField
					handleChange={handleChange}
					data={newDiary.weather}
					name="weather"
				/>

				<EntryField
					handleChange={handleChange}
					data={newDiary.comment ?? ""}
					name="comment"
				/>
				<button type="submit">Add diary</button>
			</form>
		</>
	)
}

interface EntryFieldProps {
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	data: string
	name: string
}

const radioOptions: Record<string, readonly string[]> = {
	weather: Weather,
	visibility: Visibility,
}

const EntryField = ({ handleChange, data, name }: EntryFieldProps) => {
	const getInputType = () => {
		switch (name) {
			case "date":
				return "date"
			case "weather":
			case "visibility":
				return "radio"
			default:
				return "text"
		}
	}
	const inputType = getInputType()

	if (inputType === "radio") {
		const options = radioOptions[name]
		return (
			<fieldset>
				<legend>{name}</legend>
				{options.map((option) => (
					<label key={option}>
						<input
							type="radio"
							value={option}
							checked={data === option}
							onChange={handleChange}
							name={name}
						/>
						{option}
					</label>
				))}
			</fieldset>
		)
	}

	return (
		<>
			<label>
				{name}
				<input
					type={inputType}
					value={data}
					onChange={handleChange}
					name={name}
				/>
			</label>
			<br />
		</>
	)
}

export default App
