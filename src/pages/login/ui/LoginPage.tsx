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
    <div
      className="flex flex-col items-center justify-center min-h-screen p-8"
      style={{ backgroundColor: '#ECF0F3' }}
    >
      <div className="space-y-[50px]">
        <div>
          <span className="font-bold text-[45px] text-[#656769]">Sign In</span>
        </div>

        <Button
          variant="ghost"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-[358px] h-[52px] hover:bg-gray-200 text-[#616161] border-0 relative flex items-center justify-center rounded-[23.5px] transition-colors"
          style={{
            boxShadow:
              '-4.08px -4.08px 8.17px 0 #FFF, 4.08px 4.08px 8.17px 0 rgba(0, 0, 0, 0.08)',
          }}
        >
          {isLoading ? renderLoadingState() : 'Log in with Google'}
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
