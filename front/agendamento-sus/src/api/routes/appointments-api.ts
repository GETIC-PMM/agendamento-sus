import {
  APIResponse,
  RegisterAppointmentParams,
  Unidade,
} from '../../interfaces/interfaces';
import { instance } from '../instance';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useUnitAppointmentsById = (unitId: string) => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () =>
      instance
        .get<APIResponse<Unidade>>(`appointments/units/${unitId}`)
        .then(response => response.data),
    enabled: false,
  });
};

export const useMutateRegisterAppointment = () => {
  return useMutation({
    mutationFn: (params: RegisterAppointmentParams) =>
      instance.post('/appointments', params).then(
        response => response.data,
        error => console.error(error),
      ),
  });
};
