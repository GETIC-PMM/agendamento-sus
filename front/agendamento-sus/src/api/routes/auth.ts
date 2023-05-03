import { useMutation } from '@tanstack/react-query';
import {
  APIResponse,
  LoginParams,
  LoginResponse,
} from '../../interfaces/interfaces';
import { instance } from '../instance';

export const useLogin = ({
  onSuccess,
}: {
  onSuccess: (data: string) => void;
}) => {
  return useMutation({
    mutationFn: (params: LoginParams) =>
      instance
        .post<APIResponse<LoginResponse>>('/login', params)
        .then(response => {
          return response.data.data.token;
        }),
    onSuccess,
  });
};

export const useRegister = () => {
  return useMutation(async (params: LoginParams) => {
    const response = await instance.post<APIResponse<LoginResponse>>(
      '/register',
      params,
    );
    return response.data;
  });
};
