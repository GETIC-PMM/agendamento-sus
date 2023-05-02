import { APIResponse, Unidade } from '../../interfaces/interfaces';
import { instance } from '../instance';
import { useMutation, useQuery } from '@tanstack/react-query';

type RegisterUnitParams = {
  name: string;
  open_time: string;
  close_time: string;
  code: number;
  bairro: string;
  rua: string;
  numero: string;
};

export const useMutateRegisterUnit = () => {
  return useMutation({
    mutationFn: (params: RegisterUnitParams) =>
      instance.post('/units', params).then(
        response => response.data.data,
        error => console.error(error),
      ),
  });
};

export const useGetUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: () =>
      instance
        .get<APIResponse<Unidade[]>>('/units')
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
  });
};
