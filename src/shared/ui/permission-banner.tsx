import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import {
  type MediaPermissionStatus,
  getBrowserPermissionGuideUrl,
} from '../utils/permissionUtils';

interface PermissionBannerProps {
  permissionStatus: MediaPermissionStatus;
  userPreferences: {
    video: boolean;
    audio: boolean;
  };
}

export const PermissionBanner = ({
  permissionStatus,
  userPreferences,
}: PermissionBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const hasVideoIssue =
    userPreferences.video && permissionStatus.video === 'denied';
  const hasAudioIssue =
    userPreferences.audio && permissionStatus.audio === 'denied';

  if (!hasVideoIssue && !hasAudioIssue) return null;

  const issues: string[] = [];
  if (hasVideoIssue) issues.push('카메라');
  if (hasAudioIssue) issues.push('마이크');

  const guideUrl = getBrowserPermissionGuideUrl();

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle
            className="h-5 w-5 text-amber-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            {issues.join(', ')} 권한이 필요합니다
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              {issues.join(', ')} 권한이 거부되어 있어 해당 기능을 사용할 수
              없습니다. 브라우저 설정에서 권한을 허용해주세요.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(guideUrl, '_blank')}
              className="text-amber-700 border-amber-300 hover:bg-amber-100"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              권한 설정 가이드
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.location.reload()}
              className="text-amber-700 hover:bg-amber-100"
            >
              새로고침
            </Button>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="text-amber-400 hover:bg-amber-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
