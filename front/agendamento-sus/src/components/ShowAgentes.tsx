import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, TableFooter, TablePagination, Box, IconButton, useTheme } from '@mui/material'
import axios from 'axios'
import Cookies from 'js-cookie';
import React, { useEffect } from 'react'
import { FiSearch, FiEdit, FiTrash } from 'react-icons/fi'
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

interface Agente {
    id: number;
    name: string;
    email: string;
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

const ShowAgentes = () => {
    const [users, setUsers] = React.useState<Agente[]>([])
    const [loading, setLoading] = React.useState(true)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    useEffect(() => {
        console.log(Cookies.get('token'))
        axios.get('http://localhost:8000/api/users', {
            headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`
            }
        })
            .then(res => {
                console.log(res.data.data)
                setUsers(res.data.data)
                setLoading(false)
            })
    }, [])

    function TablePaginationActions(props: TablePaginationActionsProps) {
        const theme = useTheme();
        const { count, page, rowsPerPage, onPageChange } = props;

        const handleFirstPageButtonClick = (
            event: React.MouseEvent<HTMLButtonElement>,
        ) => {
            onPageChange(event, 0);
        };

        const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, page - 1);
        };

        const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, page + 1);
        };

        const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };

        return (
            <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="Primeira página"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Página anterior"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Próxima página"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Última página"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </Box>
        );
    }

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            {loading && <div className='h-[calc(100vh-141.6px)] w-full flex items-center justify-center'><CircularProgress /></div> ||
                <TableContainer component={Paper} className="whitespace-nowrap">
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow >
                                <TableCell colSpan={6} className='bg-primary-base-alt'></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableRow className='bg-zinc-200'>
                            <TableCell>ID</TableCell>
                            <TableCell align="center">Nome</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Ações</TableCell>
                        </TableRow>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : users
                            ).map((row: Agente) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align="center">{row.name}</TableCell>
                                    <TableCell align="center">{row.email}</TableCell>
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
                        <TableFooter>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'Tudo', value: -1 }]}
                                colSpan={3}
                                lang='ptBR'
                                count={users.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'linhas por página',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableFooter>
                    </Table>
                </TableContainer>
            }
        </div>
    )
}

export default ShowAgentes