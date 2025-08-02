export interface User {
  uid: number; // 로그인 토큰
  nickname: string; // 닉네임
  profileUrl: string; // 프로필 사진
}

export interface ChatUser extends User {
  sid: string; // 소켓 연결 ID
  micOn: boolean;
  camOn: boolean;
  role: 'host' | 'admin' | 'guest';
  isSelf: boolean;
}

// 상태 업데이트 시 사용
export type UserUpdateData = {
  sid: string;
  data: {
    nickname?: string;
    micOn?: boolean;
    camOn?: boolean;
  };
};
