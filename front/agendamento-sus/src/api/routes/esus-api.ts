import { Axios, AxiosResponse } from 'axios';
import { instance } from '../instance';
import { UnitESUS } from '../../interfaces/interfaces';
import { useQuery } from '@tanstack/react-query';

export const useEsusUnits = async () => {
  return useQuery({
    queryKey: ['esusUnits'],
    queryFn: async () => {
      const { data } = await instance
        .get<AxiosResponse<UnitESUS[]>>('/api/units/esus')
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        });

      return data;
    },
  });
};
