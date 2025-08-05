import { Link } from '@tanstack/react-router';

interface UserProfileProps {
  nickname: string;
  profileUrl: string;
}

export const UserProfile = ({ nickname, profileUrl }: UserProfileProps) => {
  return (
    <Link
      to="/my-page"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <div
        className="w-10 h-10 rounded-[2.8125rem]"
        style={{
          background: `url(${profileUrl}) lightgray 50% / cover no-repeat`,
        }}
      />
      <span className="text-[1.25rem] font-medium font-['Noto_Sans_KR'] text-header-text">
        {nickname}님
      </span>
    </Link>
  );
};
