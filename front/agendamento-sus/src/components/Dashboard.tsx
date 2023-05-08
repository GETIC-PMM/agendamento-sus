import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { cpfFormatter } from '../utils/cpf-formatter';
import Typography from '@mui/material/Typography';
import * as dayjs from 'dayjs';
import {
  Appointment,
  Unidade,
  AppointmentType,
} from '../interfaces/interfaces';
import { AppointmentForm } from '@devexpress/dx-react-scheduler';
import { useGetUnits } from '../api/routes/units-api';
import {
  useMutateCancelAppointment,
  useUnitAppointmentsById,
} from '../api/routes/appointments-api';

const Dashboard = () => {
  const [selectedUnit, setSelectedUnit] = useState('0');
  // const [unitAppointments, setUnitAppointments] = useState<Appointment[]>([]);
  const [unitAppointmentTypes, setUnitAppointmentTypes] = useState<
    AppointmentType[]
  >([]);
  const [cpfToFilter, setCpfToFilter] = useState<string>('');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [is7DayFilterChecked, setIs7DayFilterChecked] = useState<boolean>(true);
  const [isAppointmentDataLoading, setIsAppointmentDataLoading] =
    useState<boolean>(false);

  const units = useGetUnits();

  const unitAppointments = useUnitAppointmentsById(
    Number.parseInt(selectedUnit),
  );

  const cancelAppointment = useMutateCancelAppointment({
    onSuccess: () => alert('Agendamento cancelado com sucesso!'),
  });

  return (
    <div>
      <div>
        <label htmlFor="">Selecione uma unidade</label>
        <Select
          value={selectedUnit}
          onChange={e => {
            setIsAppointmentDataLoading(true);
            setSelectedUnit(e.target.value);
            // getUnitAppointments(e.target.value, is7DayFilterChecked);
          }}
          sx={{ width: '100%' }}
        >
          {units.data?.data.map(unidade => (
            <MenuItem key={unidade.id} value={unidade.id}>
              {unidade.name}
            </MenuItem>
          ))}
        </Select>
        <div className="mt-4">
          <Accordion>
            <AccordionSummary>
              <Typography>Filtrar por CPF</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex gap-2">
                <TextField
                  value={cpfToFilter}
                  onChange={e => {
                    setCpfToFilter(e.target.value);
                  }}
                  label="CPF"
                  sx={{ width: '100%' }}
                />
                <button
                  className="bg-green-500 py-2 px-6 rounded text-white"
                  onClick={() => {
                    setIsAppointmentDataLoading(true);
                    // getUnitAppointmentsByCPF(
                    //   selectedUnit,
                    //   cpfToFilter,
                    //   is7DayFilterChecked,
                    // );
                  }}
                >
                  Filtrar
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <Typography>Filtrar por Atendimento</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex gap-2">
                <TextField
                  value={appointmentSearch}
                  onChange={e => {
                    setAppointmentSearch(e.target.value);
                  }}
                  label="Atendimento"
                  sx={{ width: '100%' }}
                />
                <button
                  className="bg-green-500 py-2 px-6 rounded text-white"
                  onClick={() => {
                    // setIsAppointmentDataLoading(true);
                    // getUnitAppointmentsByCPF(selectedUnit, cpfToFilter, is7DayFilterChecked);
                  }}
                >
                  Filtrar
                </button>
              </div>
            </AccordionDetails>
          </Accordion>
          {/* <Accordion>
                        <AccordionSummary>
                            <Typography>Filtrar por data</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex gap-2'>
                                <DatePicker
                                    value={new Date()}
                                    onChange={() => { }}
                                    renderInput={(params) => <TextField sx={{ width: '100%' }} {...params} />}
                                />
                                <button className='bg-green-500 py-2 px-6 rounded text-white'>Filtrar</button>
                            </div>
                        </AccordionDetails>
                    </Accordion> */}
          <FormControlLabel
            control={
              <Checkbox
                checked={is7DayFilterChecked}
                onChange={event => {
                  setIsAppointmentDataLoading(true);
                  setIs7DayFilterChecked(event.target.checked);
                  // getUnitAppointments(selectedUnit, event.target.checked);
                }}
                defaultChecked
              />
            }
            label="Proximos 7 dias"
          />
        </div>

        <div className="mt-8 flex justify-center w-full">
          {unitAppointments.isFetching ? (
            <CircularProgress />
          ) : (
            <Paper sx={{ width: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#023E84' }}>
                    <TableCell style={{ color: 'white' }} align="center">
                      Nome
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      CPF
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      Atendimento
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      Data
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      Status
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="center">
                      Cancelar
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unitAppointments.data?.data.map(appointment => (
                    <TableRow key={appointment.id}>
                      <TableCell align="center">{appointment.name}</TableCell>
                      <TableCell align="center">
                        {cpfFormatter(appointment.cpf)}
                      </TableCell>
                      <TableCell align="center">
                        {/* {getAppointmentTypeName(
                          appointment.appointment_type_id,
                        )} */}
                      </TableCell>
                      <TableCell align="center">
                        {dayjs(appointment.date).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell align="center">
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </TableCell>
                      <TableCell align="center">
                        <button
                          className="bg-red-400 py-2 px-4 rounded text-white"
                          color="error"
                          onClick={() => {
                            console.log('CANCELAR: ', appointment);
                            setIsAppointmentDataLoading(true);
                            cancelAppointment.mutate(appointment.id);
                          }}
                        >
                          Cancelar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
