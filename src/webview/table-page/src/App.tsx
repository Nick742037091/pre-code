import { useState } from 'react'
import './App.css'
import { Button } from 'antd'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button
        mt-80px
        type="primary"
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </Button>
    </>
  )
}

export default App
