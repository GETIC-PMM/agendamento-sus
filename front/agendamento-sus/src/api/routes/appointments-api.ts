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

export const useCheckAppointment = (
  unitId: number,
  appointmentId: number,
  date: Date,
  cpf: string,
  onSuccess?: (data: APIResponse<boolean>) => void,
  onError?: (data: APIResponse<boolean>) => void,
) => {
  console.log(date);
  return useQuery({
    queryKey: ['appointments', unitId, appointmentId, date, cpf],
    queryFn: () =>
      instance
        .get<APIResponse<boolean>>(
          `appointments/check/${unitId}/${appointmentId}/${cpf}/${date.toISOString()}`,
        )
        .then(response => response.data),
    onSuccess,
    onError,
    enabled: false,
  });
};

export const useMutateRegisterAppointment = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  return useMutation({
    mutationFn: (params: RegisterAppointmentParams) =>
      instance.post('/appointments', params).then(
        response => response.data,
        error => console.error(error),
      ),
    onSuccess,
    onError,
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
