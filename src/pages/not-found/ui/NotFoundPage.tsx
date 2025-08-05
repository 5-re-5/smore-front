import { Link } from '@tanstack/react-router';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-500 mt-2">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>

        <div className="mt-12 text-gray-400">
          <p>
            문제가 지속되면 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    </div>
  );
};
