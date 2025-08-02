import {
  EllipsisVertical,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeOff,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DeviceSelector } from './DeviceSelector';

interface MediaControlsProps {
  stream: MediaStream | null;
  onDeviceChange?: (
    deviceType: 'videoinput' | 'audioinput' | 'audiooutput',
    deviceId: string,
  ) => void;
}

export const MediaControls = ({
  stream,
  onDeviceChange,
}: MediaControlsProps) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // 드롭다운 상태
  const [showMicSelector, setShowMicSelector] = useState(false);
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [showSpeakerSelector, setShowSpeakerSelector] = useState(false);

  // 선택된 기기 ID
  const [selectedMicId, setSelectedMicId] = useState<string>();
  const [selectedVideoId, setSelectedVideoId] = useState<string>();
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>();

  // 현재 사용 중인 기기 ID 감지
  useEffect(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoTrack) {
        setSelectedVideoId(videoTrack.getSettings().deviceId);
      }
      if (audioTrack) {
        setSelectedMicId(audioTrack.getSettings().deviceId);
      }
    }
  }, [stream]);

  // 기본 스피커 감지
  useEffect(() => {
    const getDefaultSpeaker = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const speakers = devices.filter(
          (device) => device.kind === 'audiooutput',
        );
        if (speakers.length > 0) {
          setSelectedSpeakerId(speakers[0].deviceId || 'default');
        }
      } catch (error) {
        console.error('Failed to get default speaker:', error);
        setSelectedSpeakerId('default');
      }
    };

    getDefaultSpeaker();
  }, []);

  // 버튼 refs
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const videoButtonRef = useRef<HTMLButtonElement>(null);
  const speakerButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMic = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isVideoOn;
      });
    }
    setIsVideoOn(!isVideoOn);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleMicSelect = (deviceId: string) => {
    setSelectedMicId(deviceId);
    onDeviceChange?.('audioinput', deviceId);
  };

  const handleVideoSelect = (deviceId: string) => {
    setSelectedVideoId(deviceId);
    onDeviceChange?.('videoinput', deviceId);
  };

  const handleSpeakerSelect = (deviceId: string) => {
    setSelectedSpeakerId(deviceId);
    onDeviceChange?.('audiooutput', deviceId);
  };

  return (
    <div className="flex items-center justify-center space-x-4 relative">
      {/* 마이크 컨트롤 */}
      <div className="flex items-center space-x-2 relative">
        <button
          onClick={toggleMic}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isMicOn
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isMicOn ? <Mic color="white" /> : <MicOff color="white" />}
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
          currentDeviceId={selectedMicId}
          onDeviceSelect={handleMicSelect}
          buttonRef={micButtonRef}
        />
      </div>

      {/* 비디오 컨트롤 */}
      <div className="flex items-center space-x-2 relative">
        <button
          onClick={toggleVideo}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isVideoOn
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isVideoOn ? <Video color="white" /> : <VideoOff color="white" />}
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
          currentDeviceId={selectedVideoId}
          onDeviceSelect={handleVideoSelect}
          buttonRef={videoButtonRef}
        />
      </div>

      {/* 스피커 컨트롤 */}
      <div className="flex items-center space-x-2 relative">
        <button
          onClick={toggleSpeaker}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isSpeakerOn
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isSpeakerOn ? (
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
          currentDeviceId={selectedSpeakerId}
          onDeviceSelect={handleSpeakerSelect}
          buttonRef={speakerButtonRef}
        />
      </div>
    </div>
  );
};
