import {
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useContext, useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as dayjs from 'dayjs';
import { cpfFormatter } from '../../utils/cpf-formatter';
import { telFormatter } from '../../utils/tel-formatter';
import { useGetUnitByName } from '../../api/routes/units-api';
import { useUnitSecretaries } from '../../api/routes/secretaries-api';
import { useMutateRegisterAppointment } from '../../api/routes/appointments-api';
import { Navigate, useNavigate } from 'react-router-dom';
import { CitizenContext } from '../../main';

const AgendarAtendimento = () => {
  const navigate = useNavigate();

  // const citizen = useContext(CitizenContext);

  const citizen = {
    name: 'Joao',
    unit: 'CLINICA ODONTOFISIOMED',
    cpf: '123',
  };

  const [telefone, setTelefone] = useState<string>('');
  const [isWhatsapp, setIsWhatsapp] = useState<string>('');
  const [unitId, setUnitId] = useState<number | null>(null);

  const [date, setDate] = useState<Date>(dayjs(new Date()).toDate());

  const [selectedType, setSelectedType] = useState('');

  const unidade = useGetUnitByName({
    unit: citizen!.unit,
    onSuccess: data => {
      setUnitId(data.data[0].id);
    },
  });

  const unitAppointmentTypes = useUnitSecretaries({
    unitId: unitId,
  });

  const registerAppointment = useMutateRegisterAppointment({
    onSuccess: () => {
      alert('Agendamento realizado com sucesso!');
      navigate('/');
    },
  });

  // const shouldDisableDate = (date: Date) => {
  //   const appointmentType = typesInThisUnit.find(type => {
  //     return type.appointment_type_id.toString() === selectedType;
  //   }) as SecretariesType;

  //   const _day = dayjs(date).day();

  //   let resultDate;
  //   if (_day === 0) {
  //     appointmentType?.days[0].slots === 0
  //       ? (resultDate = true)
  //       : (resultDate = false);
  //   } else if (_day === 1) {
  //     appointmentType?.days[1].slots === 0
  //       ? (resultDate = true)
  //       : (resultDate = false);
  //   } else if (_day === 2) {
  //     appointmentType?.days[2].slots === 0
  //       ? (resultDate = true)
  //       : (resultDate = false);
  //   } else if (_day === 3) {
  //     appointmentType?.days[3].slots === 0
  //       ? (resultDate = true)
  //       : (resultDate = false);
  //   } else if (_day === 4) {
  //     appointmentType?.days[4].slots === 0
  //       ? (resultDate = true)
  //       : (resultDate = false);
  //   } else if (_day === 5) {
  //     appointmentType?.days[5].slots === 0
  //       ? (resultDate = true)
  //       : (resultDate = false);
  //   } else if (_day === 6) {
  //     appointmentType?.days[6].slots === 0
  //       ? (resultDate = true)
  //       : (resultDate = false);
  //   } else {
  //     resultDate = false;
  //   }

  //   return resultDate;
  // };
  if (!citizen || Object.values(citizen).some(value => value === ''))
    return <Navigate to={'/'} />;

  return (
    <div>
      {unitAppointmentTypes.isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center bg-login-bg bg-cover">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center bg-login-bg bg-cover overflow-x-hidden">
          <div className="py-16 my-10 md:px-[140px] px-4 md:w-[75%] bg-primary-base flex items-center md:rounded-[10px] font-medium flex-col gap-7 relative">
            <div>
              <h1 className="text-white text-2xl ">{`Bem-vindo(a), ${citizen?.name}.`}</h1>
              <h3 className="text-white text-base text-center font-light">
                Agendamento SUS
              </h3>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <div>
                <label htmlFor="" className="text-zinc-200 text-sm">
                  CPF:
                </label>
                <input
                  value={cpfFormatter(citizen.cpf.toString())}
                  disabled
                  className="w-full bg-zinc-300 h-12 pl-4 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="" className="text-zinc-200 text-sm">
                  Nome:
                </label>
                <input
                  value={citizen?.name}
                  disabled
                  className="w-full bg-zinc-300 h-12 pl-4 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="" className="text-zinc-200 text-sm">
                  Unidade:
                </label>
                <input
                  value={citizen?.unit}
                  disabled
                  className="w-full bg-zinc-300 h-12 pl-4 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="" className="text-zinc-200 text-sm">
                  Telefone:
                </label>
                <input
                  maxLength={15}
                  value={telFormatter(telefone)}
                  onChange={e => {
                    setTelefone(e.target.value);
                  }}
                  className="w-full h-12 pl-4 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="" className="text-zinc-200 text-sm">
                  Esse telefone é whatsapp?
                </label>
                <RadioGroup
                  value={isWhatsapp}
                  defaultValue={'sim'}
                  onChange={e => {
                    setIsWhatsapp(e.target.value);
                  }}
                  row
                >
                  <FormControlLabel
                    sx={{ color: 'white', fontSize: '10px' }}
                    value={'sim'}
                    control={
                      <Radio
                        sx={{
                          color: 'white',
                          '&.Mui-checked': {
                            color: '#038548',
                          },
                        }}
                      />
                    }
                    label="Sim"
                  />
                  <FormControlLabel
                    sx={{ color: 'white', fontSize: '10px' }}
                    value={'nao'}
                    control={
                      <Radio
                        sx={{
                          color: 'white',
                          '&.Mui-checked': {
                            color: '#038548',
                          },
                        }}
                      />
                    }
                    label="Nao"
                  />
                </RadioGroup>
              </div>

              <div>
                <div>
                  <h2 className="text-zinc-200 text-sm mt-4">
                    Escolha o tipo de atendimento:
                  </h2>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue=""
                    value={selectedType}
                    onChange={e => {
                      setSelectedType(e.target.value);
                    }}
                    name="radio-buttons-group"
                    className="mt-2"
                    row
                  >
                    {unitAppointmentTypes.data?.data?.map(type => {
                      return (
                        <FormControlLabel
                          key={type.appointment_type_name}
                          sx={{ color: 'white', fontSize: '12px' }}
                          value={type.appointment_type_id}
                          control={
                            <Radio
                              sx={{
                                color: 'white',
                                '&.Mui-checked': {
                                  color: '#038548',
                                },
                              }}
                            />
                          }
                          label={type.appointment_type_name}
                        />
                      );
                    })}
                  </RadioGroup>

                  <h2 className="text-zinc-200 text-sm mt-3">
                    Escolha o dia da semana:
                  </h2>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* <Select>
                    </Select> */}
                  </LocalizationProvider>
                </div>
              </div>

              <button
                className="bg-green-800 text-white rounded-lg py-3 self-center px-4 max-w-fit md:w-full mt-4"
                onClick={() =>
                  registerAppointment.mutate({
                    appointment_type_id: Number.parseInt(selectedType),
                    date: date,
                    phone_number: telefone,
                    is_phone_number_whatsapp:
                      isWhatsapp === 'sim' ? true : false,
                    cpf: citizen.cpf,
                    name: citizen.name,
                    unit_id: unidade.data?.data[0].id!,
                    status: 'Agendado',
                  })
                }
              >
                Confirmar agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendarAtendimento;
