import { createHashRouter } from 'react-router-dom'
import GeneratePage from '@/pages/generate-page/index'

export const router = createHashRouter([
  {
    path: '/',
    element: <GeneratePage />
  }
])
