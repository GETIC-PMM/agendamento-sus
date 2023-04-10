import { useState, useEffect } from 'react';
import * as dayjs from 'dayjs'
import axios from 'axios';
import { Autocomplete, Checkbox, FormControlLabel, FormGroup, MenuItem, Select, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


interface Unidade {
    ds_logradouro: string,
    no_unidade_saude: string,
    no_bairro: string,
    nu_numero: string,
}

interface CreateUnidadeProps {
    callback: (str: string) => void;
}

const CreateUnidade = (props: CreateUnidadeProps) => {
    const [openTime, setOpenTime] = useState<string | null>(dayjs().hour(8).minute(0).format(''));
    const [closeTime, setCloseTime] = useState<string | null>(dayjs().hour(17).minute(0).format(''));
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState<Unidade | null>(null);
    const [selectedWorkingDays, setSelectedWorkingDays] = useState<string[]>([]);
    const [vacancyPerDay, setVacancyPerDay] = useState<number>(0);

    const [includedAtendimentos, setIncludedAtendimentos] = useState<any[]>([]);
    const [tiposAtendimento, setTiposAtendimento] = useState<any[]>([]);
    const [selectedTiposAtendimento, setSelectedTiposAtendimento] = useState<number>(-1);

    const getTiposAntendimento = async () => {
        await axios.get('http://localhost:8000/api/appointment-types', {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('token')
            }
        }).then(res => {
            console.log("TIPOS DE ATENDIMENTO: ", res.data.data)
            setTiposAtendimento(res.data.data);
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        axios.get('http://localhost:8000/api/units/esus')
            .then(response => {
                response.data.data.map((unit: any) => {
                    unit.label = unit.no_unidade_saude;
                })
                setUnits(response.data.data);
                console.log(response.data.data);
            })

        getTiposAntendimento();
    }, [])

    const handleSubmit = async () => {
        console.log(Cookies.get('access_token'))
        console.log("SELECTED TIPOS ATENDIMENTO: ", selectedTiposAtendimento)

        await axios.post('http://localhost:8000/api/units', {
            name: selectedUnit?.no_unidade_saude,
            open_time: openTime,
            close_time: closeTime,
            code: 12131,
            bairro: selectedUnit?.no_bairro,
            rua: selectedUnit?.ds_logradouro,
            numero: selectedUnit?.nu_numero || 0,
            // appointment_type_id: selectedTiposAtendimento,
            // appointment_quantity: vacancyPerDay,
            // available_days: selectedWorkingDays
        }, {
            headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`
            }
        }).then(res => {
            console.log(res)
            props.callback("unidades") // Ir para unidades
        }
        ).catch(err => {
            console.log(err)
        })
    }

    const addAtendimentoType = () => {
        const _tiposAtendimento = tiposAtendimento.filter(e => e.id !== selectedTiposAtendimento);
        setTiposAtendimento(_tiposAtendimento);
        setIncludedAtendimentos([...includedAtendimentos, selectedTiposAtendimento]);
    }

    return (
        <div>
            <div className="border-t-[50px] border-t-primary-base rounded-lg border border-zinc-200 p-6 drop-shadow">

                <div className="flex flex-col flex-1">
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={units}
                        renderInput={(params) => <TextField {...params} label="Unidade" />}
                        value={selectedUnit}
                        onChange={(event, newValue) => {
                            setSelectedUnit(newValue);
                            console.log("SELECTED UNIT", selectedUnit)
                        }}
                    />
                </div>

                <div className="flex mt-4 gap-2">
                    <TextField label="Rua" sx={{ width: "100%" }} size='medium' value={selectedUnit?.ds_logradouro || ""} />
                    <TextField label="Numero" value={selectedUnit?.nu_numero || ""} />
                </div>

                <div className="flex flex-col mt-4">
                    <TextField label="Bairro" value={selectedUnit?.no_bairro || ""} />
                </div>

                <div className="flex gap-8 mt-4">
                    <TimePicker
                        label="Começo do expediente"
                        value={openTime}
                        onChange={(newValue: any) => setOpenTime(newValue)}
                        renderInput={(params) => <TextField {...params} sx={{ width: "100%" }} />}
                    />
                    <TimePicker
                        label="Fim do expediente"
                        value={closeTime}
                        onChange={(newValue) => setCloseTime(newValue)}
                        renderInput={(params) => <TextField {...params} sx={{ width: "100%" }} />}

                    />
                </div>


                {/* <div className="flex flex-col mt-4">
                    <TextField label="Número de vagas por dia" value={vacancyPerDay || 0} onChange={(e) => { setVacancyPerDay(Number(e.target.value)) }} />
                </div>

                <h3 className='mt-4'>Dias de atendimento da unidade:</h3>
                <div className='grid grid-cols-2'>
                    <FormControlLabel control={<Checkbox onChange={
                        (e) => {
                            if (e.target.checked) {
                                setSelectedWorkingDays([...selectedWorkingDays, "domingo"])
                            } else {
                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "domingo"))
                            }

                            console.log(selectedWorkingDays)
                        }} />} label="Domingo" />
                    <FormControlLabel control={<Checkbox onChange={
                        (e) => {
                            if (e.target.checked) {
                                setSelectedWorkingDays([...selectedWorkingDays, "segunda"])
                            } else {
                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "segunda"))
                            }

                            console.log(selectedWorkingDays)
                        }} />} label="Segunda" />
                    <FormControlLabel control={<Checkbox onChange={
                        (e) => {
                            if (e.target.checked) {
                                setSelectedWorkingDays([...selectedWorkingDays, "terca"])
                            } else {
                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "terca"))
                            }

                            console.log(selectedWorkingDays)
                        }} />} label="Terça" />
                    <FormControlLabel control={<Checkbox onChange={
                        (e) => {
                            if (e.target.checked) {
                                setSelectedWorkingDays([...selectedWorkingDays, "quarta"])
                            } else {
                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "quarta"))
                            }

                            console.log(selectedWorkingDays)
                        }} />} label="Quarta" />
                    <FormControlLabel control={<Checkbox onChange={
                        (e) => {
                            if (e.target.checked) {
                                setSelectedWorkingDays([...selectedWorkingDays, "quinta"])
                            } else {
                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "quinta"))
                            }

                            console.log(selectedWorkingDays)
                        }} />} label="Quinta" />
                    <FormControlLabel control={<Checkbox onChange={
                        (e) => {
                            if (e.target.checked) {
                                setSelectedWorkingDays([...selectedWorkingDays, "sexta"])
                            } else {
                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "sexta"))
                            }

                            console.log(selectedWorkingDays)
                        }} />} label="Sexta" />
                    <FormControlLabel control={<Checkbox onChange={
                        (e) => {
                            if (e.target.checked) {
                                setSelectedWorkingDays([...selectedWorkingDays, "sabado"])
                            } else {
                                setSelectedWorkingDays(selectedWorkingDays.filter((day: any) => day !== "sabado"))
                            }

                            console.log(selectedWorkingDays)
                        }} />} label="Sábado" />
                </div> */}

                <button
                    className="bg-primary-base px-7 py-3 text-white rounded-md mt-4 "
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    Cadastrar
                </button>
            </div>
        </div>
    )
}

export default CreateUnidade