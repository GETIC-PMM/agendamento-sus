import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { CircularProgress, Container, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import * as dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { cpfFormatter } from '../../utils/cpf-formatter';
import { weekStringToWeekNumber } from '../../utils/weekStringToWeekNumber';
import { telFormatter } from '../../utils/tel-formatter';

interface tiposAtendimentoType {
    id: number,
    name: string,
    duration: number,
}

interface UnidadeType {
    appointment_quantity: number,
    appointment_type_id: number[],
    available_days: string[],
    bairro: string,
    close_time: string,
    id: number,
    name: string,
    numero: string,
    open_time: string,
    rua: string,
}

const AgendarAtendimento = () => {
    // const citizen = useContext(CitizenContext);
    const [unidade, setUnidade] = useState<UnidadeType>();
    const [unidadeTypes, setUnidadeTypes] = useState<Number[]>([]);
    const [tiposAtendimento, setTiposAtendimento] = useState<tiposAtendimentoType[]>([]);
    const [typesInThisUnit, setTypesInThisUnit] = useState<tiposAtendimentoType[]>([]);
    const [avaliableDays, setAvaliableDays] = useState<Number[]>([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState<boolean>(true);
    const [telefone, setTelefone] = useState<string>("");
    const [isWhatsapp, setIsWhatsapp] = useState<string>("");

    const [date, setDate] = useState<Date>(dayjs(new Date()).toDate());

    const [selectedType, setSelectedType] = useState("")

    const citizen = {
        name: "João",
        cpf: 18467496460,
        unit: "CLINICA QUALIFISIO"
    }

    const getUnits = async () => {
        await axios.get(`http://localhost:8000/api/units/${citizen.unit}`)
            .then(response => {
                setUnidadeTypes(response.data.data[0].appointment_type_id)
            })
            .catch(error => {
                console.log(error);
            })

        await axios.get(`http://localhost:8000/api/units/${citizen.unit}`, {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('token')
            }
        }).then(res => {
            setUnidade(res.data.data[0])
            console.log(res.data.data[0])
            const _avaliableDays = weekStringToWeekNumber(res.data.data[0].available_days);
            setAvaliableDays(_avaliableDays);
        }).catch(err => {
            console.log(err)
        })


    }

    const getTiposAntendimento = async () => {
        await axios.get('http://localhost:8000/api/appointment-types', {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('token')
            }
        }).then(res => {
            setTiposAtendimento(res.data.data);
            console.log(res.data.data)


        }).catch(err => {
            console.log(err)
        })
    }

    const getInfos = async () => {
        await getUnits();
        await getTiposAntendimento();

        setLoading(false);
    }

    const shouldDisableDate = (date: Date) => {
        const _day = dayjs(date).day();
        if (!avaliableDays.includes(_day)) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        if (citizen?.name === "" || citizen?.cpf === 0 || citizen?.unit === "") {
            window.location.href = "/"
        }

        getInfos();
    }, [])

    useEffect(() => {
        const _typesInThisUnit = unidadeTypes?.map((id) => {
            const object = tiposAtendimento.find((o) => o.id === id);
            return object ? { ...object } : null;
        });

        setTypesInThisUnit(_typesInThisUnit as tiposAtendimentoType[]);
    }, [tiposAtendimento])

    const handleSubmit = async () => {
        console.log(citizen.name)
        await axios.post('http://localhost:8000/api/appointments', {
            name: "joao",
            cpf: citizen.cpf,
            date: date,
            unit_id: unidade?.id,
            status: "pendente",
            user_id: citizen.cpf,
            appointment_type_id: selectedType
        }, {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('token')
            }
        })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            {loading ? <div className="h-screen w-screen flex items-center justify-center bg-login-bg bg-cover">
                <CircularProgress />
            </div> :
                <div className="w-full flex items-center justify-center bg-login-bg bg-cover overflow-x-hidden">
                    <div className="py-16 my-10 md:px-[140px] px-4 w-full md:w-[75%] bg-primary-base flex items-center md:rounded-[10px] font-medium flex-col gap-7 relative">
                        <div>
                            <h1 className="text-white text-2xl ">{`Bem-vindo(a), ${citizen?.name}.`}</h1>
                            <h3 className='text-white text-base text-center font-light'>Agendamento SUS</h3>
                        </div>
                        <div className='flex flex-col gap-3 w-full'>
                            <div>
                                <label htmlFor="" className="text-zinc-200 text-sm">CPF:</label>
                                <input value={cpfFormatter(citizen.cpf.toString())} disabled className="w-full bg-zinc-300 h-12 pl-4 border rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="" className="text-zinc-200 text-sm">Nome:</label>
                                <input value={citizen?.name} disabled className="w-full bg-zinc-300 h-12 pl-4 border rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="" className="text-zinc-200 text-sm">Unidade:</label>
                                <input value={citizen?.unit} disabled className="w-full bg-zinc-300 h-12 pl-4 border rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="" className="text-zinc-200 text-sm">Telefone:</label>
                                <input maxLength={15} value={telFormatter(telefone)} onChange={(e) => { setTelefone(e.target.value) }} className="w-full h-12 pl-4 border rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="" className="text-zinc-200 text-sm">Esse telefone é whatsapp?</label>
                                <RadioGroup
                                    value={isWhatsapp}
                                    defaultValue={"sim"}
                                    onChange={(e) => {
                                        setIsWhatsapp(e.target.value)
                                    }}
                                    row
                                >
                                    <FormControlLabel sx={{ color: "white", fontSize: "10px" }} value={"sim"} control={<Radio sx={{
                                        color: "white", '&.Mui-checked': {
                                            color: "#038548",
                                        },
                                    }} />} label="Sim" />
                                    <FormControlLabel sx={{ color: "white", fontSize: "10px" }} value={"nao"} control={<Radio sx={{
                                        color: "white", '&.Mui-checked': {
                                            color: "#038548",
                                        }
                                    }} />} label="Nao" />
                                </RadioGroup>
                            </div>

                            <div>
                                <h2 className='text-zinc-200 text-sm'>Escolha a data:</h2>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={date}

                                        onChange={(newValue) => {
                                            setDate(newValue as Date);
                                        }}
                                        shouldDisableDate={shouldDisableDate}
                                        className='w-full text-white bg-white pl-4 border rounded-md'
                                        renderInput={(params) => <TextField sx={{ width: '100%' }} className='w - full text- white bg-zinc-300 pl-4 border rounded-md' {...params} />}
                                    />
                                </LocalizationProvider>
                                <div>

                                    <h2 className='text-zinc-200 text-sm mt-4'>Escolha o tipo de atendimento:</h2>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue=""
                                        value={selectedType}
                                        onChange={(e) => { setSelectedType(e.target.value) }}
                                        name="radio-buttons-group"
                                        className='mt-2'
                                        row
                                    >
                                        {
                                            typesInThisUnit?.map((type) => {
                                                return (
                                                    <FormControlLabel sx={{ color: "white", fontSize: "12px" }} value={type.id} control={<Radio sx={{
                                                        color: "white", '&.Mui-checked': {
                                                            color: "#038548",
                                                        },
                                                    }} />} label={type.name} />
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                </div>
                            </div>

                            <button className='bg-green-800 text-white rounded-lg py-3 self-center px-4 max-w-fit md:w-full mt-4' onClick={handleSubmit}>Confirmar agendamento</button>

                        </div>

                    </div>
                </div>
            }

        </div>
    )
}

export default AgendarAtendimento