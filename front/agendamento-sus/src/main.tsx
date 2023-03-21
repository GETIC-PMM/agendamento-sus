import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './routes/Login'
import ErrorPage from './routes/ErrorPage'
import Homepage from './routes/Homepage'
import TestSchedule from './routes/TestSchedule'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ptBR } from '@mui/material/locale';

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
  <LocalizationProvider adapterLocale={ptBR} dateAdapter={AdapterDateFns}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </LocalizationProvider>
)
