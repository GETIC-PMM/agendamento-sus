import { useState, useEffect } from 'react';
import * as dayjs from 'dayjs';
import { Autocomplete, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { AppointmentType, UnitESUS } from '../interfaces/interfaces';
import { useEsusUnits } from '../api/routes/esus-api';
import { useMutateRegisterUnit } from '../api/routes/units-api';

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

  const esusUnits = useEsusUnits();

  const submit = useMutateRegisterUnit({
    onSuccess: () => {
      alert('Unidade cadastrada com sucesso!');
      props.callback('unidades');
    },
  });

  return (
    <div>
      <div className="border-t-[50px] border-t-primary-base rounded-lg border border-zinc-200 p-6 drop-shadow">
        <div className="flex flex-col flex-1">
          {esusUnits.data && (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              getOptionLabel={option => option.no_unidade_saude}
              options={esusUnits.data.data}
              renderInput={params => <TextField {...params} label="Unidade" />}
              value={selectedUnit}
              onChange={(event, newValue) => {
                setSelectedUnit(newValue);
                console.log('SELECTED UNIT', selectedUnit);
              }}
            />
          )}
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
            selectedUnit &&
              submit.mutate({
                name: selectedUnit.no_unidade_saude,
                bairro: selectedUnit.no_bairro,
                rua: selectedUnit.ds_logradouro,
                numero: selectedUnit.nu_numero,
                open_time: new Date(openTime!),
                close_time: new Date(closeTime!),
              });
          }}
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
};

export default CreateUnidade;
