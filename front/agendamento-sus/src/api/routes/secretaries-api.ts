import { useQuery, useMutation } from '@tanstack/react-query';
import { instance } from '../instance';
import {
  APIResponse,
  RegisterSecretarieParams,
  Secretarie,
} from '../../interfaces/interfaces';

export const useUnitSecretaries = ({
  unitId,
  onSuccess,
  onError,
}: {
  unitId: number | null;
  onSuccess?: (data: APIResponse<Secretarie[]>) => void;
  onError?: (error: any) => void;
}) => {
  return useQuery({
    queryKey: ['unitSecretaries', unitId],
    queryFn: () =>
      instance
        .get<APIResponse<Secretarie[]>>(
          `/secretaries/appointment_type/${unitId}`,
        )
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
    onSuccess,
    onError,
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
