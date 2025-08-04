import { useMutation } from '@tanstack/react-query';
import { logout } from './userApi';

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logout,
  });
};
