import { RouterProvider } from 'react-router-dom'
import { router } from './router'
function App() {
  return <RouterProvider router={router}></RouterProvider>
}

console.log(window.injectParams)
export default App
