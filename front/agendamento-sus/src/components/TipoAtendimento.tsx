import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import {
  useAppointmentTypes,
  useDeleteAppointmentType,
  useMutateRegisterAppointmentType,
} from '../api/routes/appointment-type-api';
import FormAlert from './FormAlert';
import Modal from '@mui/material/Modal';
import { AppointmentType, Unidade } from '../interfaces/interfaces';

const TipoAtendimento = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [newAtendimento, setNewAtendimento] = useState('');
  const [newDuration, setNewDuration] = useState(0);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: tiposAtendimento,
    isLoading: isTiposAtendimentoLoading,
    isFetching,
    isError,
    error,
  } = useAppointmentTypes();

  const createAppointmentType = useMutateRegisterAppointmentType();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAppointmentTypeObject, setDeleteAppointmentType] =
    useState<AppointmentType | null>(null);
  const deleteAppointmentType = useDeleteAppointmentType();

  const handleCreateNewAtendimento = async () => {
    createAppointmentType.mutate({
      name: newAtendimento,
      duration: newDuration,
    });

    if (createAppointmentType.isError) {
      console.log(createAppointmentType.error);
      if (axios.isAxiosError(createAppointmentType.error)) {
        setErrorMessage(
          createAppointmentType.error.response?.data.message ||
            'Já existe um tipo de atendimento com esse nome.',
        );
      }
      setShowError(true);
    } else if (createAppointmentType.isSuccess) {
      console.log('Entrou is success');
      setShowError(false);
      setNewAtendimento('');
      setNewDuration(0);
    }

    useAppointmentTypes().refetch();
  };

  const validateSubmit = () => {
    if (newAtendimento === '') {
      setShowError(true);
      setErrorMessage('O titulo do tipo de atendimento é obrigatório');
      return false;
    }

    if (newDuration === 0) {
      setShowError(true);
      setErrorMessage('O campo duração é obrigatório e deve ser maior que 0');
      return false;
    }

    return true;
  };

  const handleDeleteAppointmentType = async (id: string) => {
    deleteAppointmentType.mutate(id);
    useAppointmentTypes().refetch();
  };

  const handleDelete = (appointmentType: AppointmentType) => {
    deleteAppointmentType.mutate(appointmentType.id.toString());
    setDeleteModalOpen(false);
    useAppointmentTypes().refetch();
  };

  return (
    <>
      <div className="border-l-4 border-blue-700 pl-2 mb-4">
        <Typography
          className="text-blue-700"
          fontWeight="bold"
          sx={{ marginBottom: '1rem' }}
        >
          Tipos de atendimento
        </Typography>
      </div>

      <FormAlert
        showError={showError}
        setShowError={setShowError}
        errorMessage={errorMessage}
      />

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="p-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Deletar unidade
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Tem certeza que deseja deletar essa unidade?
            {deleteAppointmentTypeObject && (
              <Typography align="center" fontSize={14}>
                {deleteAppointmentTypeObject.name}
              </Typography>
            )}
            <div className="flex justify-around mt-6">
              <Button
                variant="outlined"
                onClick={() => {
                  setDeleteModalOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  handleDelete(deleteAppointmentTypeObject!);
                }}
              >
                Confirmar
              </Button>
            </div>
          </Typography>
        </div>
      </Modal>

      {isTiposAtendimentoLoading || isFetching ? (
        <div className="h-[calc(100vh-141.6px)] w-full flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="border-t-[50px] border-t-primary-base rounded-lg border border-zinc-200 p-6 drop-shadow">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo de atendimento</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell align="right">Excluir</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tiposAtendimento?.data.map(tipoAtendimento => {
                  return (
                    <TableRow key={tipoAtendimento.id}>
                      <TableCell>{tipoAtendimento.name}</TableCell>
                      <TableCell>{tipoAtendimento.duration} minutos</TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => {
                            setDeleteAppointmentType(tipoAtendimento);
                            setDeleteModalOpen(true);
                          }}
                          size="small"
                          variant="contained"
                          color="error"
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <hr />
          <div className="mt-4 flex w-full gap-4">
            <TextField
              value={newAtendimento}
              onChange={event => {
                setNewAtendimento(event.target.value);
              }}
              sx={{ width: '100%' }}
              label="Novo tipo de atendimento"
            />
            <TextField
              value={newDuration}
              onChange={event => {
                setNewDuration(Number(event.target.value));
              }}
              sx={{ width: '50%' }}
              label="Duração (em minutos)"
            />
            <Button
              onClick={() => {
                if (validateSubmit()) handleCreateNewAtendimento();
              }}
              variant="contained"
              disabled={createAppointmentType.isLoading}
              sx={{ width: '50%' }}
            >
              Cadastrar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TipoAtendimento;
