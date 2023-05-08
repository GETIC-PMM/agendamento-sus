import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AppointmentType,
  APIResponse,
  RegisterAppointmentTypeParams,
} from '../../interfaces/interfaces';
import { instance } from '../instance';

export const useAppointmentTypes = () => {
  return useQuery({
    queryKey: ['appointmentTypes'],
    queryFn: () =>
      instance
        .get<APIResponse<AppointmentType[]>>('/appointment-types')
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
  });
};

export const useMutateRegisterAppointmentType = () => {
  return useMutation({
    mutationFn: (params: RegisterAppointmentTypeParams) =>
      instance
        .post('/appointment-types', params)
        .then(response => response.data)
        .catch((error: Error) => {
          console.error(error);
          throw error;
        }),
  });
};

export const useDeleteAppointmentType = () => {
  return useMutation({
    mutationFn: (id: string) =>
      instance
        .delete(`/appointment-types/${id}`)
        .then(response => response.data)
        .catch((error: Error) => {
          console.error(error);
          throw error;
        }),
  });
};
