import { Check } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

const DROPDOWN_OFFSET_TOP = 8;
const DROPDOWN_OFFSET_LEFT = 100;

export const DeviceSelector = ({
  isOpen,
  onClose,
  deviceType,
  title,
  currentDeviceId,
  onDeviceSelect,
  buttonRef,
}: DeviceSelectorProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

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

      // 버튼 위치 계산
      if (buttonRef?.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + DROPDOWN_OFFSET_TOP,
          left: rect.left - DROPDOWN_OFFSET_LEFT,
        });
      }
    }
  }, [isOpen, loadDevices, buttonRef]);

  const renderLoadingState = () => (
    <div className="p-4 text-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
      <p className="text-sm text-gray-600 mt-2">기기 목록 로딩 중...</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="p-4 text-center">
      <p className="text-sm text-gray-600">
        사용 가능한 {getDeviceTypeName()}가 없습니다
      </p>
    </div>
  );

  const renderDeviceButton = (device: Device) => {
    const isSelected = currentDeviceId === device.deviceId;
    const buttonClass = `w-full rounded-xl text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
      isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
    }`;

    return (
      <button
        key={device.deviceId}
        onClick={() => {
          onDeviceSelect(device.deviceId);
          onClose();
        }}
        className={buttonClass}
      >
        <div className="flex items-center space-x-2">
          {isSelected && <Check color="#1730ee" />}
          <span className="text-sm">{device.label}</span>
        </div>
      </button>
    );
  };

  const renderDeviceList = () => {
    if (loading) return renderLoadingState();
    if (devices.length === 0) return renderEmptyState();
    return devices.map(renderDeviceButton);
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 z-[60]" onClick={onClose} />

      {/* 드롭다운 */}
      <div
        className="fixed bg-white rounded-lg shadow-xl border z-[100] min-w-64 max-w-xs"
        style={{ top: position.top, left: position.left }}
      >
        <div className="p-3 border-b">
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>

        <div className="max-h-60 overflow-y-auto">{renderDeviceList()}</div>
      </div>
    </>,
    document.body,
  );
};
