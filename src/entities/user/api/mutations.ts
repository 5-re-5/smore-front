import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  logout,
  updateUserProfile,
  updateUserSettings,
  type UpdateUserProfileData,
  type UpdateUserSettingsData,
} from './userApi';
import { userQueryKeys } from './queries';

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export const useUpdateUserProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data: UpdateUserProfileData;
    }) => updateUserProfile(userId, data),
    onSuccess: (updatedProfile, variables) => {
      const { userId } = variables;

      // 특정 사용자 프로필 쿼리 캐시 업데이트
      queryClient.setQueryData(userQueryKeys.profile(userId), {
        data: updatedProfile,
      });

      // 해당 사용자의 프로필 쿼리만 무효화
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.profile(userId),
      });
    },
  });
};

export const useUpdateUserSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data: UpdateUserSettingsData;
    }) => updateUserSettings(userId, data),
    onSuccess: (updatedProfile, variables) => {
      const { userId } = variables;

      // 특정 사용자 프로필 쿼리 캐시 업데이트
      queryClient.setQueryData(userQueryKeys.profile(userId), {
        data: updatedProfile,
      });

      // 해당 사용자의 프로필 쿼리만 무효화
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.profile(userId),
      });
    },
  });
};
