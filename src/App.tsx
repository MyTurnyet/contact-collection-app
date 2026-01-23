import { useState } from 'react'
import { DependencyProvider } from './di'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <DependencyProvider>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Contact Check-in App</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Phase 5 Complete: Dependency Injection Ready
        </p>
        <p className="read-the-docs">
          Infrastructure layer complete. Ready for UI implementation.
        </p>
      </div>
    </DependencyProvider>
  )
}

export default App
