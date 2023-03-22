import { useState } from 'react';
import * as dayjs from 'dayjs'
import { TimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

const CreateUnidade = () => {
    const [openTime, setOpenTime] = useState<string | null>(dayjs().format());
    const [closeTime, setCloseTime] = useState<string | null>(dayjs().format());


    return (
        <div>
            <div className="border-t-[50px] border-t-primary-base rounded-lg border border-zinc-200 p-6">
                <div className="flex gap-8">
                    <div className="flex flex-col flex-1">
                        <label htmlFor="nome" className="text-sm font-light">Nome</label>
                        <input type="text" id="nome" className="w-full h-10 pl-4 border rounded-md" placeholder="Ex.: Unidade da COHAB" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="sigla" className="text-sm font-light">Sigla</label>
                        <input type="text" id="sigla" className="w-full h-10 pl-4 border rounded-md" placeholder="UPA-CHB" />
                    </div>
                </div>

                <div className="flex flex-col mt-4">
                    <label htmlFor="localizacao" className="text-sm font-light">Localização</label>
                    <input type="text" id="localizacao" className="w-full h-10 pl-4 border rounded-md" placeholder="Ex.: Rua Marechal, 12 - Lagoa do Mato" />
                </div>

                <div className="flex gap-8 mt-4">
                    <div className="flex flex-col flex-1">
                        <label htmlFor="openTime" className="text-sm font-light">Horário de Abertura</label>
                        {/* <TimePicker
                            value={openTime}
                            onChange={(newValue) => setOpenTime(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        /> */}
                    </div>
                    <div className="flex flex-col flex-1">
                        <label htmlFor="closeTime" className="text-sm font-light">Horário de Fechamento</label>
                        {/* <TimePicker
                            value={closeTime}
                            onChange={(newValue) => setCloseTime(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        /> */}
                    </div>
                </div>

                <button className="bg-primary-base px-7 py-3 text-white rounded-md mt-4 ">
                    Cadastrar
                </button>
            </div>
        </div>
    )
}

export default CreateUnidade