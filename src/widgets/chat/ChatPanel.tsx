import ChatUserList from './ChatUserList';

function ChatPanel() {
  return (
    <div className="flex flex-col h-full w-80 bg-white border-l shadow-md">
      {/* 참가자 목록 영역*/}
      <div className="border-b p-3 font-bold text-gray-700">참가자 목록</div>
      <div className="max-h-60 overflow-y-auto border-b">
        <ChatUserList />
      </div>

      {/* 채팅 메세지 영역 */}
      <div className="flex-1 flex flex-col">{/* <ChatMessageBox /> */}</div>
    </div>
  );
}

export default ChatPanel;
