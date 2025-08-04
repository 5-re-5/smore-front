export interface UserInfo {
  id: number;
  nickname: string;
  profileUrl: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserRequest {
  userId: number;
}

export interface GetUserResponse {
  user: UserInfo;
}
