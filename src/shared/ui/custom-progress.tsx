interface CustomProgressProps {
  value: number; // 0-100
  className?: string;
}

const ProgressIcon = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_ii_596_5827)">
      <rect width="50" height="50" rx="16" fill="#F9F9F9" />
    </g>
    <path
      d="M41.1114 16.9838L40.2255 15.4847C39.5555 14.351 39.2205 13.7842 38.6505 13.5581C38.0805 13.3321 37.4358 13.5104 36.1465 13.8672L33.9563 14.4686C33.1332 14.6537 32.2696 14.5487 31.518 14.1722L30.9133 13.8321C30.2688 13.4296 29.7731 12.8362 29.4987 12.1386L28.8993 10.3932C28.5052 9.23817 28.3081 8.66065 27.839 8.33033C27.3699 8 26.7467 8 25.5004 8H23.4996C22.2533 8 21.6301 8 21.161 8.33033C20.6919 8.66065 20.4948 9.23817 20.1007 10.3932L19.5013 12.1386C19.2269 12.8362 18.7312 13.4296 18.0867 13.8321L17.482 14.1722C16.7304 14.5487 15.8668 14.6537 15.0437 14.4686L12.8535 13.8672C11.5642 13.5104 10.9195 13.3321 10.3495 13.5581C9.77952 13.7842 9.44451 14.351 8.7745 15.4847L7.88858 16.9838C7.26054 18.0465 6.94652 18.5778 7.00746 19.1434C7.06841 19.7091 7.48879 20.1649 8.32957 21.0765L10.1802 23.0938C10.6325 23.6521 10.9536 24.625 10.9536 25.4997C10.9536 26.375 10.6326 27.3477 10.1802 27.906L8.32957 29.9233C7.4888 30.835 7.06841 31.2908 7.00747 31.8564C6.94652 32.4221 7.26055 32.9534 7.88858 34.0161L8.77448 35.5151C9.44448 36.6488 9.77952 37.2157 10.3495 37.4417C10.9195 37.6678 11.5642 37.4894 12.8535 37.1326L15.0436 36.5311C15.8669 36.346 16.7306 36.4511 17.4823 36.8277L18.0869 37.1679C18.7313 37.5704 19.2269 38.1638 19.5013 38.8612L20.1007 40.6068C20.4948 41.7618 20.6919 42.3393 21.161 42.6697C21.6301 43 22.2533 43 23.4996 43H25.5004C26.7467 43 27.3699 43 27.839 42.6697C28.3081 42.3393 28.5052 41.7618 28.8993 40.6068L29.4988 38.8612C29.7731 38.1638 30.2687 37.5704 30.9131 37.1679L31.5177 36.8277C32.2694 36.4511 33.1331 36.346 33.9564 36.5311L36.1465 37.1326C37.4358 37.4894 38.0805 37.6678 38.6505 37.4417C39.2205 37.2157 39.5555 36.6488 40.2255 35.5151L41.1114 34.0161C41.7395 32.9534 42.0535 32.4221 41.9925 31.8564C41.9316 31.2908 41.5112 30.835 40.6704 29.9233L38.8198 27.906C38.3674 27.3477 38.0464 26.375 38.0464 25.4997C38.0464 24.625 38.3676 23.6521 38.8199 23.0938L40.6704 21.0765C41.5112 20.1649 41.9316 19.7091 41.9925 19.1434C42.0535 18.5778 41.7395 18.0465 41.1114 16.9838Z"
      stroke="#C4C4C4"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M30.7047 25.4844C30.7047 28.8671 27.8921 31.6094 24.4227 31.6094C20.9532 31.6094 18.1406 28.8671 18.1406 25.4844C18.1406 22.1016 20.9532 19.3594 24.4227 19.3594C27.8921 19.3594 30.7047 22.1016 30.7047 25.4844Z"
      stroke="#C4C4C4"
      strokeWidth="3"
    />
    <defs>
      <filter
        id="filter0_ii_596_5827"
        x="-5.4432"
        y="-5.4432"
        width="60.8864"
        height="60.8864"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="5.4432" dy="5.4432" />
        <feGaussianBlur stdDeviation="5.4432" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect1_innerShadow_596_5827"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="-5.4432" dy="-5.4432" />
        <feGaussianBlur stdDeviation="5.4432" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_innerShadow_596_5827"
          result="effect2_innerShadow_596_5827"
        />
      </filter>
    </defs>
  </svg>
);

export const CustomProgress = ({
  value,
  className = '',
}: CustomProgressProps) => {
  return (
    <div className={`relative w-full h-[1.81rem] ${className}`}>
      {/* 배경 바 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#EBEFF3',
          boxShadow: '7.25px 7.25px 14.5px rgba(255, 255, 255, 0.75)',
          borderRadius: 29,
          border: '1.81px #F4F7F9 solid',
        }}
      />

      {/* 채워지는 바 */}
      <div
        className="absolute top-0 left-0 h-full transition-all duration-300"
        style={{
          width: `${Math.min(value, 100)}%`,
          background:
            'linear-gradient(90deg, #5585FF 0%, rgba(85, 133, 255, 0.92) 53%, #5585FF 100%)',
          boxShadow: '7.25px 7.25px 14.5px rgba(189, 194.20, 199, 0.75)',
          borderRadius: 29,
        }}
      >
        {/* 채워지는 바 안의 빨간색 원형 그라디언트 */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(ellipse 50.00% 50.00% at 50.00% 50.00%, #FC5132 0%, #FC5132 100%)',
            boxShadow: '7.25px 7.25px 14.5px rgba(255, 255, 255, 0.75) inset',
            borderRadius: 9999,
          }}
        />
      </div>

      {/* 진행 인디케이터 (기어 아이콘) */}
      <div
        className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300"
        style={{
          left: `${Math.min(value, 100)}%`,
          transform: 'translate(-50%, -50%)',
          width: '50px',
          height: '50px',
        }}
      >
        <ProgressIcon />
      </div>
    </div>
  );
};
