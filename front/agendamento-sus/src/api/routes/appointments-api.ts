import { AxiosResponse } from 'axios';
import { instance } from '../instance';

const getUnitAppointmentsById = async (unitId: string) => {
    return await instance.get(`appointments/units/${unitId}`)
        .then(response => response.data)
        .catch(error => { console.error(error); throw error });
}

export default {
    getUnitAppointmentsById
}