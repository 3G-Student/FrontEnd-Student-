import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DashboardProfessor from './assets/components/pages/professores'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DashboardProfessor></DashboardProfessor>
    </>
  )
}

export default App
