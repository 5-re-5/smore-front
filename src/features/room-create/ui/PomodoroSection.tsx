import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Controller } from 'react-hook-form';

interface PomodoroSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
}

export function PomodoroSection({
  control,
  errors,
  watch,
}: PomodoroSectionProps) {
  const isPomodoroEnabled = watch('isPomodoroEnabled');

  return (
    <div className="py-4 flex items-start">
      <div className="flex gap-9 items-start">
        {/* 뽀모도로 여부 */}
        <div className="space-x-12">
          <Label className="text-sm font-medium text-gray-700">
            뽀모도로 여부
          </Label>

          <Controller
            name="isPomodoroEnabled"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value ? 'true' : 'false'}
                onValueChange={(value) => field.onChange(value === 'true')}
                className="flex flex-row gap-3 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="pomodoro-yes" />
                  <Label
                    htmlFor="pomodoro-yes"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="pomodoro-no" />
                  <Label
                    htmlFor="pomodoro-no"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    No
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        {/* 공부시간 */}
        <div className="space-y-1 ">
          <Label
            htmlFor="focusTime"
            className="text-sm font-medium text-gray-700"
          >
            공부시간{' '}
            <span className="text-red-500">
              {isPomodoroEnabled ? '*' : '\u00A0'}
            </span>
          </Label>

          <div className="flex items-center gap-2">
            <Controller
              name="focusTime"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="focusTime"
                  type="number"
                  min="1"
                  max="100"
                  value={field.value || 25}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 25)
                  }
                  className="w-20"
                  disabled={!isPomodoroEnabled}
                  placeholder={
                    !isPomodoroEnabled ? '뽀모도로 활성화 시 사용' : '25'
                  }
                />
              )}
            />
            <span className="text-sm text-gray-600">분</span>
          </div>

          {errors.focusTime && isPomodoroEnabled && (
            <p className="text-sm text-red-600">{errors.focusTime.message}</p>
          )}
        </div>

        {/* 휴식시간 */}
        <div className="space-y-1 ">
          <Label
            htmlFor="breakTime"
            className="text-sm font-medium text-gray-700"
          >
            휴식시간{' '}
            <span className="text-red-500">
              {isPomodoroEnabled ? '*' : '\u00A0'}
            </span>
          </Label>

          <div className="flex items-center gap-2">
            <Controller
              name="breakTime"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="breakTime"
                  type="number"
                  min="1"
                  max="20"
                  value={field.value || 5}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 5)
                  }
                  className="w-20"
                  disabled={!isPomodoroEnabled}
                  placeholder={
                    !isPomodoroEnabled ? '뽀모도로 활성화 시 사용' : '5'
                  }
                />
              )}
            />
            <span className="text-sm text-gray-600">분</span>
          </div>

          {errors.breakTime && isPomodoroEnabled && (
            <p className="text-sm text-red-600">{errors.breakTime.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
