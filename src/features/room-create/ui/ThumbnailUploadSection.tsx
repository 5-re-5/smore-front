import {
  createResizedBlobWithDimensions,
  loadImageFromBlob,
} from '@/features/focus-capture/model/imageResize';
import { Button } from '@/shared/ui/button';
import { Image } from 'lucide-react';
import { useRef, useState } from 'react';

interface ThumbnailUploadSectionProps {
  onImageChange: (file: File | null) => void;
  error?: string;
}

const THUMBNAIL_WIDTH = 250;
const THUMBNAIL_HEIGHT = 160;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export function ThumbnailUploadSection({
  onImageChange,
  error,
}: ThumbnailUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'jpg, jpeg, png, webp 파일만 업로드 가능합니다';
    }

    if (file.size > MAX_FILE_SIZE) {
      return '파일 크기가 2MB를 초과합니다';
    }

    return null;
  };

  const processImageFile = async (file: File) => {
    setIsProcessing(true);
    setUploadError(null);

    try {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        setIsProcessing(false);
        return;
      }

      // 이미지 로드
      const image = await loadImageFromBlob(file);

      // 리사이징 및 webp 변환
      const resizedBlob = await createResizedBlobWithDimensions(
        image,
        THUMBNAIL_WIDTH,
        THUMBNAIL_HEIGHT,
        0.9,
        'image/webp',
      );

      // File 객체로 변환
      const resizedFile = new File([resizedBlob], 'thumbnail.webp', {
        type: 'image/webp',
      });

      // 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(resizedBlob);
      setPreviewUrl(previewUrl);

      // 부모 컴포넌트에 전달
      onImageChange(resizedFile);
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      setUploadError('이미지 처리 중 오류가 발생했습니다');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setUploadError(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = uploadError || error;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900">스터디룸 썸네일</h3>

      <div className="flex gap-8">
        {/* 왼쪽: 썸네일 미리보기 */}
        <div className="w-64 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="스터디룸 썸네일"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">썸네일 이미지</p>
            </div>
          )}
        </div>

        {/* 오른쪽: 파일 제한사항 및 버튼들 */}
        <div className="flex-1 space-y-4">
          {/* 파일 제한사항 */}
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-gray-700">
              파일 업로드 제한사항
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">1.</span>
                <span>지원 형식: JPG, JPEG, PNG, WebP</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">2.</span>
                <span>최대 파일 크기: 2MB</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-medium">3.</span>
                <span>이미지는 250×160 크기로 자동 조정됩니다</span>
              </div>
            </div>
          </div>

          {/* 업로드 버튼들 */}
          <div className="space-y-3">
            {!previewUrl ? (
              <Button
                type="button"
                onClick={handleButtonClick}
                disabled={isProcessing}
                className="w-64 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? '처리 중...' : '이미지 등록하기'}
              </Button>
            ) : (
              <div className="flex gap-3 w-64">
                <Button
                  type="button"
                  onClick={handleButtonClick}
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isProcessing ? '처리 중...' : '변경하기'}
                </Button>
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  variant="outline"
                  className="flex-1"
                >
                  삭제하기
                </Button>
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {displayError && (
            <p className="text-sm text-red-600">{displayError}</p>
          )}
        </div>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
