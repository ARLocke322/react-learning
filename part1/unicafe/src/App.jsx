import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  if (all == 0) {
    return <p>No feedback given</p>
  } else {


    const average = (good - bad) / all
    const positive = 100 * good / all
    return (
      <div>
      <h1>statistics</h1>
      <table>
        <tbody>
        <StatisticLine text={'good'} value={good} />
        <StatisticLine text={'neutral'} value={neutral} />
        <StatisticLine text={'bad'} value={bad} />
        <StatisticLine text={'all'} value={all} />
        <StatisticLine text={'average'} value={average} />
        <StatisticLine text={'positive'} value={positive} />
        </tbody>
      </table>
      </div>
    )
  }
}

const StatisticLine = ({ text, value }) => {
  return <tr>
            <td>{text}</td>
            <td>{value}</td>
          </tr>
}

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => setGood(good + 1)
  const incrementNeutral = () => setNeutral(neutral + 1)
  const incrementBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={incrementGood} text={'good'} />
      <Button onClick={incrementNeutral} text={'neutral'} />
      <Button onClick={incrementBad} text={'bad'} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App