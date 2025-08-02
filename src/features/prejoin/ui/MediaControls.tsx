import { Mic, MicOff } from 'lucide-react';
import { useState } from 'react';
import { DeviceSelector } from './DeviceSelector';

interface MediaControlsProps {
  stream: MediaStream | null;
}

export const MediaControls = ({ stream }: MediaControlsProps) => {
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
    // TODO: 실제 마이크 기기 변경 로직
    console.log('Selected mic:', deviceId);
  };

  const handleVideoSelect = (deviceId: string) => {
    setSelectedVideoId(deviceId);
    // TODO: 실제 카메라 기기 변경 로직
    console.log('Selected video:', deviceId);
  };

  const handleSpeakerSelect = (deviceId: string) => {
    setSelectedSpeakerId(deviceId);
    // TODO: 실제 스피커 기기 변경 로직
    console.log('Selected speaker:', deviceId);
  };

  return (
    <div className="flex items-center justify-center space-x-4">
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
          {isMicOn ? <Mic color="#ffffff" /> : <MicOff color="#ffffff" />}
        </button>
        <button
          onClick={() => setShowMicSelector(!showMicSelector)}
          className="w-6 h-6 text-gray-400 hover:text-white"
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        <DeviceSelector
          isOpen={showMicSelector}
          onClose={() => setShowMicSelector(false)}
          deviceType="audioinput"
          title="마이크 선택"
          currentDeviceId={selectedMicId}
          onDeviceSelect={handleMicSelect}
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
          {isVideoOn ? (
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A2 2 0 0018 13V7a1 1 0 00-1.447-.894l-2 1A1 1 0 0014 8v.586l-2-2V6a2 2 0 00-2-2H8.414l-5.121-5.121z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <button
          onClick={() => setShowVideoSelector(!showVideoSelector)}
          className="w-6 h-6 text-gray-400 hover:text-white"
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        <DeviceSelector
          isOpen={showVideoSelector}
          onClose={() => setShowVideoSelector(false)}
          deviceType="videoinput"
          title="카메라 선택"
          currentDeviceId={selectedVideoId}
          onDeviceSelect={handleVideoSelect}
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
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.073 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.073l4.31-3.824zm2.91 2.217a1 1 0 011.414 0A5.972 5.972 0 0116 10a5.972 5.972 0 01-2.293 4.707 1 1 0 01-1.414-1.414A3.972 3.972 0 0014 10c0-1.18-.51-2.241-1.293-2.966a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.073 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.073l4.31-3.824zM15.293 7.293a1 1 0 011.414 0L18 8.586l1.293-1.293a1 1 0 111.414 1.414L19.414 10l1.293 1.293a1 1 0 01-1.414 1.414L18 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L16.586 10l-1.293-1.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <button
          onClick={() => setShowSpeakerSelector(!showSpeakerSelector)}
          className="w-6 h-6 text-gray-400 hover:text-white"
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>

        <DeviceSelector
          isOpen={showSpeakerSelector}
          onClose={() => setShowSpeakerSelector(false)}
          deviceType="audiooutput"
          title="스피커 선택"
          currentDeviceId={selectedSpeakerId}
          onDeviceSelect={handleSpeakerSelect}
        />
      </div>
    </div>
  );
};
