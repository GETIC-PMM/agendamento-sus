import { instance } from '../instance';
import { useMutation } from '@tanstack/react-query';

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
      instance
        .post('api/units', {
          ...params,
        })
        .then(
          response => response.data.data,
          error => console.error(error),
        ),
  });
};
