import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './routes/Login';
import ErrorPage from './routes/ErrorPage';
import Homepage from './routes/Homepage';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ptBR } from '@mui/material/locale';
import Agendamento from './routes/cidadao/Agendamento';
import AgendarAtendimento from './routes/cidadao/AgendarAtendimento';
import { createContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Citizen {
  name: string;
  cpf: string;
  unit: string;
}

const queryClient = new QueryClient();

export const CitizenContext = createContext<Citizen | null>(null);

const citizen: Citizen = { name: '', cpf: '', unit: '' };

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      { path: '/admin/login', element: <Login /> },
      { path: '/admin/dashboard', element: <Homepage /> },
      { path: '/admin', element: <Homepage /> },
      { path: '/', element: <Agendamento /> },
      { path: '/agendamento', element: <AgendarAtendimento /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <CitizenContext.Provider value={citizen}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </LocalizationProvider>
    </CitizenContext.Provider>
  </QueryClientProvider>,
);
