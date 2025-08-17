import { Link } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import { useHeaderLogic } from '../model/useHeaderLogic';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { HeaderUserProfile } from './HeaderUserProfile';
import { useSearchKeyword } from '@/shared/stores/useSearchKeyword';
import { DEFAULT_PROFILE_IMG } from '@/shared/constants';

export const Header = () => {
  const { isLogin, userInfo, handleLogout } = useHeaderLogic();
  const { clear } = useSearchKeyword();

  if (!isLogin) {
    return (
      <header className="flex items-center justify-between px-8 h-[5rem] bg-header-bg">
        <Link to="/" onClick={clear}>
          <Logo />
        </Link>
        <div className="flex-1" />
        <Link to="/login">
          <Button
            variant="ghost"
            className="w-[6.25rem] h-[3.125rem] rounded-full bg-header-button-bg text-header-text font-medium text-[1.25rem] font-['Noto_Sans_KR'] 
            shadow-[-0.25rem_-0.25rem_0.9375rem_0_var(--color-header-shadow-light),0.25rem_0.25rem_0.9375rem_0_var(--color-header-shadow-dark)] 
            hover:bg-[#f5f7fa] hover:text-header-text transition-colors !border-0"
          >
            로그인
          </Button>
        </Link>
      </header>
    );
  }

  return (
    <header className="relative flex items-center justify-between px-8 gap-6 h-[5rem] bg-header-bg">
      <Link to="/study-list" onClick={clear}>
        <Logo />
      </Link>

      {/* SearchBar와 스터디 만들기 버튼을 전체 가로 길이에서 가운데 정렬 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
        <SearchBar />
        <Link to="/room-create">
          <Button
            variant="ghost"
            className="w-[10rem] h-[3.4rem] rounded-full bg-header-button-bg text-header-text font-medium text-[1.25rem] font-['Noto_Sans_KR'] 
            shadow-[-0.25rem_-0.25rem_0.9375rem_0_var(--color-header-shadow-light),0.25rem_0.25rem_0.9375rem_0_var(--color-header-shadow-dark)] 
            hover:bg-[#f5f7fa] hover:text-header-text transition-colors flex-shrink-0 !border-0"
          >
            스터디 만들기
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <HeaderUserProfile
          nickname={userInfo.nickname}
          profileUrl={userInfo.profileUrl || DEFAULT_PROFILE_IMG}
        />

        <Button
          variant="ghost"
          className="text-[#BABABA] bg-header-bg font-medium text-[1.25rem] font-['Noto_Sans_KR'] 
          !border-0 !shadow-none hover:bg-header-bg hover:opacity-80 transition-opacity p-2"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>
    </header>
  );
};
