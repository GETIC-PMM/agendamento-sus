import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiTrash, FiEdit } from 'react-icons/fi';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import * as dayjs from 'dayjs';
import { Checkbox, FormControlLabel, MenuItem, Modal, Select, TextField } from '@mui/material';

interface Unidade {
    id: number;
    name: string;
    open_time: string;
    close_time: string;
    appointment_quantity: number;
    available_days: string[];
}

const ShowUnidades = () => {
    const [unidadeData, setUnidadeData] = useState<Unidade[]>([]);
    const [editUnitData, setEditUnitData] = useState<Unidade>({} as Unidade);
    const [isAnyUnitWithoutAppointmentData, setIsAnyUnitWithoutAppointmentData] = useState<boolean>(false);
    const [tiposAtendimento, setTiposAtendimento] = useState<any[]>([]);
    const [selectedTipoAtendimento, setSelectedTipoAtendimento] = useState<any>(null);
    const [vacancyPerDay, setVacancyPerDay] = useState<number>(0);
    const [selectedWorkingDays, setSelectedWorkingDays] = useState<string[]>([]);
    const [unitAppointments, setUnitAppointments] = useState<any[]>([]);

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false)
        setSelectedTipoAtendimento(null);
    };

    const handleOpen = (unitId: number) => {
        getUnitAppointments(unitId);
        setOpen(true);
    }

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
        axios.get('http://localhost:8000/api/units', {
            headers: {
                "Authorization": `Bearer ${Cookies.get('token')}`
            }
        }).then(response => {
            setUnidadeData(response.data.data);
            unidadeData.map((unidade) => {
                if (!unidade.appointment_quantity || !unidade.available_days) {
                    setIsAnyUnitWithoutAppointmentData(true);
                }
            })
        }).catch(error => {
            console.log(error);
        })

        getTiposAntendimento();
    }, [])

    const submitEditUnitData = async () => {
        console.log("EDIT UNIT DATA: ", editUnitData)
        axios.post('http://localhost:8000/api/secretaries', {
            unit_id: editUnitData.id,
            appointment_type_id: selectedTipoAtendimento,
            quantity: vacancyPerDay,
            days: selectedWorkingDays
        },
            {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token')
                }
            })
            .then(res => {
                setSelectedTipoAtendimento(null)
                setSelectedWorkingDays([]);
                console.log(res)
            }
            )
            .catch(err => {
                console.log(err)
            })
    }

    const getUnitAppointments = async (unitId: number) => {
        axios.get(`http://localhost:8000/api/secretaries/appointment_type/${unitId}`, {
            headers: {
                "Authorization": `Bearer ${Cookies.get('token')}`
            }
        }).then(response => {
            setUnitAppointments(response.data.data);
            console.log(response.data.data)
        })
    }

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div
                    className='py-6 w-3/4 px-6 rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-zinc-100'
                >
                    <span className='text-lg font-bold text-center text-primary-base'>Editar dados de agendamento</span>
                    <div className='flex flex-col mt-4'>
                        <TextField label="Unidade de Saúde" disabled value={editUnitData.name}></TextField>
                        <h1 className='my-5 font-bold text-center'>Configurar atendimentos da unidade</h1>
                        {
                            unitAppointments?.map((appointment) => {
                                return (
                                    <div key={appointment.appointment_type_id} className='flex flex-col mt-4'>
                                        <span>{appointment.appointment_type_id}</span>
                                        <span>{appointment.quantity}</span>
                                        <span>{appointment.days}</span>
                                    </div>
                                )
                            })
                        }
                        <Select value={selectedTipoAtendimento} onChange={(e) => { setSelectedTipoAtendimento(e.target.value) }}>
                            {tiposAtendimento.map((tipo) => (
                                <MenuItem key={tipo.id} value={tipo.id}>{tipo.name}</MenuItem>
                            ))}
                        </Select>
                        {
                            selectedTipoAtendimento && (
                                <div className='flex flex-col mt-4'>
                                    <div className="flex flex-col mt-4">
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
                                    </div>
                                    <button
                                        onClick={submitEditUnitData}
                                        className="bg-primary-base px-7 py-3 text-white rounded-md mt-4 "
                                    >
                                        Adicionar tipo de atendimento
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Modal>


            <TableContainer component={Paper} className="whitespace-nowrap">
                {
                    isAnyUnitWithoutAppointmentData && (
                        <div className='bg-red-error p-2 text-white text-sm text-center w-full'>
                            <span className='block'>Existem unidades sem dados de agendamento definidos.</span>
                            <span className='block'>Por favor, defina os dados de agendamento para todas as unidades.</span>
                        </div>
                    )
                }
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow >
                            <TableCell colSpan={6} className='bg-primary-base-alt'></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableRow className='bg-zinc-200'>
                        <TableCell>ID</TableCell>
                        <TableCell align="center">Unidade</TableCell>
                        <TableCell align="center">Horário</TableCell>
                        <TableCell align="center">Vagas por dia</TableCell>
                        <TableCell align="center">Dias de funcionamento</TableCell>
                        <TableCell align="center">Ações</TableCell>
                    </TableRow>
                    <TableBody>
                        {unidadeData.map((row: Unidade) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{dayjs(row.open_time).format('HH:mm')} as {dayjs(row.close_time).format('HH:mm')}</TableCell>
                                <TableCell align="center">{row.appointment_quantity ? row.appointment_quantity : <span className='text-red-500'>A DEFINIR</span>}</TableCell>
                                <TableCell align="center">{row.available_days ? row.available_days.map((day) => {
                                    return (
                                        <span className='block'>
                                            {day.replace(/^\w/, c => c.toUpperCase()).substring(0, 3)}
                                        </span>
                                    )
                                }) : <span className='text-red-500'>A DEFINIR</span>}</TableCell>
                                <TableCell >
                                    <div className='flex gap-1 justify-center'>
                                        <div
                                            className='flex justify-center'
                                            onClick={() => {
                                                handleOpen(row.id);
                                            }}
                                        >
                                            <FiEdit
                                                color='white'
                                                className={`w-8 h-8 p-2 ${!row.appointment_quantity || !row.available_days ? 'bg-red-error' : 'bg-primary-base'} rounded cursor-pointer`}
                                            />
                                        </div>
                                        <div className='flex justify-center'>
                                            <FiTrash color='white' className={`w-8 h-8 p-2 bg-primary-base rounded cursor-pointer`} />
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default ShowUnidades