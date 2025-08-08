import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/shared/api/request';

interface JoinStudyParams {
  roomId: number;
  password?: string;
}

interface JoinStudyResponse {
  success: boolean;
  message?: string;
  roomUrl?: string;
}

const joinStudyRoom = async (
  params: JoinStudyParams,
): Promise<JoinStudyResponse> => {
  const response = await request<JoinStudyResponse>({
    method: 'POST',
    url: `/api/v1/study-rooms/${params.roomId}/join`,
    data: params.password ? { password: params.password } : undefined,
  });
  return response.data;
};

export const useJoinStudyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinStudyRoom,
    onSuccess: (data) => {
      console.log('스터디 참가 성공:', data);
      // 스터디 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['study-rooms'] });
    },
    onError: (error) => {
      console.error('스터디 참가 실패:', error);
    },
  });
};
