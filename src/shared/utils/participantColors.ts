/**
 * 참가자별 파스텔 컬러 할당 유틸리티
 */

const PASTEL_COLORS = [
  '#FFB3BA', // 피치 핑크
  '#BFEFFF', // 라이트 스카이 블루
  '#EFB15F', // 피치 오렌지
  '#C7CEEA', // 퍼플 그레이
  '#FD9485', // 피치 크림
  '#8AE261', // 라이트 그린
  '#F7CAC9', // 로즈 핑크
  '#DEE5F7', // 라벤더 블루
] as const;

/**
 * 문자열을 해시하여 숫자로 변환하는 함수
 * @param str - 해시할 문자열
 * @returns 해시된 숫자값
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit integer로 변환
  }
  return Math.abs(hash);
}

/**
 * 참가자 ID에 따라 일관된 파스텔 컬러를 반환하는 함수
 * @param participantId - 참가자의 고유 ID
 * @returns 참가자에게 할당된 파스텔 컬러
 */
export function getParticipantColor(participantId: string): string {
  const hash = hashString(participantId);
  const colorIndex = hash % PASTEL_COLORS.length;
  return PASTEL_COLORS[colorIndex];
}

/**
 * 참가자 컬러에 맞는 텍스트 컬러를 반환하는 함수
 * 모든 파스텔 컬러는 밝기 때문에 검은색 텍스트를 사용
 * @returns 텍스트 컬러
 */
export function getTextColorForBackground(): string {
  return '#000000'; // 파스텔 톤은 모두 밝기 때문에 검은색 텍스트 사용
}
