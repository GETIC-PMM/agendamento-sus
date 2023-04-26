import { AxiosResponse } from 'axios';
import { instance } from '../instance';
import { AppointmentType } from '../../interfaces/interfaces';

const getAppointmentTypes = async () => {
  const { data } = await instance
    .get<AxiosResponse<AppointmentType[]>>(
      'http://localhost:8000/api/appointment-types',
    )
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw error;
    });

  return data;
};

const getUnitAppointmentsById = async (unitId: string) => {
  return instance
    .get<AxiosResponse<AppointmentType[]>>(
      `http://localhost:8000/api/appointment-types/${unitId}`,
    )
    .then(response => response.data.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
};

export default {
  getAppointmentTypes,
  getUnitAppointmentsById,
};
