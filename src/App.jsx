import { useState } from 'react'
import DashboardProfessor from './professores'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DashboardProfessor></DashboardProfessor>
    </>
  )
}

export default App
