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
import { CircularProgress, TextField } from '@mui/material';
import React, { useState } from 'react';
import { weekdaysTranslation } from '../utils/consts';
import * as dayjs from 'dayjs';
import { Unidade } from '../interfaces/interfaces';
import { useUnitSecretaries } from '../api/routes/secretaries-api';

const ShowUnidades = () => {
  const { data: units, isLoading: unitsIsLoading } = useGetUnits();
  const [editUnit, setEditUnit] = useState<Unidade | null>(null);

  const opened = editUnit !== null;

  const onClose = () => setEditUnit(null);

  return (
    <div>
      <EditModal opened={opened} onClose={onClose} unit={editUnit} />
      {unitsIsLoading ? (
        <CircularProgress />
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
};

const EditModal = ({ unit, opened, onClose }: EditModalProps) => {
  const [weekday, setWeekday] = useState(
    Object.values(weekdaysTranslation).map(weekday => {
      return {
        day: weekday,
        slots: 0,
        checked: false,
      };
    }),
  );

  const { data: unitSecretaries, isLoading: unitsIsLoading } =
    useUnitSecretaries(unit?.id ?? 0);

  return (
    <div className="flex items-center justify-center">
      <Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'scroll',
        }}
        open={opened}
        onClose={onClose}
      >
        <Paper sx={{ padding: '20px' }}>
          <TextField>{unit?.name}</TextField>
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
        </Paper>
      </Modal>
    </div>
  );
};

export default ShowUnidades;
