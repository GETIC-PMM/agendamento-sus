import { useState } from 'react';
import { Modal, TextField } from '@mui/material';
import * as Yup from 'yup';
import { useMutateRegisterUser } from '../api/routes/users-api';
import { Typography } from '@mui/material';
import axios from 'axios';
// import usersAPI from '../api/routes/users-api';

const CreateAgentes = () => {
  const [name, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [c_password, setC_password] = useState('');

  const [modalMessage, setModalMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const createUser = useMutateRegisterUser();

  const clearInputs = () => {
    setNome('');
    setEmail('');
    setPassword('');
    setC_password('');
  };

  const onSubmit = async () => {
    createUser.mutate({
      name,
      email,
      password,
      c_password,
    });

    if (createUser.isError) {
      console.log(createUser.error);
      if (axios.isAxiosError(createUser.error)) {
        setErrorMessage(
          createUser.error.response?.data.message ||
            'Já existe um agente com esse email.',
        );
      }
      setShowError(true);
    } else if (createUser.isSuccess) {
      setShowError(false);
      setModalMessage('Usuário cadastrado com sucesso!');
      handleOpen();
      clearInputs();
    }
  };

  const validadeSubmit = () => {
    if (name === '') {
      setShowError(true);
      setErrorMessage('Nome não pode ser vazio');
      return false;
    }

    if (email === '') {
      setShowError(true);
      setErrorMessage('Email não pode ser vazio');
      return false;
    }

    if (password === '') {
      setShowError(true);
      setErrorMessage('Senha não pode ser vazia');
      return false;
    }

    if (c_password === '') {
      setShowError(true);
      setErrorMessage('Confirmação de senha não pode ser vazia');
      return false;
    }

    if (password !== c_password) {
      setShowError(true);
      setErrorMessage('Senhas não conferem');
      return false;
    }

    return true;
  };

  return (
    <div>
      <div className="border-l-4 border-blue-700 pl-2 mb-4">
        <Typography
          className="text-blue-700"
          fontWeight="bold"
          sx={{ marginBottom: '1rem' }}
        >
          Cadastrar agente de saúde
        </Typography>
      </div>

      <div
        className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 ${
          showError ? 'block' : 'hidden'
        }`}
        role="alert"
      >
        <strong className="font-bold">Erro no cadastro! </strong>
        <span className="block sm:inline">{errorMessage}</span>
        <span
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={() => setShowError(false)}
        >
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

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 flex flex-col gap-2">
            {modalMessage}
            <button
              onClick={handleClose}
              className="bg-primary-base px-7 py-3 text-white rounded-md mt-4 "
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
      <div className="border-t-[50px] border-t-primary-base rounded-lg border border-zinc-200 p-6 drop-shadow">
        <form className="flex flex-col gap-4" action="">
          <div className="flex flex-col flex-1">
            <TextField
              type="text"
              id="name"
              label="Nome"
              className="w-full h-full pl-4 border rounded-md"
              value={name}
              onChange={e => setNome(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col mt-4">
            <TextField
              type="text"
              id="email"
              className="w-full h-full pl-4 border rounded-md"
              value={email}
              label="Email"
              onChange={e => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex gap-8 mt-4">
            <div className="flex flex-col flex-1">
              <TextField
                type="password"
                id="name"
                className="w-full h-full pl-4 border rounded-md"
                value={password}
                label="Senha"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col flex-1">
              <TextField
                type="password"
                id="c_password"
                label="Confirmar senha"
                className={`w-full pl-4 h-full border rounded-md`}
                value={c_password}
                onChange={e => setC_password(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={e => {
              e.preventDefault();
              setShowError(false);
              if (validadeSubmit()) onSubmit();
            }}
            className="bg-primary-base px-7 py-3 text-white rounded-md mt-4 "
          >
            Cadastrar agente
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAgentes;
