import type { StatPanelApiResponse } from '../types/StatPanelTypes';

export async function fetchStatPanel(
  userId: string,
): Promise<StatPanelApiResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_BACK_URL}/api/v1/focus-records/${userId}`,
  );
  if (!res.ok) throw new Error('집중 패널 데이터 조회 실패');
  return res.json();
}
