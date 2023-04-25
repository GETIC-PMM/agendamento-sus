import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const TipoAtendimento = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [newAtendimento, setNewAtendimento] = useState("");
    const [newDuration, setNewDuration] = useState(0);
    const [tiposAtendimento, setTiposAtendimento] = useState<any[]>([]);

    const handleCreateNewAtendimento = async () => {
        await axios.post('http://localhost:8000/api/appointment-types', {
            name: newAtendimento,
            duration: newDuration,
        }, {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('token')
            }
        });

        setNewAtendimento('');
        setNewDuration(0);
        getTiposAntendimento();
    }

    const getTiposAntendimento = async () => {
        await axios.get('http://localhost:8000/api/appointment-types', {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('token')
            }
        }).then(res => {
            console.log(res.data.data)
            setTiposAtendimento(res.data.data);
            setIsLoading(false);
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getTiposAntendimento();
    }, [])

    return (
        <>
            {isLoading ? <div className='h-[calc(100vh-141.6px)] w-full flex items-center justify-center'><CircularProgress /></div> :
                <div className="border-t-[50px] border-t-primary-base rounded-lg border border-zinc-200 p-6 drop-shadow">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tipo de atendimento</TableCell>
                                    <TableCell>Duração</TableCell>
                                    <TableCell align='right'>Excluir</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    tiposAtendimento.map((tipoAtendimento) => {
                                        return (
                                            <TableRow key={tipoAtendimento.id}>
                                                <TableCell>{tipoAtendimento.name}</TableCell>
                                                <TableCell>{tipoAtendimento.duration} minutos</TableCell>
                                                <TableCell align='right'>
                                                    <Button size='small' variant="contained" color='error'>Excluir</Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <hr />
                    <div className="mt-4 flex w-full gap-4">
                        <TextField
                            value={newAtendimento}
                            onChange={(event) => {
                                setNewAtendimento(event.target.value);
                            }} sx={{ width: "100%" }}
                            label="Novo tipo de atendimento"
                        />
                        <TextField
                            value={newDuration}
                            onChange={(event) => {
                                setNewDuration(Number(event.target.value));
                            }} sx={{ width: "50%" }}
                            label="Duração (em minutos)"
                        />
                        <Button
                            onClick={() => {
                                handleCreateNewAtendimento();
                            }}
                            variant="contained"
                            sx={{ width: "50%" }}
                        >
                            Cadastrar
                        </Button>
                    </div>
                </div>
            }
        </>
    )
}

export default TipoAtendimento