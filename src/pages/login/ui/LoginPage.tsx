import { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/entities/user';
import { useNavigate } from '@tanstack/react-router';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Smore에 로그인</h1>
          <p className="text-gray-600">구글 계정으로 간편하게 시작하세요</p>
        </div>

        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="px-8 py-3 text-lg min-w-[200px]"
        >
          {isLoading ? renderLoadingState() : '구글 로그인 하기'}
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
