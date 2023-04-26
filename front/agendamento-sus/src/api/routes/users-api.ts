import { instanceNoAuth } from '../instance';

const registerUser = async ({
  name,
  email,
  password,
  c_password,
}: {
  name: string;
  email: string;
  password: string;
  c_password: string;
}) => {
  return await instanceNoAuth
    .post('/api/register', {
      name,
      email,
      password,
      c_password,
    })
    .then(response => response.data.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
};

export default {
  registerUser,
};
