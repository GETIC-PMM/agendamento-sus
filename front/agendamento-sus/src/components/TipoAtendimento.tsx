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

const TipoAtendimento = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [newAtendimento, setNewAtendimento] = useState('');
  const [newDuration, setNewDuration] = useState(0);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    data: tiposAtendimento,
    isLoading: isTiposAtendimentoLoading,
    isError,
    error,
  } = useAppointmentTypes();

  const createAppointmentType = useMutateRegisterAppointmentType();
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

      <div
        className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 ${
          showError ? 'block' : 'hidden'
        }`}
        role="alert"
      >
        <div className="flex gap-1">
          <div>
            <strong className="font-bold">Erro no cadastro! </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
          <span onClick={() => setShowError(false)}>
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Fechar</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      </div>

      {isTiposAtendimentoLoading ? (
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
                          onClick={() =>
                            handleDeleteAppointmentType(
                              tipoAtendimento.id.toString(),
                            )
                          }
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
