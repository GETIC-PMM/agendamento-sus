import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { MdLogin } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import GovBrIcon from '../assets/govbr-icon.svg';
import PasswordIcon from '../assets/password-icon.svg';
import UserIcon from '../assets/user-icon.svg';
import { useLogin, useRegister } from '../api/routes/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = useRegister();

  const login = useLogin({
    onSuccess: data => {
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1000 * 60);
      Cookies.set('token', data, { expires: expireDate });
      navigate('/admin/dashboard');
    },
    onError: error => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          alert('Erro ao fazer login, tente novamente mais tarde.');
        } else
          alert(
            'E-mail ou senha incorretos, por favor verifique os dados e tente novamente.',
          );
      }
    },
  });

  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-login-bg bg-cover">
      <div className="py-16 px-[140px] bg-primary-base flex items-center rounded-[10px] font-medium flex-col gap-7">
        <h1 className="text-white text-2xl ">Login</h1>

        <form action="" className="flex flex-col gap-10">
          <div className="bg-white rounded-full w-[420px] py-3 flex items-center px-6 gap-2">
            <img src={UserIcon} alt="" className="w-4 h-4" />
            <input
              type="text"
              placeholder="Usuário"
              className="placeholder:text-primary-base placeholder:text-center placeholder:ml-5 focus:outline-none w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="bg-white rounded-full w-[420px] py-3 flex items-center px-6 gap-2">
            <img src={PasswordIcon} alt="" className="w-4 h-4" />
            <input
              type="password"
              placeholder="Senha"
              className="placeholder:text-primary-base placeholder:text-center placeholder:ml-5 focus:outline-none w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            onClick={e => {
              e.preventDefault();
              login.mutate({ email, password });
            }}
            className="bg-primary-dark rounded-full w-[420px] py-3 h-full px-6 relative"
          >
            <MdLogin color="white" />
            <span className="top-1/2 -translate-y-1/2 w-full left-0 text-center text-white absolute">
              Fazer Login
            </span>
          </button>
        </form>

        <div className="w-full">
          <div className="h-px w-full bg-white border-0" />
          <div className="flex justify-between w-full text-white font-normal text-xs mt-3">
            <div className="flex gap-2">
              <span>•</span>
              <a href="" className="underline">
                Solicitar novo acesso
              </a>
            </div>
            <div className="flex gap-2">
              <span>•</span>
              <a href="" className="underline">
                Esqueci minha senha
              </a>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-white rounded-full w-[420px] py-3 h-full px-6 relative"
        >
          <img src={GovBrIcon} alt="" className="" />
          <span className="top-1/2 -translate-y-1/2 w-full left-0 text-center text-primary-base absolute font-light">
            Entrar com a conta gov.br
          </span>
        </button>

        <button
        // TODO: fazer a pagina de registrar e usar o mutate
        // onClick={() => register.mutate()}
        >
          Criar
        </button>
      </div>
    </div>
  );
};

export default Login;
