import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import { useGetUnits } from '../api/routes/units-api';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { weekdaysTranslation } from '../utils/consts';
import * as dayjs from 'dayjs';
import { Unidade } from '../interfaces/interfaces';
import {
  useMutateRegisterSecretarie,
  useUnitSecretaries,
} from '../api/routes/secretaries-api';
import { useAppointmentTypes } from '../api/routes/appointment-type-api';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const ShowUnidades = () => {
  const { data: units, isLoading: unitsIsLoading } = useGetUnits();

  const [editUnit, setEditUnit] = useState<Unidade | null>(null);

  const [selectedAppointmentType, setSelectedAppointmentType] = useState<
    number | null
  >(null);

  const opened = editUnit !== null;

  const [weekday, setWeekday] = useState(
    Object.values(weekdaysTranslation).map(weekday => {
      return {
        day: weekday,
        slots: 0,
        checked: false,
      };
    }),
  );

  const createSecretarie = useMutateRegisterSecretarie();

  const onSubmit = () => {
    createSecretarie.mutate({
      unit_id: editUnit!.id,
      appointment_type_id: selectedAppointmentType!,
      days: weekday,
    });
  };

  const onClose = () => {
    setEditUnit(null);
    setWeekday(
      Object.values(weekdaysTranslation).map(weekday => {
        return {
          day: weekday,
          slots: 0,
          checked: false,
        };
      }),
    );
    setSelectedAppointmentType(null);
  };

  return (
    <div>
      <EditModal
        opened={opened}
        onClose={onClose}
        unit={editUnit}
        weekday={weekday}
        setWeekday={setWeekday}
        selectedAppointmentType={selectedAppointmentType}
        setSelectedAppointmentType={setSelectedAppointmentType}
        onSubmit={onSubmit}
      />
      {unitsIsLoading ? (
        <Paper className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-2 px-6 py-4">
          <CircularProgress />
          <Typography variant="h6">Carregando...</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#01499B' }}>
                <TableCell align="center" sx={{ color: 'white' }}>
                  ID
                </TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>
                  Nome
                </TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>
                  Horário de funcionamento
                </TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units?.data.map(unit => {
                return (
                  <TableRow key={unit.id}>
                    <TableCell align="center">{unit.id}</TableCell>
                    <TableCell align="center">{unit.name}</TableCell>
                    <TableCell align="center">
                      {dayjs(unit.open_time).format('HH:mm')} às{' '}
                      {dayjs(unit.close_time).format('HH:mm')}
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex gap-1 justify-center">
                        <div className="flex justify-center">
                          <FiEdit
                            color={'white'}
                            className={`w-8 h-8 p-2 ${
                              true ? 'bg-red-error' : 'bg-primary-base'
                            } rounded cursor-pointer`}
                            onClick={() => {
                              setEditUnit(unit);
                            }}
                          />
                        </div>
                        <div className="flex justify-center">
                          <FiTrash
                            color="white"
                            className={`w-8 h-8 p-2 bg-primary-base rounded cursor-pointer`}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

type EditModalProps = {
  unit: Unidade | null;
  opened: boolean;
  onClose: () => void;
  weekday: {
    day:
      | 'Domingo'
      | 'Segunda'
      | 'Terça'
      | 'Quarta'
      | 'Quinta'
      | 'Sexta'
      | 'Sábado';
    slots: number;
    checked: boolean;
  }[];
  setWeekday: React.Dispatch<
    React.SetStateAction<
      {
        day:
          | 'Domingo'
          | 'Segunda'
          | 'Terça'
          | 'Quarta'
          | 'Quinta'
          | 'Sexta'
          | 'Sábado';
        slots: number;
        checked: boolean;
      }[]
    >
  >;
  selectedAppointmentType: number | null;
  setSelectedAppointmentType: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  onSubmit: () => void;
};

const EditModal = ({
  unit,
  opened,
  onClose,
  weekday,
  setWeekday,
  selectedAppointmentType,
  setSelectedAppointmentType,
  onSubmit,
}: EditModalProps) => {
  const { data: appointmentTypes, isLoading: appointmentTypesIsLoading } =
    useAppointmentTypes();

  const {
    data: unitSecretaries,
    isLoading: unitsIsLoading,
    isSuccess: unitSecretariesIsSuccess,
  } = useUnitSecretaries({ unitId: unit?.id ?? 0 });

  unitSecretaries
    ? console.log(unitSecretaries.data)
    : console.log('nada ainda');

  return (
    <div className="flex items-center justify-center">
      {unitsIsLoading && (
        <Paper className="flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-2 px-6 py-4">
          <CircularProgress />
          <Typography variant="h6">Carregando unidade...</Typography>
        </Paper>
      )}
      {unitSecretariesIsSuccess && (
        <Modal
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            overflowY: 'scroll',
            width: '75%',
            height: '75%',
          }}
          open={opened}
          onClose={onClose}
        >
          <Paper
            sx={{
              padding: '42px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <TextField value={unit?.name} disabled sx={{ width: '100%' }} />
            <div className="w-full">
              <Typography variant="h6" align="center">
                Atendimentos da unidade
              </Typography>
              {unitsIsLoading ? (
                <div className="w-full flex flex-col items-center">
                  <CircularProgress />
                  <Typography variant="h6" align="center">
                    Carregando informações da unidade...
                  </Typography>
                </div>
              ) : (
                unitSecretaries?.data.map((secretarie, index) => {
                  return (
                    <>
                      <Typography variant="body1" color={'blue'}>
                        {secretarie.appointment_type_name}
                      </Typography>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Dia da semana</TableCell>
                              <TableCell>Vagas</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {secretarie.days.map(day => {
                              return (
                                <TableRow>
                                  <TableCell>{day.day}</TableCell>
                                  <TableCell>{day.slots}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  );
                })
              )}
            </div>
            <Typography variant="h6" align="center">
              Adicionar novo atendimento
            </Typography>
            <Select
              value={selectedAppointmentType}
              onChange={e => {
                setSelectedAppointmentType(e.target.value as number);
              }}
              sx={{ width: '100%' }}
            >
              {appointmentTypes?.data.map(appointmentType => {
                return (
                  <MenuItem value={appointmentType.id}>
                    {appointmentType.name}
                  </MenuItem>
                );
              })}
            </Select>

            {selectedAppointmentType && (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Dia da semana</TableCell>
                        <TableCell>Vagas</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {weekday.map(day => {
                        return (
                          <TableRow>
                            <TableCell>{day.day}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={day.slots}
                                onChange={e => {
                                  setWeekday(
                                    weekday.map(weekday => {
                                      if (weekday.day === day.day) {
                                        return {
                                          ...weekday,
                                          slots: parseInt(e.target.value),
                                        };
                                      }
                                      return weekday;
                                    }),
                                  );
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button onClick={onSubmit}>Criar atendimento</Button>
              </>
            )}

            {/* <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Dia da semana</TableCell>
                  <TableCell>Vagas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weekday.map(day => {
                  return (
                    <TableRow>
                      <TableCell>{day.day}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={day.slots}
                          onChange={e => {
                            setWeekday(
                              weekday.map(weekday => {
                                if (weekday.day === day.day) {
                                  return {
                                    ...weekday,
                                    slots: parseInt(e.target.value),
                                  };
                                }
                                return weekday;
                              }),
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table> */}
          </Paper>
        </Modal>
      )}
    </div>
  );
};

export default ShowUnidades;
