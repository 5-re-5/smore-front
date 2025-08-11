// 미디어 버튼 공통 스타일 상수
export const MEDIA_BUTTON_BASE_STYLE = `
  w-2.5rem h-2.5rem
  bg-[#292D32]
  rounded-lg
  shadow-[-3.84px_-3.84px_4.8px_0_#30343A,3.84px_3.84px_4.8px_0_#24262C]
  flex items-center justify-center
  transition-colors
  hover:text-gray-700 hover:bg-gray-100
`;

export const MEDIA_BUTTON_ENABLED_STYLE = `
  ${MEDIA_BUTTON_BASE_STYLE}
`;

export const MEDIA_BUTTON_DISABLED_STYLE = `
  ${MEDIA_BUTTON_BASE_STYLE}
`;

export const MEDIA_BUTTON_PENDING_STYLE = `
  opacity-50 cursor-not-allowed
`;

// 미디어 버튼 스타일 헬퍼 함수
export const getMediaButtonStyle = (
  isEnabled: boolean,
  isPending: boolean = false,
) => {
  const baseStyle = isEnabled
    ? MEDIA_BUTTON_ENABLED_STYLE
    : MEDIA_BUTTON_DISABLED_STYLE;
  return isPending ? `${baseStyle} ${MEDIA_BUTTON_PENDING_STYLE}` : baseStyle;
};
