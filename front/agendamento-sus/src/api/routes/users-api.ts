import { useMutation, useQuery } from '@tanstack/react-query';
import { instance, instanceNoAuth } from '../instance';
import { APIResponse, Agente } from '../../interfaces/interfaces';

type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
  c_password: string;
};

export const useMutateRegisterUser = () => {
  return useMutation({
    mutationFn: (params: RegisterUserParams) =>
      instanceNoAuth.post('/register', params).then(
        response => response.data,
        error => console.error(error),
      ),
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () =>
      instance
        .get<APIResponse<Agente[]>>('/users')
        .then(response => response.data)
        .catch(error => {
          console.error(error);
          throw error;
        }),
  });
};
