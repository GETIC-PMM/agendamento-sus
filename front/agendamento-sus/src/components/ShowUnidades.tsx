import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiEdit, FiSearch, FiTrash } from 'react-icons/fi';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import * as dayjs from 'dayjs';

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
    }, [])


    const tableBorder = "border-r border-zinc-400"

    return (
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
                            <TableCell align="center">{row.appointment_quantity}</TableCell>
                            <TableCell align="center">{row.available_days.map((day) => {
                                return (
                                    <span className='block'>
                                        {day.replace(/^\w/, c => c.toUpperCase()).substring(0, 3)}
                                    </span>
                                )
                            })}</TableCell>
                            <TableCell align="center">
                                <div className='flex justify-center gap-2'>
                                    <FiTrash color='white' className='w-8 h-8 p-2 bg-red-error rounded cursor-pointer' />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ShowUnidades