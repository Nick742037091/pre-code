import { createHashRouter } from 'react-router-dom'
import GeneratePage from '@/pages/generate-page/index'
import TemplateList from '@/pages/template-list/index'

export const router = createHashRouter([
  {
    path: '/template-list',
    element: <TemplateList />
  },
  {
    path: '/',
    element: <GeneratePage />
  }
])
