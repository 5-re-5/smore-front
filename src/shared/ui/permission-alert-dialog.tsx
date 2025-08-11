import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';

interface PermissionAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: 'audio' | 'video';
}

export const PermissionAlertDialog = ({
  open,
  onOpenChange,
  mediaType,
}: PermissionAlertDialogProps) => {
  const mediaName = mediaType === 'audio' ? '마이크' : '카메라';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{mediaName} 권한이 필요합니다</AlertDialogTitle>
          <AlertDialogDescription>
            {mediaName} 사용을 위해 브라우저에서 권한을 허용해주세요.
            <br />
            <br />
            <strong>권한 설정 방법:</strong>
            <br />
            1. 주소창 왼쪽의 자물쇠 아이콘을 클릭하세요
            <br />
            2. {mediaName} 권한을 "허용"으로 변경하세요
            <br />
            3. 페이지를 새로고침하고 다시 시도하세요
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            닫기
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => window.location.reload()}>
            새로고침
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
