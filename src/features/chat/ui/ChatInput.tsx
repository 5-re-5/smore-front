import { useEffect, useMemo, useState } from 'react';
import { useStompChat } from '../hooks/useStompChat';

interface ChatInputProps {
  /** 호환 유지용. 현재는 그룹 전용으로만 동작 */
  tab?: 'GROUP' | 'PRIVATE';
  /** 호환 유지용. 사용하지 않음 */
  preselectedReceiver?: string;

  /** REST/브로드캐스트용 스터디룸 ID(예: "123"). 
   * 부모가 onSend를 내려주지 않은 경우에만 훅에서 사용됨 */
  roomId?: string;

  /** (권장) 부모가 내려주는 전송 함수. 제공되면 훅을 새로 열지 않음 */
  onSend?: (text: string) => Promise<boolean> | boolean;

  /** (권장) 부모가 내려주는 연결 상태. 없으면 훅 상태 사용 */
  isConnected?: boolean;

  /** 최대 길이(기본 500) */
  maxLength?: number;
}

export default function ChatInput({
  tab = 'GROUP',
  // preselectedReceiver, // 현재 미사용으로 주석 처리
  roomId,
  onSend,
  isConnected: isConnectedProp,
  maxLength = 500,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // 부모가 onSend를 주지 않으면, 여기서 훅을 사용(중복 연결 주의!)
  const useLocalHook = !onSend;
  const { sendGroupMessage: hookSend, connectionStatus: hookStatus } =
    useStompChat(useLocalHook && roomId ? { roomIdOverride: roomId } : {});

  const effectiveSend = useMemo(
    () => onSend ?? hookSend,
    [onSend, hookSend]
  );
  const effectiveConnected =
    isConnectedProp ?? (hookStatus === 'connected');

  // 글자 수 제한 경고 자동 숨김
  useEffect(() => {
    if (!showLimitWarning) return;
    const t = setTimeout(() => setShowLimitWarning(false), 2500);
    return () => clearTimeout(t);
  }, [showLimitWarning]);

  // 전송 실패 안내 자동 숨김
  useEffect(() => {
    if (!sendError) return;
    const t = setTimeout(() => setSendError(null), 2500);
    return () => clearTimeout(t);
  }, [sendError]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (next.length > maxLength) {
      setShowLimitWarning(true);
      return;
    }
    setMessage(next);
    if (showLimitWarning) setShowLimitWarning(false);
  };

  const isMessageTooLong = message.length > maxLength;

  const doSend = async () => {
    if (!message.trim() || isMessageTooLong) return;

    if (!effectiveConnected) {
      setSendError('채팅에 연결되지 않았습니다.');
      return;
    }
    if (!effectiveSend) {
      setSendError('전송 기능을 사용할 수 없습니다.');
      return;
    }

    const ok = await Promise.resolve(effectiveSend(message));
    if (!ok) {
      setSendError('메시지 전송에 실패했습니다.');
      return;
    }
    setMessage('');
  };

  return (
    <div className="p-2">
      {/* 안내 배너들 */}
      {showLimitWarning && (
        <div className="mb-2 text-red-400 text-xs bg-red-900/20 border border-red-600/30 rounded px-1 py-1">
          ⚠️ 메시지는 {maxLength}자를 초과할 수 없습니다. (현재: {message.length}자)
        </div>
      )}
      {sendError && (
        <div className="mb-2 text-amber-300 text-xs bg-amber-900/20 border border-amber-600/30 rounded px-1 py-1">
          {sendError}
        </div>
      )}

      {/* 입력 + 전송 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="전체 채팅 메시지를 입력하세요"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={(e) => {
            // IME(한글) 조합 중 Enter 방지. Shift+Enter는 향후 textarea 전환 대비.
            if (e.key === 'Enter' && !e.shiftKey && !(e as any).isComposing) {
              e.preventDefault();
              doSend();
            }
          }}
          className={`flex-1 bg-gray-700 text-white border rounded px-3 py-2 text-sm focus:outline-none ${
            isMessageTooLong
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-600'
          }`}
          maxLength={maxLength}
        />

        <button
          onClick={doSend}
          disabled={!message.trim() || isMessageTooLong || !effectiveConnected}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
          title={!effectiveConnected ? '채팅에 연결되지 않았습니다.' : undefined}
        >
          전송
        </button>
      </div>

      {/* ▽ 참고: 현재는 그룹 전용으로 동작합니다. PRIVATE 분기는 제거/비활성화했습니다. */}
      {tab === 'PRIVATE' && (
        <div className="mt-1 text-[11px] text-gray-400">
          현재 개인 메시지는 비활성화되어 있습니다.
        </div>
      )}
    </div>
  );
}
