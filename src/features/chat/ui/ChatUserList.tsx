import { Mic, MicOff, Video, VideoOff } from 'lucide-react'; // 아이콘 라이브러리
import type { ChatUser } from '@/entities/user/types/user.interface';
import { useParticipants } from '@livekit/components-react';
import type { Participant } from 'livekit-client';
// Participant → ChatUser로 변환하는 헬퍼 함수
function mapParticipantToChatUser(participant: Participant): ChatUser | null {
  try {
    // 🔍 participant 객체 구조 확인
    // console.log("=== Participant 객체 분석 ===");
    // console.log("participant:", participant);
    // console.log("participant.metadata 원본:", participant.metadata);
    // console.log("metadata 타입:", typeof participant.metadata);
    // console.log("metadata 길이:", participant.metadata?.length);
    // console.log("participant 키들:", Object.keys(participant));
    // console.log("participant.identity:", participant.identity);
    // console.log("participant.name:", participant.name);
    // console.log("participant.sid:", participant.sid);
    // console.log("===============================");

    // 로그인 코드 완성한 후 metadata를 통해 user 구분하고 필드 채울 예정
    const data = JSON.parse(participant.metadata || '{}');
    //        console.log("📋 Parsed metadata:", data);
    //          console.log("🖼️ ProfileUrl 후보들:", {
    //            'data.profileUrl': data.profileUrl,
    //            'data.profileImageUrl': data.profileImageUrl,
    //            'data.avatarUrl': data.avatarUrl,
    //            'data.avatar': data.avatar,
    //            'data.image': data.image,
    //            'data.user?.profileUrl': data.user?.profileUrl
    //          });
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
    <div className="flex items-center justify-between px-5 py-2 rounded bg-[#161929]">
      {/* 사진대신 컬러 점으로 대체 */}
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500">
          {/* {user.nickname.charAt(0).toUpperCase()} */}
        </div>
        {/* <img
          src={user.profileUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        /> */}
        <span className="text-sm font-medium px-3 text-white">
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

  // 🧪 테스트용: 더미 사용자 추가 (개발 환경에서만)
  // if (import.meta.env.DEV && chatUsers.length < 6) {
  //   const dummyUsers: ChatUser[] = [
  //     {
  //       uid: 9001,
  //       nickname: '테스트1',
  //       profileUrl: '/default.png',
  //       sid: 'dummy1',
  //       micOn: true,
  //       camOn: false,
  //       role: 'guest',
  //       isSelf: false,
  //     },
  // {
  //   uid: 9002,
  //   nickname: '테스트2',
  //   profileUrl: '/default.png',
  //   sid: 'dummy2',
  //   micOn: false,
  //   camOn: true,
  //   role: 'guest',
  //   isSelf: false,
  // },
  // {
  //   uid: 9003,
  //   nickname: '테스트3',
  //   profileUrl: '/default.png',
  //   sid: 'dummy3',
  //   micOn: true,
  //   camOn: true,
  //   role: 'guest',
  //   isSelf: false,
  // },
  // {
  //   uid: 9004,
  //   nickname: '테스트4',
  //   profileUrl: '/default.png',
  //   sid: 'dummy4',
  //   micOn: false,
  //   camOn: false,
  //   role: 'guest',
  //   isSelf: false,
  // },
  // {
  //   uid: 9005,
  //   nickname: '테스트5',
  //   profileUrl: '/default.png',
  //   sid: 'dummy5',
  //   micOn: true,
  //   camOn: true,
  //   role: 'guest',
  //   isSelf: false,
  // },
  //   ];
  //   chatUsers = [...chatUsers, ...dummyUsers.slice(0, 6 - chatUsers.length)];
  // }

  return (
    <div
      className="h-[120px] overflow-y-auto space-y-2"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#4b5563 #2A2F46',
      }}
    >
      {chatUsers.map((user) => (
        <ChatUserItem key={user.sid} user={user} />
      ))}
    </div>
  );
}

export default ChatUserList;
