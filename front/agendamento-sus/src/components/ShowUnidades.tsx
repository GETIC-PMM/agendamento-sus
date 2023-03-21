import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiEdit, FiSearch, FiTrash } from 'react-icons/fi';

interface Unidade {
    id: number;
    nome: string;
    endereco: string;
    sigla: string;
    horarioInicio: string;
    horarioFim: string;
}

const ShowUnidades = () => {
    const unidadeData = [
        { id: 1, nome: "Unidade 1", endereco: "Rua 1", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
        { id: 2, nome: "Unidade 2", endereco: "Rua 2", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
        { id: 3, nome: "Unidade 3", endereco: "Rua 3", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
        { id: 3, nome: "Unidade 3", endereco: "Rua 3", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
        { id: 3, nome: "Unidade 3", endereco: "Rua 3", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
        { id: 3, nome: "Unidade 3", endereco: "Rua 3", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
        { id: 3, nome: "Unidade 3", endereco: "Rua 3", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
        { id: 3, nome: "Unidade 3", endereco: "Rua 3", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
        { id: 3, nome: "Unidade 3", endereco: "Rua 3", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
        { id: 3, nome: "Unidade 3", endereco: "Rua 3", sigla: "UPA", horarioInicio: "07:00", horarioFim: "17:00" },
    ]

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
                    <TableCell align="center">Localização</TableCell>
                    <TableCell align="center">Sigla</TableCell>
                    <TableCell align="center">Horário</TableCell>
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
                            <TableCell align="center">{row.nome}</TableCell>
                            <TableCell align="center">{row.endereco}</TableCell>
                            <TableCell align="center">{row.sigla}</TableCell>
                            <TableCell align="center">{row.horarioInicio} as {row.horarioFim}</TableCell>
                            <TableCell align="center">
                                <div className='flex justify-center gap-2'>
                                    <FiSearch color='white' className='w-8 h-8 p-2 bg-primary-base rounded cursor-pointer' />
                                    <FiEdit color='white' className='w-8 h-8 p-2 bg-yellow-warning rounded cursor-pointer' />
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