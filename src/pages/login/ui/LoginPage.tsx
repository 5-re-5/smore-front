import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/entities/user';
import { useNavigate } from '@tanstack/react-router';

// 폰트 커스텀 값들이 tailwind.config.js에 이미 추가되어 있다고 가정합니다.

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/study-list', replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = `${import.meta.env.VITE_BACK_URL}/api/oauth2/authorization/google`;
  };

  const renderLoadingState = () => (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>구글로 이동 중...</span>
    </div>
  );

  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center bg-cover bg-no-repeat bg-center
        relative
      "
      style={{ backgroundImage: "url('/images/study_bg.webp')" }}
    >
      {/* Glassmorphism Container */}
      <div
        className="
          w-[77vw] max-w-[1115px] min-w-[320px]
          h-[78vh] max-h-[794px] min-h-[340px]
          rounded-2xl flex flex-col justify-center items-center relative shadow-xl
          border border-white/30
          overflow-hidden
        "
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.3) 100%)',
          border: '1.5px solid rgba(255,255,255,0.20)',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.12)',
        }}
      >
        {/* S'more 로고 (폰트 적용 보증!) */}
        <div
          className="absolute top-10 left-12 flex items-center text-3xl select-none z-10"
          style={{ fontFamily: '"Black Han Sans", sans-serif' }} // 직접 font-family 지정
        >
          <span className="text-white font-black-han-sans">S</span>
          <span className="text-white font-black-han-sans">'</span>
          <span className="text-white font-black-han-sans">m</span>
          <span className="font-black-han-sans" style={{ color: '#f75804' }}>
            o
          </span>
          <span className="text-white font-black-han-sans">re</span>
        </div>
        {/* 중앙 컨텐츠 */}
        <div className="w-full flex flex-col items-start pl-16 pt-32 z-10">
          <h1 className="text-white text-5xl font-bold mb-5 drop-shadow">
            Sign In
          </h1>
          <div className="text-white text-[1.1rem] font-medium mb-8 opacity-75">
            SNS sign in
          </div>
          {/* 버튼 영역 */}
          <Button
            variant="ghost"
            onClick={handleLogin}
            disabled={isLoading}
            className="
              w-full max-w-[350px] h-[50px]
              rounded-[8px] text-white font-poppins font-semibold text-base
              bg-white/5 transition-all duration-200
              shadow-none
              border border-white/40
              hover:bg-white/30
              hover:text-orangered
            "
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.42)',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.09)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {isLoading ? renderLoadingState() : 'Log in with Google'}
          </Button>
        </div>
        {/* 반사광 등 레이어 추가(선택, 입체감) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(120deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.03) 100%)',
          }}
        />
      </div>
    </div>
  );
}

export default LoginPage;
