import { useState, useEffect, useCallback } from 'react';
import { useUpdateUserSettingsMutation } from '@/entities/user/api';
import type { UserProfile } from '@/entities/user';

// 날짜 처리 유틸리티 함수들 (순수 함수)
const parseServerDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month는 0-based
};

const formatDateForServer = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface UseUserSettingsProps {
  userProfile: UserProfile;
}

export const useUserSettings = ({ userProfile }: UseUserSettingsProps) => {
  const [targetHour, setTargetHour] = useState<string>('1');
  const [targetMinute, setTargetMinute] = useState<string>('0');
  const [motivation, setMotivation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const updateSettingsMutation = useUpdateUserSettingsMutation();

  // 폼 초기값 설정 함수
  const resetFormToDefaults = useCallback(() => {
    if (!userProfile) {
      return;
    }

    const goalTimeHours = userProfile.goalStudyTime || 1;
    setTargetHour(Math.floor(goalTimeHours).toString());
    setTargetMinute(((goalTimeHours % 1) * 60).toString());
    setMotivation(userProfile.determination || '');
    if (userProfile.targetDate) {
      setSelectedDate(parseServerDate(userProfile.targetDate));
    }
  }, [userProfile]);

  // userProfile 데이터로 초기값 설정
  useEffect(() => {
    resetFormToDefaults();
  }, [resetFormToDefaults]);

  // 유효성 검사 함수
  const validateFormData = (): boolean => {
    const totalStudyTime = parseInt(targetHour) + parseInt(targetMinute) / 60;

    if (totalStudyTime === 0) {
      alert('목표 시간을 설정해주세요.');
      return false;
    }

    if (!motivation.trim()) {
      alert('각오를 입력해주세요.');
      return false;
    }

    if (!selectedDate) {
      alert('D-DAY 날짜를 선택해주세요.');
      return false;
    }

    return true;
  };

  // API 데이터 변환 함수
  const convertToApiData = () => {
    const totalStudyTime = parseInt(targetHour) + parseInt(targetMinute) / 60;

    return {
      goalStudyTime: totalStudyTime,
      determination: motivation.trim(),
      targetDate: formatDateForServer(selectedDate!),
      targetDateTitle: userProfile.targetDateTitle || '',
    };
  };

  // 설정 저장 함수
  const saveUserSettings = async (
    apiData: ReturnType<typeof convertToApiData>,
  ) => {
    try {
      await updateSettingsMutation.mutateAsync({
        userId: userProfile.userId,
        data: apiData,
      });

      setIsOpen(false);
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('설정 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleSave = async () => {
    if (!validateFormData()) return;

    const apiData = convertToApiData();
    await saveUserSettings(apiData);
  };

  const handleCancel = () => {
    resetFormToDefaults();
    setIsOpen(false);
  };

  return {
    // 상태
    targetHour,
    targetMinute,
    motivation,
    selectedDate,
    isOpen,
    isLoading: updateSettingsMutation.isPending,

    // 상태 업데이트 함수
    setTargetHour,
    setTargetMinute,
    setMotivation,
    setSelectedDate,
    setIsOpen,

    // 핸들러
    handleSave,
    handleCancel,
  };
};
