import type { UserProfile } from '@/entities/user';
import { Calendar } from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { SettingsIcon } from '@/shared/ui/icons/settings-icon';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useUserSettings } from '../model/useUserSettings';

interface UserSettingsModalProps {
  userProfile: UserProfile;
}

export const UserSettingsModal = ({ userProfile }: UserSettingsModalProps) => {
  const userSettings = useUserSettings({ userProfile });
  return (
    <Dialog open={userSettings.isOpen} onOpenChange={userSettings.setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0 hover:bg-transparent">
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[31.25rem]">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
          <DialogDescription>
            목표 시간, 각오, D-DAY를 설정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {/* 목표 시간 */}
          <div>
            <Label className="text-sm font-bold mb-2 block">목표 시간</Label>
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <Select
                  value={userSettings.targetHour}
                  onValueChange={userSettings.setTargetHour}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="시간" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {Array.from({ length: 23 }, (_, i) => i + 1).map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour}시간
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select
                  value={userSettings.targetMinute}
                  onValueChange={userSettings.setTargetMinute}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="분" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 15, 30, 45].map((minute) => (
                      <SelectItem key={minute} value={minute.toString()}>
                        {minute}분
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 각오 */}
          <div>
            <Label
              htmlFor="determination"
              className="text-sm font-bold mb-2 block"
            >
              각오
            </Label>
            <Input
              id="determination"
              value={userSettings.determination}
              onChange={(e) => userSettings.setDetermination(e.target.value)}
              placeholder="오늘의 각오를 입력해주세요"
              className="w-full"
              maxLength={20}
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${
                  userSettings.determination.length >= 20
                    ? 'text-red-500'
                    : userSettings.determination.length >= 18
                      ? 'text-orange-500'
                      : 'text-gray-500'
                }`}
              >
                {userSettings.determination.length}/20
              </span>
            </div>
          </div>

          {/* D-DAY 설정 */}
          <div>
            <Label className="text-sm font-bold mb-2 block">D-DAY 제목</Label>
            <Input
              value={userSettings.targetDateTitle}
              onChange={(e) => userSettings.setTargetDateTitle(e.target.value)}
              placeholder="예: 수능, 토익, 프로젝트 마감일 등"
              className="w-full"
              maxLength={10}
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${
                  userSettings.targetDateTitle.length >= 10
                    ? 'text-red-500'
                    : userSettings.targetDateTitle.length >= 8
                      ? 'text-orange-500'
                      : 'text-gray-500'
                }`}
              >
                {userSettings.targetDateTitle.length}/10
              </span>
            </div>

            <Label className="text-sm font-bold mb-2 block">D-DAY 날짜</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {userSettings.selectedDate ? (
                    format(userSettings.selectedDate, 'yyyy년 MM월 dd일')
                  ) : (
                    <span>날짜를 선택해주세요</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={userSettings.selectedDate}
                  onSelect={userSettings.setSelectedDate}
                  captionLayout={'dropdown'}
                  disabled={(date) =>
                    date < new Date() || date < new Date('1900-01-01')
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={userSettings.handleCancel}
            disabled={userSettings.isLoading}
          >
            취소
          </Button>
          <Button
            onClick={userSettings.handleSave}
            disabled={userSettings.isLoading}
          >
            {userSettings.isLoading ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
