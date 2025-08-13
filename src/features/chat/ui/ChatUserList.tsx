import { Mic, MicOff, Video, VideoOff } from 'lucide-react'; // 아이콘 라이브러리
import type { ChatUser } from '@/entities/user/types/user.interface';
import { useParticipants } from '@livekit/components-react';
import type { Participant } from 'livekit-client';
// Participant → ChatUser로 변환하는 헬퍼 함수
function mapParticipantToChatUser(participant: Participant): ChatUser | null {
  try {
    console.log('여기 참가자' + participant);
    // 로그인 코드 완성한 후 metadata를 통해 user 구분하고 필드 채울 예정
    const data = JSON.parse(participant.metadata || '{}');
    return {
      uid: data.uid ?? 0,
      nickname: data.nickname ?? participant.identity,
      profileUrl: data.profileUrl ?? '/default.png',
      sid: participant.sid,
      micOn: participant.isMicrophoneEnabled,
      camOn: participant.isCameraEnabled,
      role: data.role ?? 'guest',
      isSelf: participant.isLocal,
    };
  } catch (e) {
    console.warn('❗ Invalid metadata:', participant.metadata);
    return null;
  }
}

function ChatUserItem({ user }: { user: ChatUser }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded bg-[#161929]">
      <div className="flex items-center space-x-2">
        <img
          src={user.profileUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium text-white">
          {user.nickname}
          {user.isSelf && ' (나)'}
          {user.role === 'host' && ' (방장)'}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {user.micOn ? (
          <Mic size={16} className="text-blue-400" />
        ) : (
          <MicOff size={16} className="text-zinc-500" />
        )}
        {user.camOn ? (
          <Video size={16} className="text-green-400" />
        ) : (
          <VideoOff size={16} className="text-zinc-500" />
        )}
      </div>
    </div>
  );
}

function ChatUserList() {
  const participants = useParticipants();
  const chatUsers = participants
    .map(mapParticipantToChatUser)
    .filter(Boolean) as ChatUser[];

  return (
    <div
      className={`space-y-2 ${
        chatUsers.length > 3
          ? 'max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
          : ''
      }`}
    >
      {chatUsers.map((user) => (
        <ChatUserItem key={user.sid} user={user} />
      ))}
    </div>
  );
}

export default ChatUserList;
