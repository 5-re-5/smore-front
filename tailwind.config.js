/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aliceblue: '#ebf3ff',
        dimgray: '#616161',
        darkslategray: '#434343',
        lightseagreen: '#29bdbc',
        darkgray: '#9ea6a7',
        gray: {
          100: '#fcfdfd',
          200: '#202224',
          300: 'rgba(0, 0, 0, 0.05)',
          888: '#888889', // 숫자가 아닌 고유 숫자라면 이렇게 표기 가능
        },
        whitesmoke: '#f0f0f3',
        lightgray: '#c9cbcd',
        deepskyblue: '#34b3f1',
        gainsboro: '#e3e3e4',
        dodgerblue: '#1f94ff',
        tomato: '#fc5132',
        black: '#000',
        white: '#fff',
        // 추가 색상 필요시 여기에
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'nunito-sans': ['Nunito Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        // 필요하다면 추가 폰트도 여기에
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
