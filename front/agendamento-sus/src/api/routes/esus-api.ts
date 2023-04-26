import { Axios, AxiosResponse } from 'axios';
import { instance } from '../instance';
import { UnitESUS } from '../../interfaces/interfaces';

const getEsusUnits = async () => {
  return await instance
    .get<AxiosResponse<UnitESUS[]>>('http://localhost:8000/api/units/esus')
    .then(response => response.data.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
};

export default {
  getEsusUnits,
};
