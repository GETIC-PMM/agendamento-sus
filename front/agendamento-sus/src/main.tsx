import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './routes/Login'
import ErrorPage from './routes/ErrorPage'
import Homepage from './routes/Homepage'
import TestSchedule from './routes/TestSchedule'

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/', element: <Homepage /> },
      { path: '/test-schedule', element: <TestSchedule /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
