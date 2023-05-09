import {
  APIResponse,
  RegisterUnitParams,
  Unidade,
} from '../../interfaces/interfaces';
import { instance } from '../instance';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useMutateRegisterUnit = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  return useMutation({
    mutationFn: (params: RegisterUnitParams) =>
      instance
        .post('/units', params)
        .then(response => response.data.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
    onSuccess,
  });
};

export const useGetUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: () =>
      instance
        .get<APIResponse<Unidade[]>>('/units')
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
  });
};

export const useGetUnitByName = ({
  unit,
  onSuccess,
}: {
  unit: string;
  onSuccess?: (data: APIResponse<Unidade[]>) => void;
}) => {
  return useQuery({
    queryKey: ['unit', unit],
    queryFn: () =>
      instance
        .get<APIResponse<Unidade[]>>(`/units/${unit}`)
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
    onSuccess,
  });
};

export const useDeleteUnit = () => {
  return useMutation({
    mutationFn: (unitId: number) =>
      instance
        .delete(`/units/${unitId}`)
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
  });
};
