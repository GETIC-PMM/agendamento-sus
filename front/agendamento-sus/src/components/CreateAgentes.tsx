import { useState } from 'react';
import { Modal, TextField } from '@mui/material';
import * as Yup from 'yup';
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

  const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email().required('Email é obrigatório'),
    password: Yup.string().required('Senha é obrigatória'),
    c_password: Yup.string()
      .required('Confirmação de senha é obrigatória')
      .oneOf([Yup.ref('password')], 'Senhas devem ser iguais'),
  });

  // const onSubmit = async () => {
  //   schema
  //     .validate({ name, email, password, c_password })
  //     .then(async () => {
  //       await usersAPI
  //         .registerUser({ name, email, password, c_password })
  //         .then(response => {
  //           setModalMessage('Agente cadastrado com sucesso!');
  //           handleOpen();
  //           setNome('');
  //           setEmail('');
  //           setPassword('');
  //           setC_password('');
  //           console.log(response);
  //         })
  //         .catch(error => {
  //           setModalMessage(
  //             'Erro ao cadastrar agente! Esse e-mail pode já estar em uso.',
  //           );
  //           handleOpen();
  //           console.log(error);
  //         });
  //     })
  //     .catch(error => {
  //       setModalMessage(error.errors[0]);
  //       handleOpen();
  //     });
  // };

  return (
    <div>
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
        <form
          className="flex flex-col gap-4"
          action=""
          onSubmit={() => {
            // onSubmit;
          }}
        >
          <div className="flex flex-col flex-1">
            <TextField
              type="text"
              id="name"
              label="Nome"
              className="w-full h-10 pl-4 border rounded-md"
              value={name}
              onChange={e => setNome(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col mt-4">
            <TextField
              type="text"
              id="email"
              className="w-full h-10 pl-4 border rounded-md"
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
                className="w-full h-10 pl-4 border rounded-md"
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
                className="w-full h-10 pl-4 border rounded-md"
                value={c_password}
                onChange={e => setC_password(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={e => {
              e.preventDefault();
              // onSubmit();
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
