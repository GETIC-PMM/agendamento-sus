import { AxiosResponse } from 'axios';
import { instance } from '../instance';
import { Appointment } from '../../interfaces/interfaces';

const getUnitAppointmentsById = async (unitId: string) => {
  return await instance
    .get<AxiosResponse<Appointment[]>>(`appointments/units/${unitId}`)
    .then(response => response.data.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
};

export default {
  getUnitAppointmentsById,
};
