import { AxiosResponse } from 'axios';
import { Unidade } from '../../interfaces/interfaces';
import { instance } from '../instance';
import { useQuery } from '@tanstack/react-query';

export const useUnitAppointmentsById = (unitId: string) => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await instance
        .get<AxiosResponse<Unidade>>(`appointments/units/${unitId}`)
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        });

      return data;
    },
  });
};
