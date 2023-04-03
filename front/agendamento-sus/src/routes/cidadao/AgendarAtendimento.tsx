import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FormControlLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';

interface tiposAtendimentoType {
    id: number,
    name: string,
    duration: number,
}

const AgendarAtendimento = () => {
    // const citizen = useContext(CitizenContext);
    const [unidade, setUnidade] = useState("");
    const [unidadeTypes, setUnidadeTypes] = useState<Number[]>([]);
    const [tiposAtendimento, setTiposAtendimento] = useState<tiposAtendimentoType[]>([]);
    const [typesInThisUnit, setTypesInThisUnit] = useState<tiposAtendimentoType[]>([]);

    const [selectedType, setSelectedType] = useState("")

    const citizen = {
        name: "João",
        cpf: "18467496460",
        unit: "CLINICA ODONTOFISIOMED"
    }

    const getUnits = async () => {
        await axios.get(`http://localhost:8000/api/units/${citizen.unit}`)
            .then(response => {
                console.log("UNIDADE TYPES: ", response.data.data[0].appointment_type_id)
                setUnidadeTypes(response.data.data[0].appointment_type_id)
            })
            .catch(error => {
                console.log(error);
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
        await getTiposAntendimento()
    }



    useEffect(() => {
        if (citizen?.name === "" || citizen?.cpf === "" || citizen?.unit === "") {
            window.location.href = "/"
        }

        getInfos();
        console.log("RESULTS: ", typesInThisUnit)
    }, [])

    useEffect(() => {
        const _typesInThisUnit = unidadeTypes?.map((id) => {
            const object = tiposAtendimento.find((o) => o.id === id);
            return object ? { ...object } : null;
        });

        setTypesInThisUnit(_typesInThisUnit as tiposAtendimentoType[]);
    }, [tiposAtendimento])


    return (
        <div>
            <div className="h-screen w-screen flex items-center justify-center bg-login-bg bg-cover">
                <div className="py-16 px-[140px] w-[75%] bg-primary-base flex items-center rounded-[10px] font-medium flex-col gap-7 relative">
                    <div>
                        <h1 className="text-white text-2xl ">{`Bem-vindo(a), ${citizen?.name}.`}</h1>
                        <h3 className='text-white text-base text-center font-light'>Agendamento SUS</h3>
                    </div>
                    <div className='flex flex-col gap-3 w-full'>
                        <div className='flex gap-3 w-full'>
                            <input value={citizen?.name} disabled className="w-full text-white h-10 pl-4 border rounded-md" />
                            <input value={citizen?.cpf} disabled className="w-full text-white h-10 pl-4 border rounded-md" />
                        </div>
                        <input value={citizen?.unit} disabled className="text-white h-10 pl-4 border rounded-md" />
                        <div>

                            <h2 className='text-white mt-4'>Escolha o tipo de atendimento:</h2>
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
                                                    color: "yellow",
                                                },
                                            }} />} label={type.name} />
                                        )
                                    })
                                }
                            </RadioGroup>
                        </div>
                        <div>
                            <h2 className='text-white mt-4'>Escolha a data:</h2>
                        </div>

                        <button onClick={() => { console.log(selectedType) }}>checar</button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AgendarAtendimento