import { Outlet, useLocation } from '@tanstack/react-router';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export const RootLayout = () => {
  const location = useLocation();

  // 헤더와 푸터를 숨길 페이지들
  const hideHeaderFooterPaths = ['/login', '/prejoin'];
  const shouldHideHeaderFooter =
    hideHeaderFooterPaths.some((path) => location.pathname.startsWith(path)) ||
    location.pathname.startsWith('/room/');

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideHeaderFooter && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
};
