interface CoursePartBase {
	name: string
	exerciseCount: number
}

interface CoursePartDesc extends CoursePartBase {
	description: string
}

interface CoursePartBasic extends CoursePartDesc {
	// description: string
	kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
	groupProjectCount: number
	kind: "group"
}

interface CoursePartBackground extends CoursePartDesc {
	// description: string
	backgroundMaterial: string
	kind: "background"
}

interface CoursePartSpecial extends CoursePartDesc {
	// description: string
	requirements: string[]
	kind: "special"
}

type CoursePart =
	| CoursePartBasic
	| CoursePartGroup
	| CoursePartBackground
	| CoursePartSpecial

interface HeaderProps {
	courseName: string
}

const Header = ({ courseName }: HeaderProps) => {
	return <h1>{courseName}</h1>
}

interface ContentProps {
	courseParts: CoursePart[]
}

interface CoursePartProps {
	coursePart: CoursePart
}

const Part = ({ coursePart }: CoursePartProps) => {
	switch (coursePart.kind) {
		case "basic":
			return (
				<p>
					<strong>
						{coursePart.name} ({coursePart.exerciseCount})
					</strong>{" "}
					<br />
					<em>{coursePart.description}</em>
				</p>
			)
		case "group":
			return (
				<p>
					<strong>
						{coursePart.name} ({coursePart.exerciseCount})
					</strong>
					<br />
					Projects: {coursePart.groupProjectCount}
				</p>
			)
		case "background":
			return (
				<p>
					<strong>
						{coursePart.name} {coursePart.exerciseCount}{" "}
					</strong>{" "}
					<br />
					<em>{coursePart.description}</em>
					<br />
					{coursePart.backgroundMaterial}
				</p>
			)
		case "special":
			return (
				<p>
					<strong>
						{coursePart.name} {coursePart.exerciseCount}{" "}
					</strong>{" "}
					<br />
					<em>{coursePart.description}</em>
					<br />
					Required skills: {coursePart.requirements.join(",")}
				</p>
			)
		default: {
			return coursePart satisfies never
		}
	}
}

const Content = ({ courseParts }: ContentProps) => {
	return (
		<>
			{courseParts.map((c) => (
				<Part coursePart={c} key={c.name} />
			))}
		</>
	)
}

interface TotalProps {
	totalExercises: number
}

const Total = ({ totalExercises }: TotalProps) => {
	return <p>Number of exercises: {totalExercises}</p>
}

const App = () => {
	const courseName = "Half stack app development"
	const courseParts: CoursePart[] = [
		{
			name: "Fundamentals",
			exerciseCount: 10,
			description: "This is an awesome course part",
			kind: "basic",
		},
		{
			name: "Using props to pass data",
			exerciseCount: 7,
			groupProjectCount: 3,
			kind: "group",
		},
		{
			name: "Basics of type Narrowing",
			exerciseCount: 7,
			description: "How to go from unknown to string",
			kind: "basic",
		},
		{
			name: "Deeper type usage",
			exerciseCount: 14,
			description: "Confusing description",
			backgroundMaterial:
				"https://type-level-typescript.com/template-literal-types",
			kind: "background",
		},
		{
			name: "TypeScript in frontend",
			exerciseCount: 10,
			description: "a hard part",
			kind: "basic",
		},
		{
			name: "Backend development",
			exerciseCount: 21,
			description: "Typing the backend",
			requirements: ["nodejs", "jest"],
			kind: "special",
		},
	]

	const totalExercises = courseParts.reduce(
		(acc, course) => acc + course.exerciseCount,
		0,
	)

	return (
		<div>
			<Header {...{ courseName }} />
			<Content {...{ courseParts }} />
			<Total {...{ totalExercises }} />
		</div>
	)
}

export default App
