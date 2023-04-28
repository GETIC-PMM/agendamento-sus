import { useQuery } from '@tanstack/react-query';
import { instance } from '../instance';
import { APIResponse, Secretaries } from '../../interfaces/interfaces';

export const useUnitSecretaries = (unitId: number) => {
  return useQuery({
    queryKey: ['unitSecretaries'],
    queryFn: () =>
      instance
        .get<APIResponse<Secretaries[]>>(
          `http://localhost:8000/api/secretaries/appointment_type/${unitId}`,
        )
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
  });
};
