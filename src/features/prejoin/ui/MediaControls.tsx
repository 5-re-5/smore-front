import {
  EllipsisVertical,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeOff,
} from 'lucide-react';
import { useRef, useState } from 'react';
import {
  useAudioState,
  useSpeakerState,
  useVideoState,
} from '../model/useMediaControlStore';
import { useMediaToggle } from '../model/useMediaToggle';
import { DeviceSelector } from './DeviceSelector';
import { PermissionAlertDialog } from '@/shared/ui/permission-alert-dialog';

interface MediaControlsProps {
  onDeviceChange?: (
    deviceType: 'videoinput' | 'audioinput' | 'audiooutput',
    deviceId: string,
  ) => void;
  audioElement?: HTMLVideoElement | null; // 스피커 제어용 (안정화된 참조)
}

export const MediaControls = ({
  onDeviceChange,
  audioElement,
}: MediaControlsProps) => {
  // 전역 상태에서 각 미디어 상태 가져오기
  const videoState = useVideoState();
  const audioState = useAudioState();
  const speakerState = useSpeakerState();

  // 드롭다운 상태
  const [showMicSelector, setShowMicSelector] = useState(false);
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [showSpeakerSelector, setShowSpeakerSelector] = useState(false);

  // 권한 알림 상태
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const [permissionType, setPermissionType] = useState<'audio' | 'video'>(
    'audio',
  );

  // 권한 거부 콜백 함수들
  const handleAudioPermissionDenied = () => {
    setPermissionType('audio');
    setShowPermissionAlert(true);
  };

  const handleVideoPermissionDenied = () => {
    setPermissionType('video');
    setShowPermissionAlert(true);
  };

  // 미디어 토글 훅 사용 (각각 독립적)
  const videoToggle = useMediaToggle('videoinput', {
    deviceId: videoState.deviceId ?? '',
    onDeviceChange: (deviceType, deviceId) => {
      if (deviceType === 'videoinput') {
        onDeviceChange?.('videoinput', deviceId);
      }
    },
    onError: (error) => {
      console.error('Video toggle error:', error);
    },
    onPermissionDenied: handleVideoPermissionDenied,
  });

  const audioToggle = useMediaToggle('audioinput', {
    deviceId: audioState.deviceId ?? '',
    onDeviceChange: (deviceType, deviceId) => {
      if (deviceType === 'audioinput') {
        onDeviceChange?.('audioinput', deviceId);
      }
    },
    onError: (error) => {
      console.error('Audio toggle error:', error);
    },
    onPermissionDenied: handleAudioPermissionDenied,
  });

  const speakerToggle = useMediaToggle('audiooutput', {
    deviceId: speakerState.deviceId ?? '',
    audioElement: audioElement || undefined,
    onDeviceChange: (deviceType, deviceId) => {
      if (deviceType === 'audiooutput') {
        onDeviceChange?.('audiooutput', deviceId);
      }
    },
    onError: (error) => {
      console.error('Speaker toggle error:', error);
    },
  });

  // 버튼 refs
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const videoButtonRef = useRef<HTMLButtonElement>(null);
  const speakerButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMic = () => {
    audioToggle.toggle();
  };

  const toggleVideo = () => {
    videoToggle.toggle();
  };

  const toggleSpeaker = () => {
    speakerToggle.toggle();
  };

  const handleMicSelect = (deviceId: string) => {
    audioToggle.changeDevice(deviceId);
  };

  const handleVideoSelect = (deviceId: string) => {
    videoToggle.changeDevice(deviceId);
  };

  const handleSpeakerSelect = (deviceId: string) => {
    speakerToggle.changeDevice(deviceId);
  };

  return (
    <div className="flex items-center justify-center space-x-4 relative">
      {/* 마이크 컨트롤 */}
      <div className="flex items-center space-x-2 relative">
        <button
          onClick={toggleMic}
          disabled={audioToggle.isPending}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            audioToggle.isEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
          } ${audioToggle.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {audioToggle.isEnabled ? (
            <Mic color="white" />
          ) : (
            <MicOff color="white" />
          )}
        </button>
        <button
          ref={micButtonRef}
          onClick={() => setShowMicSelector(!showMicSelector)}
        >
          <EllipsisVertical color="white" />
        </button>

        <DeviceSelector
          isOpen={showMicSelector}
          onClose={() => setShowMicSelector(false)}
          deviceType="audioinput"
          title="마이크 선택"
          currentDeviceId={audioState.deviceId ?? ''}
          onDeviceSelect={handleMicSelect}
          buttonRef={micButtonRef}
        />
      </div>

      {/* 비디오 컨트롤 */}
      <div className="flex items-center space-x-2 relative">
        <button
          onClick={toggleVideo}
          disabled={videoToggle.isPending}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            videoToggle.isEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
          } ${videoToggle.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {videoToggle.isEnabled ? (
            <Video color="white" />
          ) : (
            <VideoOff color="white" />
          )}
        </button>
        <button
          ref={videoButtonRef}
          onClick={() => setShowVideoSelector(!showVideoSelector)}
        >
          <EllipsisVertical color="white" />
        </button>

        <DeviceSelector
          isOpen={showVideoSelector}
          onClose={() => setShowVideoSelector(false)}
          deviceType="videoinput"
          title="카메라 선택"
          currentDeviceId={videoState.deviceId ?? ''}
          onDeviceSelect={handleVideoSelect}
          buttonRef={videoButtonRef}
        />
      </div>

      {/* 스피커 컨트롤 */}
      <div className="flex items-center space-x-2 relative">
        <button
          onClick={toggleSpeaker}
          disabled={speakerToggle.isPending}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            speakerToggle.isEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
          } ${speakerToggle.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {speakerToggle.isEnabled ? (
            <Volume2 color="white" />
          ) : (
            <VolumeOff color="white" />
          )}
        </button>
        <button
          ref={speakerButtonRef}
          onClick={() => setShowSpeakerSelector(!showSpeakerSelector)}
        >
          <EllipsisVertical color="white" />
        </button>

        <DeviceSelector
          isOpen={showSpeakerSelector}
          onClose={() => setShowSpeakerSelector(false)}
          deviceType="audiooutput"
          title="스피커 선택"
          currentDeviceId={speakerState.deviceId ?? ''}
          onDeviceSelect={handleSpeakerSelect}
          buttonRef={speakerButtonRef}
        />
      </div>

      {/* 권한 요청 알림 다이얼로그 */}
      <PermissionAlertDialog
        open={showPermissionAlert}
        onOpenChange={setShowPermissionAlert}
        mediaType={permissionType}
      />
    </div>
  );
};
