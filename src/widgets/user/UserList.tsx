// src/widgets/user/ChattingUserList.tsx

import { useChattingUserListStore } from '@/entities/user/model/useChattingUserListStore';
import type { ChatUser } from '@/entities/user/types/user.interface';

export const ChattingUserList: React.FC = () => {
  const users = useChattingUserListStore((state) => state.users);

  return (
    <ul className="space-y-2 p-2">
      {users.map((user: ChatUser) => (
        <li
          key={user.sid}
          className="flex items-center gap-3 py-2 px-3 bg-white rounded-md shadow-sm border border-gray-200"
        >
          {/* 프로필 이미지 */}
          <img
            src={user.profileUrl || '/default-profile.png'}
            alt={`${user.nickname} profile`}
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* 닉네임 + (YOU) + (방장) */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {user.nickname}
              {user.isSelf && ' (YOU)'}
              {user.role === 'host' && ' (방장)'}
            </span>
            <div className="flex gap-1 text-sm">
              {/* 마이크 상태 */}
              {user.micOn ? (
                <span title="마이크 켜짐" role="img" aria-label="mic on">
                  🎤
                </span>
              ) : (
                <span title="마이크 꺼짐" role="img" aria-label="mic off">
                  🔇
                </span>
              )}
              {/* 카메라 상태 */}
              {user.camOn ? (
                <span title="카메라 켜짐" role="img" aria-label="cam on">
                  📷
                </span>
              ) : (
                <span title="카메라 꺼짐" role="img" aria-label="cam off">
                  📷❌
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
