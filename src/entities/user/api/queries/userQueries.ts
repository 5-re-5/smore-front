import { useQuery } from '@tanstack/react-query';
import { getUserProfile, getRoomParticipantInfo } from '../userApi';

export const userProfileQueryKeys = {
  all: ['user'] as const,
  profile: (userId: number) =>
    [...userProfileQueryKeys.all, 'profile', userId] as const,
  roomParticipant: (roomId: number, userId: number) =>
    [...userProfileQueryKeys.all, 'roomParticipant', roomId, userId] as const,
};

export const useUserProfileQuery = (userId: number) => {
  return useQuery({
    queryKey: userProfileQueryKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: userId > 0,
  });
};

export const useRoomParticipantQuery = (roomId: number, userId: number) => {
  return useQuery({
    queryKey: userProfileQueryKeys.roomParticipant(roomId, userId),
    queryFn: () => getRoomParticipantInfo(roomId, userId),
    enabled: roomId > 0 && userId > 0,
  });
};
