import type { RecentStudyRoom } from '@/entities/study';
import type { UserProfile } from '@/entities/user';
import { calculateDDay } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { SettingsIcon } from '@/shared/ui/settings-icon';
import { useEffect, useState } from 'react';
import { RecentStudyCard } from './RecentStudyCard';

interface UserInfoBoxProps {
  userProfile: UserProfile;
  recentStudyRooms?: RecentStudyRoom[];
}

export const UserInfoBox = ({
  userProfile,
  recentStudyRooms,
}: UserInfoBoxProps) => {
  const [targetHour, setTargetHour] = useState<string>('1');
  const [targetMinute, setTargetMinute] = useState<string>('0');
  const [motivation, setMotivation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  // userProfile 데이터로 초기값 설정
  useEffect(() => {
    if (userProfile) {
      const goalTimeHours = userProfile.goalStudyTime || 1;
      setTargetHour(Math.floor(goalTimeHours).toString());
      setTargetMinute(((goalTimeHours % 1) * 60).toString());
      setMotivation(userProfile.determination || '');
      if (userProfile.targetDate) {
        setSelectedDate(new Date(userProfile.targetDate));
      }
    }
  }, [userProfile]);

  const handleSave = () => {
    const totalStudyTime = parseInt(targetHour) + parseInt(targetMinute) / 60;

    const formData = {
      targetHour: parseInt(targetHour),
      targetMinute: parseInt(targetMinute),
      totalStudyTime,
      motivation: motivation.trim(),
      selectedDate,
    };

    // 유효성 검사
    if (totalStudyTime === 0) {
      alert('목표 시간을 설정해주세요.');
      return;
    }

    if (!motivation.trim()) {
      alert('각오를 입력해주세요.');
      return;
    }

    if (!selectedDate) {
      alert('D-DAY 날짜를 선택해주세요.');
      return;
    }

    // TODO: 실제 API 호출로 데이터 저장
    console.log('저장할 데이터:', formData);
    alert('설정이 저장되었습니다!');
    setIsOpen(false);
  };

  const handleCancel = () => {
    // 초기값으로 리셋
    if (userProfile) {
      const goalTimeHours = userProfile.goalStudyTime || 1;
      setTargetHour(Math.floor(goalTimeHours).toString());
      setTargetMinute(((goalTimeHours % 1) * 60).toString());
      setMotivation(userProfile.determination || '');
      if (userProfile.targetDate) {
        setSelectedDate(new Date(userProfile.targetDate));
      }
    }
    setIsOpen(false);
  };

  const todayMinutes = userProfile?.todayStudyMinute ?? 0;
  const goalMinutes = (userProfile?.goalStudyTime ?? 0) * 60;
  const progressPercentage =
    goalMinutes > 0
      ? Math.round((todayMinutes / goalMinutes) * 100 * 100) / 100
      : 0;

  return (
    <div
      className="max-w-[1280px] mx-auto p-20 pb-13 rounded-[25px] space-y-10"
      style={{
        width: '100%',
        height: '100%',
        background: '#F3F3F3',
        boxShadow:
          '18.143999099731445px 18.143999099731445px 45.3599967956543px #D2D2D2',
        borderRadius: 25,
      }}
    >
      {/* 상단 헤더 - 오늘 공부한 시간 */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold text-study-text mb-2">
            오늘 공부한 시간 / 목표 시간
          </div>
          <div className="text-3xl font-bold">
            <span className="text-study-primary">
              {Math.floor(todayMinutes / 60)}시간 {todayMinutes % 60}분
            </span>
            <span className="text-study-text">
              {' '}
              / {Math.floor(goalMinutes / 60)}시간 {goalMinutes % 60}분
            </span>
          </div>
        </div>
        <div className="flex space-x-4 items-center self-start">
          <p className="text-study-muted font-medium">
            목표 시간/각오/디데이를 설정해 보세요
          </p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  <Label className="text-sm font-bold mb-2 block">
                    목표 시간
                  </Label>
                  <div className="flex gap-3 items-center">
                    <div className="flex-1">
                      <Select value={targetHour} onValueChange={setTargetHour}>
                        <SelectTrigger>
                          <SelectValue placeholder="시간" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (hour) => (
                              <SelectItem key={hour} value={hour.toString()}>
                                {hour}시간
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Select
                        value={targetMinute}
                        onValueChange={setTargetMinute}
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
                    htmlFor="motivation"
                    className="text-sm font-bold mb-2 block "
                  >
                    각오
                  </Label>
                  <Input
                    id="motivation"
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    maxLength={20}
                    placeholder="각오를 입력해주세요 (최대 20자)"
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {motivation.length}/20
                  </div>
                </div>

                {/* D-DAY */}
                <div>
                  <Label className="text-sm font-bold mb-2 block">D-DAY</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* 버튼 */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={handleCancel}>
                    취소
                  </Button>
                  <Button onClick={handleSave}>저장</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="w-full bg-gray-300 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 text-study-primary h-3 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>

      {/* 하단 정보 섹션 */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-1 space-x-24 text-center">
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              My Goal
            </div>
            <div className="text-2xl font-bold text-study-primary mb-1">
              {userProfile?.determination}
            </div>
          </div>

          <div className="flex flex-1 pl-20 space-x-24 text-center">
            <div className="text-2xl font-semibold text-gray-700 mb-2">
              D-DAY
            </div>
            <div className="text-2xl font-bold text-study-primary">
              {userProfile?.targetDateTitle}{' '}
              {userProfile?.targetDate
                ? calculateDDay(userProfile.targetDate)
                : 'D-?'}
            </div>
          </div>
        </div>

        <div className="pt-6 space-y-5">
          <div className="text-2xl font-semibold text-gray-700">
            최근 참가한 스터디
          </div>
          <div className="flex gap-4 justify-between">
            {recentStudyRooms && recentStudyRooms.length > 0 ? (
              recentStudyRooms.slice(0, 3).map((room) => (
                <div key={room.roomId} className="flex-shrink-0">
                  <RecentStudyCard room={room} />
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                최근 참가한 스터디가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
