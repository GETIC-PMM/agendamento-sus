import { CircularProgress, Modal } from '@mui/material';
import { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { CitizenContext } from '../../main';
import { cpfFormatter } from '../../utils/cpf-formatter';
import {
  usePatientNameByCPF,
  usePatientUnitByCPF,
} from '../../api/routes/schedule';

const Agendamento = () => {
  const [cpf, setCpf] = useState<string>('');
  const [enabled, setEnabled] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState<string>('');
  const [unidade, setUnidade] = useState<string>('');

  const [cpfChecked, setCpfChecked] = useState<boolean>(false);
  const [incorrectCpf, setIncorrectCpf] = useState<boolean>(false);

  const [modalPatientOpen, setModalPatientOpen] = useState(false);
  const handlePatientOpen = () => setModalPatientOpen(true);
  const handlePatientClose = () => setModalPatientOpen(false);

  const [modalRecordOpen, setModalRecordOpen] = useState(false);
  const handleRecordOpen = () => setModalRecordOpen(true);
  const handleRecordClose = () => setModalRecordOpen(false);

  const patientNameQuery = usePatientNameByCPF(cpf, enabled);

  const patientUnitQuery = usePatientUnitByCPF(cpf, enabled);

  const isFetching = patientNameQuery.isFetching && patientUnitQuery.isFetching;

  const isSuccess = patientNameQuery.isSuccess && patientUnitQuery.isSuccess;

  const navigate = useNavigate();
  const citizen = useContext(CitizenContext);

  const handleCpfCheck = async () => {
    if (testaCPF(cpf)) {
      setEnabled(true);
      setIncorrectCpf(false);
    } else {
      setEnabled(false);
      setIncorrectCpf(true);
    }
  };

  const clearFields = () => {
    setCpf('');
    setNomeCompleto('');
    setUnidade('');
    setCpfChecked(false);
  };

  function testaCPF(strCPF: string) {
    const cpfWithoutMask = strCPF
      .replace('.', '')
      .replace('.', '')
      .replace('-', '');

    var Soma;
    var Resto;
    Soma = 0;
    if (cpfWithoutMask == '00000000000') return false;

    for (let i = 1; i <= 9; i++)
      Soma = Soma + parseInt(cpfWithoutMask.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(cpfWithoutMask.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++)
      Soma = Soma + parseInt(cpfWithoutMask.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) Resto = 0;
    if (Resto != parseInt(cpfWithoutMask.substring(10, 11))) return false;
    return true;
  }

  const handleAgendamento = () => {
    if (citizen) {
      citizen.cpf = cpf;
      citizen.name = nomeCompleto;
      citizen.unit = unidade;
    }
    navigate('/agendamento');
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-login-bg bg-cover">
      <div className="py-16 px-[140px] bg-primary-base flex items-center rounded-[10px] font-medium flex-col gap-7 relative">
        {patientNameQuery.isFetching && (
          <CircularProgress
            color="error"
            className="absolute top-1/2 -translate-y-1/2"
          />
        )}

        <Modal
          open={modalPatientOpen}
          onClose={handlePatientClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="flex flex-col items-center justify-center h-screen w-screen bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 flex flex-col gap-2">
              Paciente não encontrado no sistema. Procure sua unidade de saúde
              mais próxima.
              <button
                onClick={handlePatientClose}
                className="bg-primary-base px-7 py-3 text-white rounded-md mt-4 "
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          open={modalRecordOpen}
          onClose={handleRecordClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="flex flex-col items-center justify-center h-screen w-screen bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 flex flex-col gap-2">
              Unidade do paciente não encontrada no sistema. Procure sua unidade
              de saúde mais próxima.
              <button
                onClick={handleRecordClose}
                className="bg-primary-base px-7 py-3 text-white rounded-md mt-4 "
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>

        <div>
          <h1 className="text-white text-2xl ">Bem-vindo, cidadão.</h1>
          <h3 className="text-white text-base text-center font-light">
            Agendamento SUS
          </h3>
        </div>

        <form className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-white text-xs font-light" htmlFor="cpf">
                CPF
              </label>
              <input
                type="text"
                className={`w-full h-10 pl-4 border rounded-md ${
                  incorrectCpf ? 'border-red-800 bg-red-200' : ''
                }`}
                id="cpf"
                value={cpf}
                onChange={e => {
                  setCpf(cpfFormatter(e.target.value));
                }}
                maxLength={14}
              />
            </div>
            <button
              className="bg-primary-dark rounded-full text-white py-2 h-full px-6 self-end"
              onClick={e => {
                e.preventDefault();
                handleCpfCheck();
              }}
            >
              Consultar CPF
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white text-xs font-light" htmlFor="nome">
              Nome completo
            </label>
            <input
              type="text"
              className="w-full text-white h-10 pl-4 border rounded-md"
              id="nome"
              disabled
              value={isSuccess ? patientNameQuery.data?.data.no_cidadao : ''}
              onChange={e => {
                setNomeCompleto(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white text-xs font-light" htmlFor="unidade">
              Unidade SUS cadastrada
            </label>
            <input
              type="text"
              className="w-full text-white h-10 pl-4 border rounded-md"
              id="unidade"
              disabled
              value={
                isSuccess ? patientUnitQuery.data?.data.no_unidade_saude : ''
              }
              onChange={e => {
                setUnidade(e.target.value);
              }}
            />
          </div>

          {isSuccess && (
            <div className="flex flex-col gap-1">
              <span className="text-white">
                Essas informações estão corretas?
              </span>
              <div className="flex gap-2">
                <button className="bg-red-800 text-white rounded-lg py-2 px-4">
                  Não
                </button>
                <button
                  className="bg-green-800 text-white rounded-lg py-2 px-4"
                  onClick={e => {
                    e.preventDefault();
                    handleAgendamento();
                  }}
                >
                  Sim, seguir para o agendamento
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Agendamento;
