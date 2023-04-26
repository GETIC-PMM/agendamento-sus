import { useState, useEffect } from 'react';
import * as dayjs from 'dayjs';
import { Autocomplete, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { AppointmentType, UnitESUS } from '../interfaces/interfaces';
import appointmentTypeApi from '../api/routes/appointment-type-api';
import esusApi from '../api/routes/esus-api';
import unitsApi from '../api/routes/units-api';

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
  const [units, setUnits] = useState<UnitESUS[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<UnitESUS | null>(null);
  const [, setTiposAtendimento] = useState<AppointmentType[]>([]);
  const [selectedTiposAtendimento] = useState<number>(-1);

  const getTiposAntendimento = async () => {
    appointmentTypeApi
      .getAppointmentTypes()
      .then(res => {
        console.log('TIPOS DE ATENDIMENTO: ', res);
        setTiposAtendimento(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    esusApi.getEsusUnits().then(response => {
      response.map((unit: any) => {
        unit.label = unit.no_unidade_saude;
      });
      setUnits(response);
      console.log(response);
    });

    getTiposAntendimento();
  }, []);

  const handleSubmit = async () => {
    console.log('SELECTED TIPOS ATENDIMENTO: ', selectedTiposAtendimento);

    unitsApi
      .registerUnit(
        selectedUnit!.no_unidade_saude,
        openTime!,
        closeTime!,
        12131,
        selectedUnit!.no_bairro,
        selectedUnit!.ds_logradouro,
        selectedUnit!.nu_numero || '0',
      )
      .then(res => {
        console.log(res);
        props.callback('unidades'); // Ir para unidades
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="border-t-[50px] border-t-primary-base rounded-lg border border-zinc-200 p-6 drop-shadow">
        <div className="flex flex-col flex-1">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={units}
            renderInput={params => <TextField {...params} label="Unidade" />}
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
          />
          <TextField label="Numero" value={selectedUnit?.nu_numero || ''} />
        </div>

        <div className="flex flex-col mt-4">
          <TextField label="Bairro" value={selectedUnit?.no_bairro || ''} />
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
            handleSubmit();
          }}
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
};

export default CreateUnidade;
