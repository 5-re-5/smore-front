import { Button } from '@/shared/ui/button';
import { Image, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useImageProcessor } from '../model/useImageProcessor';

interface ThumbnailUploadSectionProps {
  onImageChange: (file: File | null) => void;
  error?: string;
}

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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    processImage,
    progress,
    isProcessing,
    error: processingError,
    cancelProcessing,
  } = useImageProcessor();

  // 기본 파일 검증 (WebWorker에서 추가 검증 수행)
  const validateImageFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'jpg, jpeg, png, webp 파일만 업로드 가능합니다';
    }

    if (file.size === 0) {
      return '파일이 비어있습니다';
    }

    return null;
  };

  // WebWorker를 사용한 이미지 처리
  const processImageFile = async (file: File) => {
    setUploadError(null);

    try {
      // 1. 기본 검증
      const validationError = validateImageFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      // 2. WebWorker로 이미지 처리
      const result = await processImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.9,
      });

      // 3. 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(result.file);
      setPreviewUrl(previewUrl);

      // 4. 부모 컴포넌트에 전달
      onImageChange(result.file);
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '이미지 처리 중 오류가 발생했습니다';
      setUploadError(errorMessage);
    }
  };

  // 에러 상태 관리
  useEffect(() => {
    if (processingError) {
      setUploadError(processingError);
    }
  }, [processingError]);

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
        <div
          onClick={handleButtonClick}
          className="flex overflow-hidden justify-center items-center w-64 h-40 bg-gray-100 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="스터디룸 썸네일"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-center">
              <Image className="mx-auto mb-2 w-12 h-12 text-gray-400" />
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
              <div className="flex gap-2 items-start">
                <span className="font-medium text-blue-600">1.</span>
                <span>지원 형식: JPG, JPEG, PNG, WebP</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-medium text-blue-600">2.</span>
                <span>최대 파일 크기: 100MB</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-medium text-blue-600">3.</span>
                <span>이미지는 WebP 포맷으로 자동 변환됩니다</span>
              </div>
            </div>
          </div>

          {/* 진행률 표시 */}
          {isProcessing && (
            <div className="space-y-2 w-64">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">이미지 처리 중...</span>
                <span className="text-blue-600 font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Button
                type="button"
                onClick={cancelProcessing}
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                처리 취소
              </Button>
            </div>
          )}

          {/* 업로드 버튼들 */}
          {!isProcessing && (
            <div className="space-y-3">
              {!previewUrl ? (
                <Button
                  type="button"
                  onClick={handleButtonClick}
                  className="w-64 text-white bg-blue-600 hover:bg-blue-700"
                >
                  이미지 등록하기
                </Button>
              ) : (
                <div className="flex gap-3 w-64">
                  <Button
                    type="button"
                    onClick={handleButtonClick}
                    className="flex-1 text-white bg-blue-600 hover:bg-blue-700"
                  >
                    변경하기
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
          )}

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
