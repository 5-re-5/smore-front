import { Button } from '@/shared/ui/button';
import {
  useRoomCreateForm,
  type RoomCreateFormData,
} from '../model/useRoomCreateForm';
import { CategoryTagSection } from './CategoryTagSection';
import { PomodoroSection } from './PomodoroSection';
import { StudyInfoSection } from './StudyInfoSection';
import { ThumbnailUploadSection } from './ThumbnailUploadSection';

export function RoomCreateForm() {
  const { form, createRoomMutation, isSubmitting } = useRoomCreateForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    createRoomMutation.mutate(data as RoomCreateFormData);
  };

  const handleThumbnailChange = (file: File | null) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (setValue as any)('thumbnailFile', file || undefined, {
      shouldValidate: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* 썸네일 업로드 섹션 */}
        <ThumbnailUploadSection
          onImageChange={handleThumbnailChange}
          error={errors.thumbnailFile?.message}
        />

        {/* 스터디 정보 섹션 */}
        <StudyInfoSection control={control} errors={errors} watch={watch} />

        {/* 뽀모도로 섹션 */}
        <PomodoroSection control={control} errors={errors} watch={watch} />

        {/* 카테고리 및 태그 섹션 */}
        <CategoryTagSection
          control={control}
          errors={errors}
          watch={watch}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue={setValue as any}
        />

        {/* 제출 버튼 */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-96 h-12 text-lg font-medium bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isSubmitting ? '생성 중...' : '스터디 생성하기'}
          </Button>
        </div>
      </form>
    </div>
  );
}
