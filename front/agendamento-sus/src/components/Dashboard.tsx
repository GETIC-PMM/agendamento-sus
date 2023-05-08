import { CircularProgress, MenuItem, Modal, Select } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as dayjs from 'dayjs';
import { useState } from 'react';
import {
  useMutateCancelAppointment,
  useUnitAppointmentsById,
} from '../api/routes/appointments-api';
import { useGetUnits } from '../api/routes/units-api';
import { Appointment } from '../interfaces/interfaces';
import { cpfFormatter } from '../utils/cpf-formatter';

const Dashboard = () => {
  const [selectedUnit, setSelectedUnit] = useState('0');
  const [mutateModal, setMutateModal] = useState(false);
  const [mutateRow, setMutateRow] = useState<Appointment>();

  const units = useGetUnits();

  const unitAppointments = useUnitAppointmentsById(
    Number.parseInt(selectedUnit),
  );

  console.log(unitAppointments.data?.data[0]);

  const cancelAppointment = useMutateCancelAppointment({
    onSuccess: () => {
      alert('Agendamento cancelado com sucesso!');
      setMutateModal(false);
    },
  });

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'cpf',
      headerName: 'CPF',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: params => {
        return cpfFormatter(params.value as string);
      },
    },
    {
      field: 'atendimento',
      headerName: 'Atendimento',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Data',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      valueFormatter: params => {
        return dayjs(params.value as string).format('DD/MM/YYYY');
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: 'Ações',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      sortable: false,
      flex: 1,
      renderCell: params =>
        params.row.status.toLowerCase() === 'agendado' && (
          <div className="flex gap-2">
            <button
              className="bg-red-500 py-2 px-6 rounded text-white hover:bg-red-700 transition-all ease-in-out"
              onClick={() => {
                setMutateRow(params.row as Appointment);
                setMutateModal(true);
              }}
            >
              Cancelar
            </button>
          </div>
        ),
    },
  ];

  return (
    <div>
      <div>
        <Modal open={mutateModal}>
          <div className="flex flex-col items-center justify-center h-screen w-screen bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 flex flex-col gap-2">
              <div className="text-xl max-w-xl text-center">
                {`Tem certeza que deseja cancelar o agendamento de ${
                  mutateRow?.name
                }, CPF ${mutateRow?.cpf} no dia ${dayjs(mutateRow?.date).format(
                  'DD/MM/YYYY',
                )}?`}
              </div>
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  className="bg-red-500 w-40 py-2 px-6 rounded text-white hover:bg-red-700 transition-all ease-in-out"
                  onClick={() => {
                    setMutateModal(false);
                  }}
                >
                  Não
                </button>
                <button
                  className="bg-green-500 w-40 py-2 px-6 rounded text-white hover:bg-green-700 transition-all ease-in-out"
                  onClick={() => {
                    mutateRow?.id && cancelAppointment.mutate(mutateRow?.id);
                  }}
                >
                  Sim
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <label htmlFor="">Selecione uma unidade</label>
        <Select
          value={selectedUnit}
          onChange={e => {
            setSelectedUnit(e.target.value);
          }}
          sx={{ width: '100%' }}
        >
          {units.data?.data.map(unidade => (
            <MenuItem key={unidade.id} value={unidade.id}>
              {unidade.name}
            </MenuItem>
          ))}
        </Select>

        <div className="mt-8 flex justify-center w-full">
          {unitAppointments.isFetching ? (
            <CircularProgress />
          ) : (
            unitAppointments.data &&
            (unitAppointments.data.data[0] ? (
              <DataGrid
                rows={unitAppointments.data.data}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      page: 0,
                      pageSize: 25,
                    },
                  },
                }}
                disableRowSelectionOnClick
                pageSizeOptions={[25, 50, 100]}
              />
            ) : (
              <div>
                {selectedUnit !== '0' &&
                  'Ainda não existem agendamentos para a unidade selecionada'}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
