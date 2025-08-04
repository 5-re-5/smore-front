import { Button } from '@/shared/ui/button';
import { Link } from '@tanstack/react-router';

export default function Homepage() {
  return (
    <main className="p-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Smore에 오신 것을 환영합니다! 🚀
        </h1>
        <p className="text-gray-600 mb-8">
          실시간 화상 스터디 플랫폼에서 함께 공부하고 성장해보세요.
        </p>

        <Link to="/login">
          <Button aria-label="로그인 버튼" className="px-8 py-3 text-lg">
            구글로 시작하기
          </Button>
        </Link>
      </div>
    </main>
  );
}
