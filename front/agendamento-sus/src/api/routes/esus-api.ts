import { instance } from '../instance';
import { UnitESUS } from '../../interfaces/interfaces';
import { useQuery } from '@tanstack/react-query';

export const useEsusUnits = () => {
  return useQuery({
    queryKey: ['esusUnits'],
    queryFn: () =>
      instance
        .get<UnitESUS[]>('/api/units/esus')
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
  });
};
