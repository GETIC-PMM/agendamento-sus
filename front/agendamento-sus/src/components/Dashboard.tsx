import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
import { MenuItem, Select } from '@mui/material';

interface Unidade {
    id: number;
    name: string;
    open_time: string;
    close_time: string;
    appointment_quantity: number;
    available_days: string[];
}

const Dashboard = () => {
    const [unidadeData, setUnidadeData] = useState<Unidade[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>("");

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

    return (
        <div>
            <div>
                <label htmlFor="">Selecione uma unidade</label>
                <Select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    sx={{ width: "100%" }}
                >
                    {unidadeData.map((unidade) => (
                        <MenuItem key={unidade.id} value={unidade.id}>{unidade.name}</MenuItem>
                    ))}
                </Select>
            </div>
        </div>
    )
}

export default Dashboard