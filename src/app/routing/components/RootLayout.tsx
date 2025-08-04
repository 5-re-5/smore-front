import { Outlet, useLocation } from '@tanstack/react-router';
import { Header } from '@/widgets/header';

export const RootLayout = () => {
  const location = useLocation();

  // 헤더를 숨길 페이지들
  const hideHeaderPaths = ['/login', '/prejoin', '/room'];
  const shouldHideHeader = hideHeaderPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Outlet />
    </>
  );
};
