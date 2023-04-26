import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { AppointmentType } from '../../interfaces/interfaces';
import { instance } from '../instance';

export const useAppointmentTypes = () => {
  return useQuery({
    queryKey: ['appointmentTypes'],
    queryFn: async () => {
      const { data } = await instance
        .get<AxiosResponse<AppointmentType[]>>('api/appointment-types')
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        });

      return data;
    },
  });
};

export const useUnitAppointmentsById = (unitId: string) => {
  return useQuery({
    queryKey: ['appointmentsById'],
    queryFn: async () => {
      await instance
        .get<AxiosResponse<AppointmentType[]>>(
          `/api/appointment-types/${unitId}`,
        )
        .then(response => response.data.data)
        .catch(error => {
          console.error(error);
          throw error;
        });
    },
  });
};
