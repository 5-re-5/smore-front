import { useEffect } from 'react';
import { useChattingUserListStore } from '@/entities/user/model/useChattingUserListStore';

export function useMockUsers() {
  useEffect(() => {
    useChattingUserListStore.getState().setUsers([
      {
        uid: 1,
        sid: 'sid-123',
        nickname: '홍길동',
        profileUrl: 'https://i.pravatar.cc/40?img=1',
        micOn: true,
        camOn: false,
        role: 'guest',
        isSelf: true,
      },
      {
        uid: 2,
        sid: 'sid-456',
        nickname: '김철수',
        profileUrl: 'https://i.pravatar.cc/40?img=2',
        micOn: false,
        camOn: true,
        role: 'guest',
        isSelf: true,
      },
      {
        uid: 3,
        sid: 'sid-457',
        nickname: '김민수',
        profileUrl: 'https://i.pravatar.cc/40?img=2',
        micOn: false,
        camOn: false,
        role: 'guest',
        isSelf: true,
      },
    ]);
  }, []);
}
