import axios, { AxiosResponse } from 'axios';
import { instance } from '../instance';

const registerUnit = async (
  name: string,
  open_time: string,
  close_time: string,
  code: number,
  bairro: string,
  rua: string,
  numero: string,
) => {
  await instance
    .post('http://localhost:8000/api/units', {
      name,
      open_time,
      close_time,
      code,
      bairro,
      rua,
      numero,
    })
    .then(response => response.data.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
};

export default {
  registerUnit,
};
