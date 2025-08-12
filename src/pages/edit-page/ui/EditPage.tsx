import { useAuth, useUserInfo } from '@/entities/user';
import { updateUserProfile } from '@/entities/user/api/userApi';
import { userProfileQueryKeys } from '@/entities/user/api/queries/userQueries';
import {
  createCroppedBlobWithDimensions,
  loadImageFromBlob,
} from '@/features/focus-capture/model/imageResize';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';

// 이미지 업로드 관련 상수
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const PROFILE_WIDTH = 40;
const PROFILE_HEIGHT = 40;

function EditPage() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { data: userInfo } = useUserInfo(userId);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 상태 관리
  const [nickname, setNickname] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 사용자 정보가 로드되면 초기값 설정
  useEffect(() => {
    if (userInfo) {
      // 닉네임은 비어있을 때만 설정 (사용자가 변경한 값 보호)
      if (!nickname) {
        setNickname(userInfo.nickname || '');
      }
      // 새로 업로드한 이미지가 없고 기존 프로필 이미지가 있으면 설정
      if (!previewUrl && userInfo.profileUrl) {
        setPreviewUrl(userInfo.profileUrl);
      }
    }
  }, [userInfo, previewUrl, nickname]);

  // 이미지 디코딩 검증 함수
  const canDecodeImageFromFile = async (file: File): Promise<boolean> => {
    const url = URL.createObjectURL(file);

    try {
      const timeoutPromise = new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => resolve(false), 5000);
        return timer;
      });

      if ('createImageBitmap' in window) {
        try {
          const decodePromise = createImageBitmap(file).then((bmp) => {
            const ok = bmp.width > 0 && bmp.height > 0;
            bmp.close?.();
            return ok;
          });

          return await Promise.race([decodePromise, timeoutPromise]);
        } catch {
          // fallback으로 이동
        }
      }

      const img = document.createElement('img') as HTMLImageElement;
      img.decoding = 'async';

      const decodePromise = new Promise<boolean>((resolve) => {
        img.onload = () => {
          const ok = img.naturalWidth > 0 && img.naturalHeight > 0;
          resolve(ok);
        };
        img.onerror = () => resolve(false);
      });

      img.src = url;

      if ('decode' in img && typeof img.decode === 'function') {
        try {
          await img.decode();
          return await Promise.race([decodePromise, timeoutPromise]);
        } catch {
          return false;
        }
      }

      return await Promise.race([decodePromise, timeoutPromise]);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  // 이미지 유효성 검사 함수
  const validateImageFileStrict = async (
    file: File,
  ): Promise<string | null> => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'jpg, jpeg, png, webp 파일만 업로드 가능합니다';
    }

    if (file.size > MAX_FILE_SIZE) {
      return '파일 크기가 2MB를 초과합니다';
    }

    if (file.size === 0) {
      return '파일이 비어있습니다';
    }

    try {
      const decodable = await canDecodeImageFromFile(file);
      if (!decodable) {
        return '이미지를 불러올 수 없습니다. 파일이 손상되었거나 지원되지 않는 형식입니다';
      }

      return null;
    } catch (error) {
      console.error('이미지 검증 중 오류:', error);
      return '이미지 검증 중 오류가 발생했습니다';
    }
  };

  // 이미지 파일 처리 함수
  const processImageFile = async (file: File) => {
    setIsProcessing(true);
    setUploadError(null);

    try {
      const validationError = await validateImageFileStrict(file);
      if (validationError) {
        setUploadError(validationError);
        setIsProcessing(false);
        return;
      }

      const image = await loadImageFromBlob(file);

      const resizedBlob = await createCroppedBlobWithDimensions(
        image,
        PROFILE_WIDTH,
        PROFILE_HEIGHT,
        0.9,
        'image/webp',
      );

      const resizedFile = new File([resizedBlob], 'profile.webp', {
        type: 'image/webp',
      });

      const previewUrl = URL.createObjectURL(resizedBlob);
      setPreviewUrl(previewUrl);
      setProfileImage(resizedFile);
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      setUploadError('이미지 처리 중 오류가 발생했습니다');
    } finally {
      setIsProcessing(false);
    }
  };

  // 이벤트 핸들러 함수들
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageDelete = async () => {
    if (!userId) {
      toast.error('사용자 정보를 불러올 수 없습니다');
      return;
    }

    setIsLoading(true);

    try {
      // 서버에서 이미지 삭제
      await updateUserProfile(userId, {
        removeImage: true,
      });

      // 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: userProfileQueryKeys.profile(userId),
      });

      // 로컬 상태 초기화
      setPreviewUrl(null);
      setUploadError(null);
      setProfileImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success('프로필 이미지가 삭제되었습니다');
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      toast.error('이미지 삭제에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!nickname.trim()) {
      toast.error('이름을 입력해주세요');
      return;
    }

    if (!userId) {
      toast.error('사용자 정보를 불러올 수 없습니다');
      return;
    }

    // 이름이 기존과 동일하면 무조건 에러
    if (nickname.trim() === userInfo?.nickname) {
      setNicknameError('기존 이름과 동일합니다. 다른 이름을 입력해주세요');
      return;
    }

    // 닉네임 에러 상태 초기화
    setNicknameError(null);

    setIsLoading(true);

    try {
      await updateUserProfile(userId, {
        nickname: nickname.trim(),
        profileImage: profileImage || undefined,
      });

      // 사용자 프로필 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: userProfileQueryKeys.profile(userId),
      });

      toast.success('프로필이 성공적으로 업데이트되었습니다');
      navigate({ to: '/my-page' });
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      toast.error('프로필 업데이트에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen px-[32.5rem]"
      style={{
        backgroundColor: '#ECF0F3',
        fontFamily: 'IBM Plex Mono',
      }}
    >
      <div className="w-[25rem] mx-auto pt-[5.625rem]">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          className="hidden"
        />

        {/* 프로필 섹션 */}
        <div className="mb-[4.125rem]">
          <h2 className="mb-4 text-base font-medium">프로필</h2>
          <div className="flex justify-between items-center">
            {/* 왼쪽 그룹: 썸네일 + 사진 변경 버튼 */}
            <div className="flex items-center">
              <div className="w-[2.5rem] h-[2.5rem] bg-gray-300 rounded-full overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="프로필 이미지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300"></div>
                )}
              </div>
              <button
                className="ml-[2.75rem] h-[3.125rem] px-6 text-[0.875rem] rounded-[2.625rem]"
                style={{
                  background: '#D6E3F3',
                  boxShadow: '-6px -4px 15px 0 #FFF, 4px 4px 15px 0 #C3C3C3',
                  cursor: 'pointer',
                }}
                onClick={handleImageUpload}
                disabled={isProcessing}
              >
                {isProcessing ? '처리중...' : '사진 변경'}
              </button>
            </div>

            {/* 오른쪽 그룹: 삭제 버튼 */}
            <button
              className="h-[3.125rem] px-6 text-[0.875rem] rounded-[2.625rem]"
              style={{
                background: '#ECF0F3',
                boxShadow:
                  '-6px -4px 15px 0 #FFF inset, 4px 4px 15px 0 #C3C3C3 inset',
                cursor: 'pointer',
              }}
              onClick={handleImageDelete}
            >
              삭제
            </button>
          </div>
          {/* 에러 메시지 */}
          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
        </div>

        {/* 이름 섹션 */}
        <div className="mb-[5.25rem]">
          <h2 className="mb-4 text-base font-medium">이름</h2>
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              // 입력 시 에러 상태 초기화
              if (nicknameError) {
                setNicknameError(null);
              }
            }}
            maxLength={5}
            className="w-full h-[3.125rem] px-4 text-base bg-transparent border-0 outline-none rounded-[1.875rem]"
            style={{
              background: '#ECF0F3',
              boxShadow:
                '-6px -4px 15px 0 #FFF inset, 4px 4px 15px 0 #C3C3C3 inset',
            }}
            placeholder="이름을 입력하세요"
          />
          {/* 닉네임 에러 메시지 */}
          {nicknameError && (
            <p className="mt-2 text-sm text-red-600">{nicknameError}</p>
          )}
        </div>

        {/* 액션 버튼 섹션 */}
        <div className="flex justify-between">
          <button
            className="h-[3.125rem] px-8 text-[0.875rem] rounded-[2.625rem]"
            style={{
              background: '#ECF0F3',
              boxShadow:
                '-6px -4px 15px 0 #FFF inset, 4px 4px 15px 0 #C3C3C3 inset',
              cursor: 'pointer',
            }}
            onClick={() => navigate({ to: '/my-page' })}
          >
            cancel
          </button>

          <button
            className="h-[3.125rem] px-6 text-[0.875rem] rounded-[2.625rem]"
            style={{
              background: '#D6E3F3',
              boxShadow: '-6px -4px 15px 0 #FFF, 4px 4px 15px 0 #C3C3C3',
              cursor: 'pointer',
            }}
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? '저장중...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
