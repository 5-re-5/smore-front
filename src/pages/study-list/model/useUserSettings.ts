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
  const [determination, setDeterminationState] = useState<string>('');

  const setDetermination = useCallback((value: string) => {
    const limitedValue = value.length > 15 ? value.slice(0, 15) : value;
    setDeterminationState(limitedValue);
  }, []);
  const [targetDateTitle, setTargetDateTitleState] = useState<string>('');

  // D-DAY 제목 설정 함수 (10자 제한)
  const setTargetDateTitle = useCallback((value: string) => {
    const limitedValue = value.length > 10 ? value.slice(0, 10) : value;
    setTargetDateTitleState(limitedValue);
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const updateSettingsMutation = useUpdateUserSettingsMutation();

  // 폼 초기값 설정 함수
  const resetFormToDefaults = useCallback(() => {
    if (!userProfile) {
      return;
    }

    const goalTimeHours = userProfile.goalStudyTime / 60 || 1;

    // 시간 계산 (1-23 범위로 제한)
    const hours = Math.floor(goalTimeHours);
    const safeHours = Math.min(Math.max(hours, 1), 23);

    // 분 계산 (15분 단위로 반올림하여 0, 15, 30, 45 중 하나로 설정)
    const exactMinutes = Math.round((goalTimeHours % 1) * 60);
    const roundedMinutes = Math.round(exactMinutes / 15) * 15;
    const safeMinutes = Math.min(roundedMinutes, 45);

    setTargetHour(safeHours.toString());
    setTargetMinute(safeMinutes.toString());
    setDeterminationState(userProfile.determination || '');
    setTargetDateTitleState(userProfile.targetDateTitle || '');
    if (userProfile.targetDate) {
      setSelectedDate(parseServerDate(userProfile.targetDate));
    }
  }, [userProfile]);

  // userProfile 데이터로 초기값 설정
  useEffect(() => {
    resetFormToDefaults();
  }, [resetFormToDefaults]);

  // API 데이터 변환 함수
  const convertToApiData = () => {
    const totalStudyTime = parseInt(targetHour) * 60 + parseInt(targetMinute);
    return {
      goalStudyTime: totalStudyTime ?? null,
      determination: determination.trim() ?? null,
      targetDate: formatDateForServer(selectedDate!) ?? null,
      targetDateTitle: targetDateTitle.trim() ?? null,
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
    determination,
    targetDateTitle,
    selectedDate,
    isOpen,
    isLoading: updateSettingsMutation.isPending,

    // 상태 업데이트 함수
    setTargetHour,
    setTargetMinute,
    setDetermination,
    setTargetDateTitle,
    setSelectedDate,
    setIsOpen,

    // 핸들러
    handleSave,
    handleCancel,
  };
};
