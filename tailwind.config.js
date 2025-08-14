/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // 🎨 색상
      colors: {
        whitesmoke: '#f1f5f6',
        gray: '#16012c',
        aliceblue: '#f1f5f9',
        royalblue: '#0063e5',
        orangered: '#f75804',
        white: '#fff',
      },
      // 🔤 폰트
      fontFamily: {
        'black-han-sans': ['"Black Han Sans"', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        'noto-sans-kr': ['"Noto Sans KR"', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      // 🎞 커스텀 애니메이션
      keyframes: {
        cardfloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        cardfloat2: {
          '0%, 100%': { transform: 'translateY(0) rotate(-4deg)' },
          '30%': { transform: 'translateY(-6px) rotate(-7deg)' },
          '70%': { transform: 'translateY(3px) rotate(-2deg)' },
        },
      },
      animation: {
        cardfloat: 'cardfloat 3.3s ease-in-out infinite',
        cardfloat2: 'cardfloat2 4.4s ease-in-out infinite',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
