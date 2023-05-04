import {
  APIResponse,
  Appointment,
  RegisterAppointmentParams,
  Unidade,
} from '../../interfaces/interfaces';
import { instance } from '../instance';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useUnitAppointmentsById = (unitId: number) => {
  return useQuery({
    queryKey: ['appointments', unitId],
    queryFn: () =>
      instance
        .get<APIResponse<Appointment[]>>(`appointments/units/${unitId}`)
        .then(response => response.data),
  });
};

export const useMutateRegisterAppointment = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  return useMutation({
    mutationFn: (params: RegisterAppointmentParams) =>
      instance.post('/appointments', params).then(
        response => response.data,
        error => console.error(error),
      ),
    onSuccess,
  });
};

export const useMutateCancelAppointment = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  return useMutation({
    mutationFn: (appointmentId: number) =>
      instance
        .put(`/appointments/${appointmentId}`)
        .then(response => response.data),
    onSuccess,
  });
};
