import { useFeedbackActions } from './store'
import Button from './components/Button'
import Statistics from './components/Statistics'

const App = () => {
  const { giveGood, giveNeutral, giveBad } = useFeedbackActions()

  return (
    <div>
      <h1>give feedback</h1>

      <Button onClick={giveGood} text="good" />
      <Button onClick={giveNeutral} text="neutral" />
      <Button onClick={giveBad} text="bad" />

      <h1>statistics</h1>

      <Statistics />
    </div>
  )
}

export default App