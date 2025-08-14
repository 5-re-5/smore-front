import { searchDetailRoute } from '@/pages/search-detail-page/route';
import { useSearchKeyword } from '@/shared/stores/useSearchKeyword';
import { useNavigate } from '@tanstack/react-router';
import { useRef } from 'react';

export const SearchBar = () => {
  const navigate = useNavigate();
  const { keyword, set, clear } = useSearchKeyword();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const CLEAR_ON_SUBMIT = false;
  const submit = (rawOverride?: string) => {
    const raw = (rawOverride ?? inputRef.current?.value ?? keyword) || '';
    const q = raw.trim();

    if (!q) {
      clear();
      // 포커스 제거 → 커서 사라짐
      inputRef.current?.blur();
      navigate({
        to: searchDetailRoute.to,
        search: {} as { q?: string },
        replace: true,
      });
      return;
    }

    // qc.invalidateQueries({ queryKey: ['study-rooms'], refetchType: 'all' });
    // 제출 직후 입력창 비우기 + 포커스 제거 → placeholder 다시 표시
    if (CLEAR_ON_SUBMIT) {
      set('');
      inputRef.current?.blur();
    }
    navigate({ to: searchDetailRoute.to, search: { q } });
  };

  // Enter 처리 (캡처 단계에서 가장 먼저 잡음)
  const handleEnterCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' && e.key !== 'NumpadEnter') return;
    e.preventDefault();
    e.stopPropagation();
    submit((e.currentTarget as HTMLInputElement).value);
  };
  const blockEnterBubble = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="relative flex items-center" role="search">
      <div className="flex items-center px-6 py-3 gap-4 w-[37.5rem] h-[3.125rem] rounded-[2.625rem] bg-header-button-bg shadow-[inset_-0.375rem_-0.25rem_0.9375rem_0_var(--color-header-inset-light),inset_0.25rem_0.25rem_0.9375rem_0_var(--color-header-inset-dark)]">
        <button
          type="button"
          onClick={() => submit()}
          aria-label="검색 실행"
          className="shrink-0 p-0 bg-transparent border-0 cursor-pointer hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          onMouseDown={(e) => e.preventDefault()} // 포커스 유지 원치 않으면 삭제
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.75rem"
            height="1.5625rem"
            viewBox="0 0 28 25"
            fill="none"
            aria-hidden
          >
            <path
              d="M20.0114 15.6534H18.7467L18.2985 15.2692C19.9216 13.5957 20.8137 11.4593 20.8119 9.24973C20.8119 7.42031 20.2016 5.63197 19.0582 4.11086C17.9148 2.58975 16.2896 1.40419 14.3881 0.704098C12.4867 0.00400776 10.3944 -0.179168 8.37585 0.177735C6.35729 0.534638 4.50313 1.41559 3.04784 2.70919C1.59254 4.00278 0.601468 5.65093 0.199952 7.4452C-0.201564 9.23947 0.00450873 11.0993 0.79211 12.7894C1.57971 14.4796 2.91347 15.9242 4.62472 16.9406C6.33597 17.957 8.34785 18.4995 10.4059 18.4995C12.9834 18.4995 15.3528 17.6599 17.1778 16.2653L17.6101 16.6637V17.7879L25.6146 24.8889L28 22.7686L20.0114 15.6534ZM10.4059 15.6534C6.41967 15.6534 3.20183 12.7931 3.20183 9.24973C3.20183 5.70638 6.41967 2.84607 10.4059 2.84607C14.3922 2.84607 17.6101 5.70638 17.6101 9.24973C17.6101 12.7931 14.3922 15.6534 10.4059 15.6534Z"
              fill="#8A8A8A"
            />
          </svg>
        </button>

        <input
          ref={inputRef}
          type="text"
          // 1) name 제거: 바깥 폼이 제출돼도 q가 붙지 않음
          // name="q"
          // 2) 어떤 폼에도 속하지 않도록 form 속성으로 분리
          form="__searchbar_no_form__"
          maxLength={20}
          placeholder="나에게 맞는 스터디를 찾아보세요"
          className="flex-1 bg-transparent border-none outline-none placeholder-header-text text-[1.25rem] font-medium leading-normal font-['Noto_Sans_KR'] text-header-text text-center focus:placeholder-transparent transition-colors"
          value={keyword}
          onChange={(e) => set(e.target.value)}
          // 3) 캡처 단계에서 엔터 가로채기 → 즉시 submit
          onKeyDownCapture={handleEnterCapture}
          // 혹시를 대비해 버블 단계에서도 기본동작 차단
          onKeyUp={blockEnterBubble}
          aria-label="검색어"
        />
      </div>
    </div>
  );
};
