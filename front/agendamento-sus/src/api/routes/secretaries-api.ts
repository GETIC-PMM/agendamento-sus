import { useQuery, useMutation } from '@tanstack/react-query';
import { instance } from '../instance';
import {
  APIResponse,
  RegisterSecretarieParams,
  Secretaries,
} from '../../interfaces/interfaces';

export const useUnitSecretaries = (unitId: number) => {
  return useQuery({
    queryKey: ['unitSecretaries'],
    queryFn: () =>
      instance
        .get<APIResponse<Secretaries[]>>(
          `/secretaries/appointment_type/${unitId}`,
        )
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
  });
};

export const useMutateRegisterSecretarie = () => {
  return useMutation({
    mutationFn: (params: RegisterSecretarieParams) =>
      instance.post('/secretaries', params).then(
        response => response.data,
        error => console.error(error),
      ),
  });
};
