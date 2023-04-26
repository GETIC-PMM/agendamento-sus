import { useMutation } from '@tanstack/react-query';
import { instanceNoAuth } from '../instance';

type RegisterUserParams = {
  name: string;
  email: string;
  password: string;
  c_password: string;
};

export const useMutateRegisterUser = () => {
  return useMutation({
    mutationFn: (params: RegisterUserParams) =>
      instanceNoAuth
        .post('/api/register', {
          ...params,
        })
        .then(
          response => response.data,
          error => console.error(error),
        ),
  });
};
