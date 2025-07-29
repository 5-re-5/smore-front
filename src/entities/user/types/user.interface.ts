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
