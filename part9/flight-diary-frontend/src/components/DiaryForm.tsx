import { NewDiaryEntry, Weather, Visibility } from "../types"
import { useState } from "react"

const DiaryForm = ({ addDiary }: { addDiary: (entry: NewDiaryEntry) => void }) => {
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState<Weather>(Weather.Sunny)
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great)
  const [comment, setComment] = useState('')

  const submit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const newDiary = {
      date,
      weather,
      visibility,
      comment
    }
    addDiary(newDiary)
    setDate('')
    setWeather(Weather.Sunny)
    setVisibility(Visibility.Great)
    setComment('')

  }

  return (
    <div>
      <h3>Add new entry</h3>
      <form onSubmit={submit}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          weather
          <select onChange={({ target }) => setWeather(target.value as Weather)}>
            {Object.values(Weather).map((weatherOption) =>
              <option
                key={weatherOption}
                value={weatherOption}>
                {weatherOption}
              </option>
            )}
          </select>
        </div>
        <div>
          visibility
          <select onChange={({ target }) => setVisibility(target.value as Visibility)}>
            {Object.values(Visibility).map((visibilityOption) =>
              <option
                key={visibilityOption}
                value={visibilityOption}>
                {visibilityOption}
              </option>
            )}
          </select>
        </div>
        <div>
          comment
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default DiaryForm