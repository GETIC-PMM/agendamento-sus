import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Checkbox, CircularProgress, FormControlLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { cpfFormatter } from '../utils/cpf-formatter';
import Typography from '@mui/material/Typography';
import * as dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';


interface Unidade {
    id: number;
    name: string;
    open_time: string;
    close_time: string;
    appointment_quantity: number;
    available_days: string[];
}

interface AppointmentType {
    id: number;
    name: string;
    cpf: string;
    date: string;
    unit_id: number;
    appointment_type_id: number;
    status: string;
    phone_number: number;
    is_phone_number_whatsapp: boolean;
}

interface scheduleData {
    startDate: Date;
    endDate: Date;
    title: string;
}

interface UnitAppointmentType {
    id: number;
    duration: number;
    name: string;
}

const Dashboard = () => {
    const [unidadeData, setUnidadeData] = useState<Unidade[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>("");
    const [unitAppointments, setUnitAppointments] = useState<AppointmentType[]>([]);
    const [selectedAppointmentType, setSelectedAppointmentType] = useState<number>();
    const [unitAppointmentTypes, setUnitAppointmentTypes] = useState<UnitAppointmentType[]>([]);
    const [cpfToFilter, setCpfToFilter] = useState<string>("");

    const [is7DayFilterChecked, setIs7DayFilterChecked] = useState<boolean>(true);

    const [isAppointmentDataLoading, setIsAppointmentDataLoading] = useState<boolean>(false);

    const getUnitAppointments = async (unitId: string, is7DayFilterChecked: boolean) => {
        await axios.get(`http://localhost:8000/api/appointments/units/${unitId}`, {
            headers: {
                "Authorization": `Bearer ${Cookies.get('token')}`
            }
        }).then(response => {
            console.log("APPOINTMENTS: ", response.data.data);
            getUnitAppointmentsType(unitId);

            const _response = response.data.data.map((appointment: AppointmentType) => {
                const _date = dayjs(appointment.date);
                const _today = dayjs(new Date().setHours(0, 0, 0, 0));
                const _7daysFromToday = dayjs(new Date()).add(7, 'day');

                if (_date.isAfter(_today) && _date.isBefore(_7daysFromToday)) {
                    return {
                        name: appointment.name,
                        date: appointment.date,
                        cpf: appointment.cpf,
                        phone_number: appointment.phone_number,
                        is_phone_number_whatsapp: appointment.is_phone_number_whatsapp,
                        appointment_type_id: appointment.appointment_type_id,
                        status: appointment.status
                    }
                } else {
                    return;
                }
            });


            const filteredArr = _response.filter((value: AppointmentType) => value !== undefined);

            console.log("_RESPONSE DATA AJUSTADA", filteredArr)

            if (is7DayFilterChecked) {
                setUnitAppointments(filteredArr);
                console.log('FILTROU')
            } else {
                setUnitAppointments(response.data.data);
                console.log('NAO FILTROU')
            }

            setIsAppointmentDataLoading(false)
        }).catch(error => {
            console.log(error);
        })
    }

    const getUnitAppointmentsType = async (unitId: string) => {
        await axios.get(`http://localhost:8000/api/appointment-types/${unitId}`, {
            headers: {
                "Authorization": `Bearer ${Cookies.get('token')}`
            }
        }).then(response => {
            console.log("APPOINTMENTS TYPES: ", response.data.data);

            if (response.data.data.length === 1) {
                const _appointmentTypes = [];
                _appointmentTypes.push(response.data.data);
                setUnitAppointmentTypes(_appointmentTypes);
            } else {
                setUnitAppointmentTypes(response.data.data);
            }

            setIsAppointmentDataLoading(false)
        }).catch(error => {
            console.log(error);
        })
    }

    const getUnitAppointmentsByCPF = async (unitId: string, cpf: string, is7DayFilterChecked: boolean) => {
        await axios.get(`http://localhost:8000/api/appointments/byCPF/${unitId}/${cpf}`, {
            headers: {
                "Authorization": `Bearer ${Cookies.get('token')}`
            }
        }).then(response => {
            const _response = response.data.data.map((appointment: AppointmentType) => {
                const _date = dayjs(appointment.date);
                const _today = dayjs(new Date().setHours(0, 0, 0, 0));
                const _7daysFromToday = dayjs(new Date()).add(7, 'day');

                if (_date.isAfter(_today) && _date.isBefore(_7daysFromToday)) {
                    return {
                        name: appointment.name,
                        date: appointment.date,
                        cpf: appointment.cpf,
                        phone_number: appointment.phone_number,
                        is_phone_number_whatsapp: appointment.is_phone_number_whatsapp,
                        appointment_type_id: appointment.appointment_type_id,
                        status: appointment.status
                    }
                } else {
                    return;
                }
            });


            const filteredArr = _response.filter((value: AppointmentType) => value !== undefined);

            if (is7DayFilterChecked) {
                setUnitAppointments(filteredArr);
                console.log('FILTROU')
            } else {
                setUnitAppointments(response.data.data);
                console.log('NAO FILTROU')
            }

            console.log("APPOINTMENTS BY CPF: ", response.data.data);
            setIsAppointmentDataLoading(false);
        })
    }

    useEffect(() => {
        axios.get('http://localhost:8000/api/units', {
            headers: {
                "Authorization": `Bearer ${Cookies.get('token')}`
            }
        }).then(response => {
            setUnidadeData(response.data.data);
            console.log("UNIDADE DATA: ", response.data.data)
        }).catch(error => {
            console.log(error);
        })

        getUnitAppointmentsType(selectedUnit);
    }, [])

    const getAppointmentTypeName = (appointmentTypeId: number) => {
        if (unitAppointmentTypes.length) {
            const _appointmentType = unitAppointmentTypes.find((appointmentType: UnitAppointmentType) => appointmentType.id === appointmentTypeId);
            return _appointmentType?.name;
        } else {
            const _unitAppointmentTypes = [] as UnitAppointmentType[];
            _unitAppointmentTypes.push(unitAppointmentTypes);
            const _appointmentType = _unitAppointmentTypes.find((appointmentType: UnitAppointmentType) => appointmentType.id === appointmentTypeId);
            return _appointmentType?.name;
        }
    }

    return (
        <div>
            <div>
                <label htmlFor="">Selecione uma unidade</label>
                <Select
                    value={selectedUnit}
                    onChange={(e) => {
                        setIsAppointmentDataLoading(true)
                        setSelectedUnit(e.target.value)
                        getUnitAppointments(e.target.value, is7DayFilterChecked)
                    }}
                    sx={{ width: "100%" }}
                >
                    {unidadeData.map((unidade) => (
                        <MenuItem key={unidade.id} value={unidade.id}>{unidade.name}</MenuItem>
                    ))}
                </Select>
                <div className='mt-4'>
                    <Accordion>
                        <AccordionSummary>
                            <Typography>Filtrar por CPF</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex gap-2'>
                                <TextField
                                    value={cpfToFilter}
                                    onChange={(e) => {
                                        setCpfToFilter(e.target.value)
                                    }}
                                    label="CPF"
                                    sx={{ width: '100%' }}
                                />
                                <button
                                    className='bg-green-500 py-2 px-6 rounded text-white'
                                    onClick={() => {
                                        setIsAppointmentDataLoading(true);
                                        getUnitAppointmentsByCPF(selectedUnit, cpfToFilter, is7DayFilterChecked);
                                    }}
                                >
                                    Filtrar
                                </button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    {/* <Accordion>
                        <AccordionSummary>
                            <Typography>Filtrar por data</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='flex gap-2'>
                                <DatePicker
                                    value={new Date()}
                                    onChange={() => { }}
                                    renderInput={(params) => <TextField sx={{ width: '100%' }} {...params} />}
                                />
                                <button className='bg-green-500 py-2 px-6 rounded text-white'>Filtrar</button>
                            </div>
                        </AccordionDetails>
                    </Accordion> */}
                    <FormControlLabel control={
                        <Checkbox
                            checked={is7DayFilterChecked}
                            onChange={(event) => {
                                setIsAppointmentDataLoading(true);
                                setIs7DayFilterChecked(event.target.checked);
                                getUnitAppointments(selectedUnit, event.target.checked);
                            }} defaultChecked />} label="Proximos 7 dias" />
                </div>

                <div className='mt-8 flex justify-center w-full'>
                    {
                        isAppointmentDataLoading ? (
                            <CircularProgress />
                        ) : (
                            <Paper sx={{ width: '100%' }}>
                                <Table >
                                    <TableHead>
                                        <TableRow style={{ backgroundColor: '#023E84' }}>
                                            <TableCell style={{ color: 'white' }} align='center'>Nome</TableCell>
                                            <TableCell style={{ color: 'white' }} align='center'>CPF</TableCell>
                                            <TableCell style={{ color: 'white' }} align='center'>Atendimento</TableCell>
                                            <TableCell style={{ color: 'white' }} align='center'>Data</TableCell>
                                            <TableCell style={{ color: 'white' }} align='center'>Status</TableCell>
                                            <TableCell style={{ color: 'white' }} align='center'>Cancelar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {unitAppointments.map((appointment) => (
                                            <TableRow key={appointment.id}>
                                                <TableCell align='center'>{appointment.name}</TableCell>
                                                <TableCell align='center'>{cpfFormatter(appointment.cpf)}</TableCell>
                                                <TableCell align='center'>{getAppointmentTypeName(appointment.appointment_type_id)}</TableCell>
                                                <TableCell align='center'>{dayjs(appointment.date).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell align='center'>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</TableCell>
                                                <TableCell align='center'>
                                                    <button className='bg-red-400 py-2 px-4 rounded text-white' color="error" onClick={() => {
                                                        console.log("CANCELAR: ", appointment.id)
                                                    }}>Cancelar</button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        )
                    }

                </div>
            </div>
        </div >
    )
}

export default Dashboard