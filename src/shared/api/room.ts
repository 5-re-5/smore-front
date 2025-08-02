import type { RoomApiResponse } from '@/entities/room';
import { api } from './instance';
import { mockRooms } from './mockData';

// 원본 API 호출 함수들
export const roomApi = {
  // 방 정보 조회 (현재는 mock 데이터 사용)
  getRoom: async (roomId: number): Promise<RoomApiResponse> => {
    // 임시로 mock 데이터 반환
    const mockRoom = mockRooms[roomId];
    if (!mockRoom) {
      throw new Error(`Room ${roomId} not found`);
    }

    // 실제 API 호출처럼 약간의 지연 추가
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockRoom;

    // 실제 API 호출 (나중에 활성화)
    // const response = await api.get(`/rooms/${roomId}`);
    // return response.data;
  },

  // 비밀번호 검증 (비공개 방) - 현재는 mock 데이터 사용
  verifyPassword: async (
    roomId: number,
    password: string,
  ): Promise<{ valid: boolean }> => {
    // 임시로 mock 데이터에서 비밀번호 확인
    const mockRoom = mockRooms[roomId];
    if (!mockRoom) {
      throw new Error(`Room ${roomId} not found`);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const isValid = mockRoom.data.password === password;
    return { valid: isValid };

    // 실제 API 호출 (나중에 활성화)
    // const response = await api.post(`/rooms/${roomId}/verify-password`, { password });
    // return response.data;
  },

  // 방 목록 조회 (나중에 필요할 수 있음)
  getRooms: async (params?: {
    category?: string;
    page?: number;
  }): Promise<{ data: RoomApiResponse['data'][] }> => {
    const response = await api.get('/rooms', { params });
    return response.data;
  },
};
