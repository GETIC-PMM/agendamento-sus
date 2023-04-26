import { Unidade } from '../../interfaces/interfaces';
import { instance } from '../instance';
import { useQuery } from '@tanstack/react-query';

export const useUnitAppointmentsById = (unitId: string) => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () =>
      instance
        .get<Unidade>(`appointments/units/${unitId}`)
        .then(response => response.data),
  });
};
