import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

interface CategoryTagSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
}

const CATEGORIES = [
  { label: '취업', value: '취업' },
  { label: '자격증', value: '자격증' },
  { label: '어학', value: '어학' },
  { label: '자율', value: '자율' },
  { label: '회의', value: '회의' },
  { label: '학교공부', value: '학교공부' },
];

export function CategoryTagSection({
  control,
  errors,
  watch,
  setValue,
}: CategoryTagSectionProps) {
  const [tagInput, setTagInput] = useState('');
  const tags = watch('tags') || [];

  const handleAddTag = () => {
    if (tagInput.trim() && tagInput.length <= 5 && tags.length < 3) {
      if (!tags.includes(tagInput.trim())) {
        setValue('tags', [...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = tags.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_: any, index: number) => index !== indexToRemove,
    );
    setValue('tags', newTags);
  };

  const handleTagInputKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-4">
      {/* 카테고리 및 태그 */}
      <div className="flex gap-2 space-x-10">
        {/* 왼쪽: 카테고리 */}
        <div className="w-1/3 space-y-1">
          <Label className="text-sm font-medium text-gray-700 ">
            카테고리 <span className="text-red-500">*</span>
          </Label>

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="카테고리를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* 오른쪽: 태그 */}
        <div className="flex-1 space-y-1">
          <Label className="text-sm font-medium text-gray-700">
            태그 (최대 3개, 5글자 이하)
          </Label>

          <div className="space-y-3">
            {/* 태그 입력 */}
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyPress}
                placeholder="태그를 입력하세요"
                maxLength={5}
                className="flex-1"
                disabled={tags.length >= 3}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={
                  !tagInput.trim() ||
                  tagInput.length > 5 ||
                  tags.length >= 3 ||
                  tags.includes(tagInput.trim())
                }
                variant="outline"
                size="sm"
              >
                추가
              </Button>
            </div>

            {/* 태그 목록 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.tags && (
              <p className="text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 소개글 */}
      <div className="space-y-1">
        <Label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          소개글 (30자 이하)
        </Label>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="description"
              type="text"
              placeholder="스터디에 대한 간단한 소개를 입력해주세요 (최대 30자)"
              maxLength={30}
              className="w-full "
            />
          )}
        />

        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
