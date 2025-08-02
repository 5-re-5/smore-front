import { useState, useEffect, useCallback } from 'react';

interface Device {
  deviceId: string;
  label: string;
}

interface DeviceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  deviceType: 'audioinput' | 'videoinput' | 'audiooutput';
  title: string;
  currentDeviceId?: string;
  onDeviceSelect: (deviceId: string) => void;
}

export const DeviceSelector = ({
  isOpen,
  onClose,
  deviceType,
  title,
  currentDeviceId,
  onDeviceSelect,
}: DeviceSelectorProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  const getDeviceTypeName = useCallback(() => {
    switch (deviceType) {
      case 'audioinput':
        return '마이크';
      case 'videoinput':
        return '카메라';
      case 'audiooutput':
        return '스피커';
      default:
        return '기기';
    }
  }, [deviceType]);

  const loadDevices = useCallback(async () => {
    setLoading(true);
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const filteredDevices = deviceList
        .filter((device) => device.kind === deviceType)
        .map((device) => ({
          deviceId: device.deviceId,
          label:
            device.label ||
            `${getDeviceTypeName()} ${device.deviceId.slice(0, 8)}...`,
        }));

      setDevices(filteredDevices);
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
    } finally {
      setLoading(false);
    }
  }, [deviceType, getDeviceTypeName]);

  useEffect(() => {
    if (isOpen) {
      loadDevices();
    }
  }, [isOpen, loadDevices]);

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 z-[60]" onClick={onClose} />

      {/* 드롭다운 */}
      <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-xl border z-[70] min-w-64 max-w-xs">
        <div className="p-3 border-b">
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">기기 목록 로딩 중...</p>
            </div>
          ) : devices.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-600">
                사용 가능한 {getDeviceTypeName()}가 없습니다
              </p>
            </div>
          ) : (
            devices.map((device) => (
              <button
                key={device.deviceId}
                onClick={() => {
                  onDeviceSelect(device.deviceId);
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  currentDeviceId === device.deviceId
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {currentDeviceId === device.deviceId && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="text-sm">{device.label}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};
