import { useQuery } from '@tanstack/react-query';
import { AppointmentType, APIResponse } from '../../interfaces/interfaces';
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
