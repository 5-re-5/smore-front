import type { ProfileApiResponse } from '../types/ProfileCardTypes';

export async function fetchProfileData(
  userId: string,
): Promise<ProfileApiResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_BACK_URL}/api/v1/users/${userId}`,
  );
  if (!res.ok) throw new Error('프로필 조회 실패');
  return res.json();
}
