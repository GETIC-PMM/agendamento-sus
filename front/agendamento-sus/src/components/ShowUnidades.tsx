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
import { Checkbox, CircularProgress, FormControlLabel, IconButton, MenuItem, Modal, Select, TextField, Tooltip } from '@mui/material';

interface Unidade {
    id: number;
    name: string;
    open_time: string;
    close_time: string;
    appointment_quantity: number;
    available_days: string[];
}

interface UnitAppointmentType {
    appointment_type_id: number;
    days: DaysInterface[];
    unit_id: number;
}

interface AppointmentType {
    duration: number;
    id: number;
    name: string;
}

interface DaysInterface {
    day: string,
    slots: number
}

const ShowUnidades = () => {

    // -

    const [unidadeData, setUnidadeData] = useState<Unidade[]>([]);
    const [tiposAtendimento, setTiposAtendimento] = useState<any[]>([]);
    const [unitAppointments, setUnitAppointments] = useState<UnitAppointmentType[]>([]);

    const [isAnyUnitWithoutAppointmentData, setIsAnyUnitWithoutAppointmentData] = useState<boolean>(false);

    const [selectedTipoAtendimento, setSelectedTipoAtendimento] = useState<any>(null);
    const [, setSelectedWorkingDays] = useState<string[]>([]);

    const [unitsIsLoading, setUnitsIsLoading] = useState<boolean>(true);
    const [unitAppointmentsIsLoading, setUnitAppointmentsIsLoading] = useState<boolean>(true);

    const [editUnitId, setEditUnitId] = useState<number>(-1);
    const [editUnitName, setEditUnitName] = useState<string>("");

    const [domingoSelected, setDomingoSelected] = useState<boolean>(false);
    const [segundaSelected, setSegundaSelected] = useState<boolean>(false);
    const [tercaSelected, setTercaSelected] = useState<boolean>(false);
    const [quartaSelected, setQuartaSelected] = useState<boolean>(false);
    const [quintaSelected, setQuintaSelected] = useState<boolean>(false);
    const [sextaSelected, setSextaSelected] = useState<boolean>(false);
    const [sabadoSelected, setSabadoSelected] = useState<boolean>(false);

    const [domingoSlots, setDomingoSlots] = useState<number | null>(null);
    const [segundaSlots, setSegundaSlots] = useState<number | null>(null);
    const [tercaSlots, setTercaSlots] = useState<number | null>(null);
    const [quartaSlots, setQuartaSlots] = useState<number | null>(null);
    const [quintaSlots, setQuintaSlots] = useState<number | null>(null);
    const [sextaSlots, setSextaSlots] = useState<number | null>(null);
    const [sabadoSlots, setSabadoSlots] = useState<number | null>(null);

    const [open, setOpen] = useState(false);

    //--

    //UTILS
    const handleClose = () => {
        setUnitAppointments([]);
        setSelectedTipoAtendimento(null);
        setOpen(false)
    };

    const handleOpen = (unitId: number) => {
        getUnitAppointments(unitId);
        setOpen(true);
    }
    const FixDaysStructureToSubmit = () => {
        const _days: DaysInterface[] = [
            {
                day: "Domingo",
                slots: domingoSlots ? domingoSlots : 0
            },
            {
                day: "Segunda",
                slots: segundaSlots ? segundaSlots : 0
            },
            {
                day: "Terca",
                slots: tercaSlots ? tercaSlots : 0
            },
            {
                day: "Quarta",
                slots: quartaSlots ? quartaSlots : 0
            },
            {
                day: "Quinta",
                slots: quintaSlots ? quintaSlots : 0
            },
            {
                day: "Sexta",
                slots: sextaSlots ? sextaSlots : 0
            },
            {
                day: "Sabado",
                slots: sabadoSlots ? sabadoSlots : 0
            }
        ]

        return _days
    }


    //REQUISIÇÕES
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

    const submiteditUnitId = async () => {
        console.log("EDIT UNIT DATA: ", editUnitId)
        await axios.post('http://localhost:8000/api/secretaries', {
            unit_id: editUnitId,
            appointment_type_id: selectedTipoAtendimento,
            days: FixDaysStructureToSubmit()
        },
            {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token')
                }
            })
            .then(res => {
                setSelectedTipoAtendimento(null)

                setDomingoSelected(false);
                setSegundaSelected(false);
                setTercaSelected(false);
                setQuartaSelected(false);
                setQuintaSelected(false);
                setSextaSelected(false);
                setSabadoSelected(false);

                setDomingoSlots(null);
                setSegundaSlots(null);
                setTercaSlots(null);
                setQuartaSlots(null);
                setQuintaSlots(null);
                setSextaSlots(null);
                setSabadoSlots(null);

                setSelectedWorkingDays([]);
                getUnitAppointments(editUnitId);
                console.log(res)
            }
            )
            .catch(err => {
                console.log(err)
            })
    }

    const getUnitAppointments = async (unitId: number) => {
        await axios.get(`http://localhost:8000/api/secretaries/appointment_type/${unitId}`, {
            headers: {
                "Authorization": `Bearer ${Cookies.get('token')}`
            }
        }).then(response => {
            setUnitAppointments(response.data.data);
            setUnitAppointmentsIsLoading(false);
            console.log(response.data.data)
        })
    }


    const handleDeleteSecretarie = async (unitId: number, appointment_type_id: number) => {
        await axios.delete(`http://localhost:8000/api/secretaries/${unitId}/${appointment_type_id}`, {
            headers: {
                "Authorization": `Bearer ${Cookies.get('token')}`
            }
        }).then(response => {
            console.log(response.data.data)
            getUnitAppointments(editUnitId);
        })
    }

    //
    useEffect(() => {
        axios.get('http://localhost:8000/api/units', {
            headers: {
                "Authorization": `Bearer ${Cookies.get('token')}`
            }
        }).then(response => {
            setUnidadeData(response.data.data);
            console.log(response.data.data)
            unidadeData.map((unidade) => {
                if (!unidade.appointment_quantity || !unidade.available_days) {
                    setIsAnyUnitWithoutAppointmentData(true);
                }
            })
            setUnitsIsLoading(false);
        }).catch(error => {
            console.log(error);
        })

        getTiposAntendimento();
    }, [])

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '20%',
                    overflowY: 'scroll',
                    height: '100%',
                    display: 'block',
                    maxHeight: '80%',

                }}
            >
                <div
                    className='py-6 w-3/4 px-6 rounded  flex flex-col bg-zinc-100'
                >
                    <span className='text-lg font-bold text-center text-primary-base'>Editar dados de agendamento</span>
                    <div className='flex flex-col mt-4 w-full'>
                        <TextField label="Unidade de Saúde" disabled value={editUnitName}></TextField>
                        <h1 className='my-5 font-bold text-center'>Atendimentos da unidade</h1>
                        {
                            unitAppointmentsIsLoading ? (
                                <div className='flex items-center justify-center'>
                                    <CircularProgress />
                                </div>
                            ) :
                                unitAppointments.length > 0 ?
                                    unitAppointments?.map((appointment) => {

                                        const appointment_name = tiposAtendimento.find((tipo) => tipo.id === appointment.appointment_type_id)?.name;

                                        return (
                                            <div key={appointment.appointment_type_id} className='flex flex-col mb-4  border-zinc-400 rounded py-2'>
                                                <div className='flex justify-between pr-3'>
                                                    <span className='font-bold text-primary-base'>{appointment_name}</span>
                                                    <Tooltip title="Excluir atendimento">
                                                        <IconButton onClick={() => { handleDeleteSecretarie(editUnitId, appointment.appointment_type_id) }}>
                                                            <FiTrash size={16} color='red' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                                <span>
                                                    <TableContainer component={Paper}>
                                                        <Table aria-label="simple table">
                                                            <TableHead>
                                                                <TableRow sx={{ backgroundColor: "#01499B" }}>
                                                                    <TableCell sx={{ color: "white" }}>Dia</TableCell>
                                                                    <TableCell sx={{ color: "white" }} align='center'>Vagas</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {appointment.days.map((day) => {
                                                                    return (
                                                                        <>
                                                                            {
                                                                                day.slots > 0 ? (
                                                                                    <TableRow>
                                                                                        <TableCell>{day.day.charAt(0).toUpperCase() + day.day.slice(1) + " "} </TableCell>
                                                                                        <TableCell align='center'>{day.slots}</TableCell>
                                                                                    </TableRow>
                                                                                ) : null
                                                                            }
                                                                        </>
                                                                    )
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>

                                                </span>
                                            </div>
                                        )
                                    }) :
                                    <>
                                        <div className='bg-red-error mb-3 rounded py-4 text-white text-sm text-center'>
                                            <span className='font-bold'>
                                                Não existem tipos de atendimentos cadastrados para essa unidade.
                                            </span>
                                        </div>
                                    </>
                        }
                        <h1 className='my-2 text-primary-base font-bold text-center'>Adicionar novo tipo de atendimento</h1>
                        <Select value={selectedTipoAtendimento} onChange={(e) => { setSelectedTipoAtendimento(e.target.value) }}>
                            {tiposAtendimento.map((tipo) => (
                                <MenuItem key={tipo.id} value={tipo.id}>{tipo.name}</MenuItem>
                            ))}
                        </Select>
                        {
                            selectedTipoAtendimento && (
                                <div className='flex flex-col mt-4'>
                                    <h3 className='mt-4'>Dias de atendimento da unidade:</h3>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: "#01499B" }}>
                                                    <TableCell sx={{ color: "white" }}>Dia</TableCell>
                                                    <TableCell sx={{ color: "white" }} align='center'>Vagas</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormControlLabel
                                                            control={<Checkbox onChange={
                                                                (e) => {
                                                                    setDomingoSelected(e.target.checked)
                                                                }}
                                                            />}
                                                            label="Domingo"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type='number'
                                                            disabled={!domingoSelected}
                                                            value={domingoSlots}
                                                            onChange={
                                                                (e) => {
                                                                    setDomingoSlots(Number(e.target.value))
                                                                }
                                                            }
                                                            className='w-full'
                                                            InputProps={{
                                                                style: {
                                                                    padding: '0',
                                                                    height: '30px',
                                                                    fontSize: '12px',
                                                                    width: '100%'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormControlLabel
                                                            control={<Checkbox onChange={
                                                                (e) => {
                                                                    setSegundaSelected(e.target.checked)
                                                                }}
                                                            />}
                                                            label="Segunda"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type='number'
                                                            disabled={!segundaSelected}
                                                            value={segundaSlots}
                                                            onChange={
                                                                (e) => {
                                                                    setSegundaSlots(Number(e.target.value))
                                                                }
                                                            }
                                                            className='w-full'
                                                            InputProps={{
                                                                style: {
                                                                    padding: '0',
                                                                    height: '30px',
                                                                    fontSize: '12px',
                                                                    width: '100%'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormControlLabel
                                                            control={<Checkbox onChange={
                                                                (e) => {
                                                                    setTercaSelected(e.target.checked)
                                                                }}
                                                            />}
                                                            label="Terça"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type='number'
                                                            disabled={!tercaSelected}
                                                            value={tercaSlots}
                                                            onChange={
                                                                (e) => {
                                                                    setTercaSlots(Number(e.target.value))
                                                                }
                                                            }
                                                            className='w-full'
                                                            InputProps={{
                                                                style: {
                                                                    padding: '0',
                                                                    height: '30px',
                                                                    fontSize: '12px',
                                                                    width: '100%'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormControlLabel
                                                            control={<Checkbox onChange={
                                                                (e) => {
                                                                    setQuartaSelected(e.target.checked)
                                                                }}
                                                            />}
                                                            label="Quarta"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type='number'
                                                            disabled={!quartaSelected}
                                                            value={quartaSlots}
                                                            onChange={
                                                                (e) => {
                                                                    setQuartaSlots(Number(e.target.value))
                                                                }
                                                            }
                                                            className='w-full'
                                                            InputProps={{
                                                                style: {
                                                                    padding: '0',
                                                                    height: '30px',
                                                                    fontSize: '12px',
                                                                    width: '100%'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormControlLabel
                                                            control={<Checkbox onChange={
                                                                (e) => {
                                                                    setQuintaSelected(e.target.checked)
                                                                }}
                                                            />}
                                                            label="Quinta"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type='number'
                                                            disabled={!quintaSelected}
                                                            value={quintaSlots}
                                                            onChange={
                                                                (e) => {
                                                                    setQuintaSlots(Number(e.target.value))
                                                                }
                                                            }
                                                            className='w-full'
                                                            InputProps={{
                                                                style: {
                                                                    padding: '0',
                                                                    height: '30px',
                                                                    fontSize: '12px',
                                                                    width: '100%'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormControlLabel
                                                            control={<Checkbox onChange={
                                                                (e) => {
                                                                    setSextaSelected(e.target.checked)
                                                                }}
                                                            />}
                                                            label="Sexta"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type='number'
                                                            disabled={!sextaSelected}
                                                            value={sextaSlots}
                                                            onChange={
                                                                (e) => {
                                                                    setSextaSlots(Number(e.target.value))
                                                                }
                                                            }
                                                            className='w-full'
                                                            InputProps={{
                                                                style: {
                                                                    padding: '0',
                                                                    height: '30px',
                                                                    fontSize: '12px',
                                                                    width: '100%'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        <FormControlLabel
                                                            control={<Checkbox onChange={
                                                                (e) => {
                                                                    setSabadoSelected(e.target.checked)
                                                                }}
                                                            />}
                                                            label="Sabado"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type='number'
                                                            disabled={!sabadoSelected}
                                                            value={sabadoSlots}
                                                            onChange={
                                                                (e) => {
                                                                    setSabadoSlots(Number(e.target.value))
                                                                }
                                                            }
                                                            autoComplete=""
                                                            className='w-full'
                                                            InputProps={{
                                                                style: {
                                                                    padding: '0',
                                                                    height: '30px',
                                                                    fontSize: '12px',
                                                                    width: '100%'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <button
                                        onClick={submiteditUnitId}
                                        className="bg-primary-base px-7 py-3 text-white rounded-md mt-4 "
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Modal >




            {
                unitsIsLoading ? <div className='flex items-center justify-center'><CircularProgress /></div> : (
                    <>
                        <div className='bg-red-error mb-3 rounded p-2 text-white text-sm text-center w-full'>
                            <span className='block font-bold'>Sempre confira se existem unidades sem dados de agendamento definidos.</span>
                            <span className='block'>Defina os dados de agendamento pressionando o icone  <span><FiEdit style={{ display: "unset" }} /></span></span>
                        </div>
                        <TableContainer component={Paper} className="whitespace-nowrap">
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
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                                <TableBody>
                                    {unidadeData.map((row: Unidade) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <>
                                                <TableCell component="th" scope="row">
                                                    {row.id}
                                                </TableCell>
                                                <TableCell align="center">{row.name}</TableCell>
                                                <TableCell align="center">{dayjs(row.open_time).format('HH:mm')} as {dayjs(row.close_time).format('HH:mm')}</TableCell>
                                                <TableCell >
                                                    <div className='flex gap-1 justify-center'>
                                                        <div
                                                            className='flex justify-center'
                                                            onClick={() => {
                                                                setEditUnitId(row.id);
                                                                setEditUnitName(row.name);
                                                                handleOpen(row.id);
                                                            }}
                                                        >
                                                            <FiEdit
                                                                color={'white'}
                                                                className={`w-8 h-8 p-2 ${isAnyUnitWithoutAppointmentData ? 'bg-red-error' : 'bg-primary-base'} rounded cursor-pointer`}
                                                            />
                                                        </div>
                                                        <div className='flex justify-center'>
                                                            <FiTrash color='white' className={`w-8 h-8 p-2 bg-primary-base rounded cursor-pointer`} />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
        </>
    )
}

export default ShowUnidades