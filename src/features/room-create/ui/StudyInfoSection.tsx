import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Controller } from 'react-hook-form';

interface StudyInfoSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
}

export function StudyInfoSection({
  control,
  errors,
  watch,
}: StudyInfoSectionProps) {
  const isPrivate = watch('isPrivate');

  return (
    <div className="space-y-6">
      {/* 스터디 이름 */}
      <div className="space-y-1">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          스터디 이름 <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="title"
              type="text"
              placeholder="스터디 이름을 입력해주세요 (최대 20자)"
              maxLength={20}
              className="w-[37.5rem]"
            />
          )}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* 공개여부와 방 비밀번호 */}
      <div className="flex gap-10 items-start">
        <div className="flex gap-10 items-start">
          {/* 공개여부 */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              공개여부 <span className="text-red-500">*</span>
            </Label>

            <Controller
              name="isPrivate"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? 'true' : 'false'}
                  onValueChange={(value) => field.onChange(value === 'true')}
                  className="flex flex-row gap-3 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="public" />
                    <Label
                      htmlFor="public"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      공개
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="private" />
                    <Label
                      htmlFor="private"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      비공개
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* 방 비밀번호 */}
          <div className="space-y-1">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              방 비밀번호 {isPrivate && <span className="text-red-500">*</span>}
            </Label>

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="password"
                  type="text"
                  placeholder={
                    isPrivate ? '비밀번호 입력 (최대 8자)' : '비공개 시 필요'
                  }
                  maxLength={8}
                  className="w-[12rem]"
                  disabled={!isPrivate}
                />
              )}
            />

            {errors.password && isPrivate && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* 최대 인원수 */}
        <div className="space-y-1">
          <Label className="text-sm font-medium text-gray-700">
            최대 인원수 <span className="text-red-500">*</span>
          </Label>

          <Controller
            name="maxParticipants"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <SelectTrigger className="w-[13rem]">
                  <SelectValue placeholder="인원수 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2명</SelectItem>
                  <SelectItem value="3">3명</SelectItem>
                  <SelectItem value="4">4명</SelectItem>
                  <SelectItem value="5">5명</SelectItem>
                  <SelectItem value="6">6명</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.maxParticipants && (
            <p className="text-sm text-red-600">
              {errors.maxParticipants.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
