import { useState, useEffect } from 'react';
import * as dayjs from 'dayjs';
import {
  Autocomplete,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { AppointmentType, UnitESUS } from '../interfaces/interfaces';
import { useEsusUnits } from '../api/routes/esus-api';
import { useMutateRegisterUnit } from '../api/routes/units-api';
import axios from 'axios';
import FormAlert from './FormAlert';

interface CreateUnidadeProps {
  callback: (str: string) => void;
}

const CreateUnidade = (props: CreateUnidadeProps) => {
  const [openTime, setOpenTime] = useState<string | null>(
    dayjs().hour(8).minute(0).format(''),
  );
  const [closeTime, setCloseTime] = useState<string | null>(
    dayjs().hour(17).minute(0).format(''),
  );
  const [selectedUnit, setSelectedUnit] = useState<UnitESUS | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: esusUnits, isLoading: esusUnitsIsLoading } = useEsusUnits();

  const createUnit = useMutateRegisterUnit({
    onSuccess: () => {
      props.callback('unidades');
    },
  });

  const isEndTimeAfterStartTime = () => {
    if (!openTime || !closeTime) return false;
    return dayjs(openTime).isBefore(dayjs(closeTime));
  };

  const onSubmit = () => {
    createUnit.mutate({
      name: selectedUnit!.no_unidade_saude,
      bairro: selectedUnit!.no_bairro,
      rua: selectedUnit!.ds_logradouro,
      numero: selectedUnit!.nu_numero,
      open_time: new Date(openTime!),
      close_time: new Date(closeTime!),
    });

    if (createUnit.isError) {
      if (axios.isAxiosError(createUnit.error)) {
        setErrorMessage(createUnit.error?.message!);
        setShowError(true);
      }
    }
  };

  const validateSubmit = () => {
    if (!selectedUnit) {
      setErrorMessage('Selecione uma unidade');
      setShowError(true);
      return false;
    }
    if (!isEndTimeAfterStartTime()) {
      setErrorMessage(
        'Horário de fechamento deve ser após horário de abertura',
      );
      setShowError(true);
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
          Cadastrar unidade
        </Typography>
      </div>

      <FormAlert
        showError={showError}
        setShowError={setShowError}
        errorMessage={errorMessage}
      />

      <div
        className={`border-t-[50px] relative border-t-primary-base rounded-lg border border-zinc-200 p-6 drop-shadow ${
          createUnit.isLoading &&
          'after:h-full after:w-full after:bg-opacity-10 after:bg-black'
        }`}
      >
        {createUnit.isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress />
          </div>
        )}
        {esusUnitsIsLoading ? (
          <div className="flex flex-col items-center gap-2 px-6 py-4">
            <CircularProgress />
            <Typography variant="h6">
              Carregando unidades disponíveis...
            </Typography>
          </div>
        ) : (
          esusUnits?.data && (
            <>
              <div className="flex flex-col flex-1">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  getOptionLabel={option => option.no_unidade_saude}
                  options={esusUnits.data}
                  renderInput={params => (
                    <TextField {...params} label="Unidade" />
                  )}
                  value={selectedUnit}
                  onChange={(event, newValue) => {
                    setSelectedUnit(newValue);
                    console.log('SELECTED UNIT', selectedUnit);
                  }}
                />
              </div>

              <div className="flex mt-4 gap-2">
                <TextField
                  label="Rua"
                  sx={{ width: '100%' }}
                  size="medium"
                  value={selectedUnit?.ds_logradouro || ''}
                  type="readonly"
                  disabled
                />
                <TextField
                  label="Numero"
                  value={selectedUnit?.nu_numero || ''}
                  disabled
                />
              </div>

              <div className="flex flex-col mt-4">
                <TextField
                  label="Bairro"
                  value={selectedUnit?.no_bairro || ''}
                  disabled
                />
              </div>

              <div className="flex gap-8 mt-4">
                <TimePicker
                  label="Começo do expediente"
                  value={openTime}
                  onChange={(newValue: any) => setOpenTime(newValue)}
                  renderInput={params => (
                    <TextField {...params} sx={{ width: '100%' }} />
                  )}
                />
                <TimePicker
                  label="Fim do expediente"
                  value={closeTime}
                  onChange={newValue => setCloseTime(newValue)}
                  renderInput={params => (
                    <TextField {...params} sx={{ width: '100%' }} />
                  )}
                />
              </div>

              <button
                className="bg-primary-base px-7 py-3 text-white rounded-md mt-4 "
                onClick={e => {
                  e.preventDefault();
                  if (validateSubmit()) {
                    setShowError(false);
                    onSubmit();
                  }
                }}
              >
                Cadastrar
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default CreateUnidade;
