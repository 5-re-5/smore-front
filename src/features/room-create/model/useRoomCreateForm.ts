import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  createRoom,
  type CreateRoomFormData,
} from '@/entities/room/api/createRoom';
import { useJoinRoomMutation } from '@/entities/room/api/queries';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useUserInfo } from '@/entities/user';

const CATEGORY_MAP = {
  취업: 'EMPLOYMENT',
  자격증: 'CERTIFICATION',
  어학: 'LANGUAGE',
  자율: 'SELF_STUDY',
  회의: 'MEETING',
  학교공부: 'SCHOOL_STUDY',
} as const;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const roomCreateSchema = z
  .object({
    title: z
      .string()
      .min(1, '스터디 제목을 입력해주세요')
      .max(20, '제목은 20자 이하로 입력해주세요'),

    isPrivate: z.boolean().default(false),

    password: z
      .string()
      .optional()
      .refine((val: string | undefined) => !val || val.length <= 8, {
        message: '비밀번호는 최대 8자입니다',
      }),

    maxParticipants: z
      .number()
      .min(2, '최소 2명 이상 선택해주세요')
      .max(6, '최대 6명까지 선택할 수 있습니다'),

    category: z
      .string()
      .min(1, '카테고리를 선택해주세요')
      .refine((val) => Object.keys(CATEGORY_MAP).includes(val), {
        message: '올바른 카테고리를 선택해주세요',
      }),

    isPomodoroEnabled: z.boolean().default(false),

    focusTime: z
      .number()
      .min(1, '공부 시간은 1분 이상이어야 합니다')
      .max(100, '공부 시간은 100분 이하로 설정해주세요')
      .optional(),

    breakTime: z
      .number()
      .min(1, '휴식 시간은 1분 이상이어야 합니다')
      .max(20, '휴식 시간은 20분 이하로 설정해주세요')
      .optional(),

    tags: z
      .array(z.string().max(5, '태그는 5글자 이하로 입력해주세요'))
      .max(3, '태그는 최대 3개까지 입력할 수 있습니다')
      .default([]),

    description: z
      .string()
      .max(30, '소개글은 30자 이하로 입력해주세요')
      .optional(),

    thumbnailFile: z
      .instanceof(File)
      .optional()
      .refine(
        (file: File | undefined) => {
          if (!file) return true;
          return file.size <= MAX_FILE_SIZE;
        },
        {
          message: '파일 크기가 2MB를 초과합니다',
        },
      )
      .refine(
        (file: File | undefined) => {
          if (!file) return true;
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        },
        {
          message: 'jpg, jpeg, png, webp 파일만 업로드 가능합니다',
        },
      ),
  })
  .superRefine((data, ctx) => {
    if (data.isPrivate && (!data.password || data.password.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: '최소 1자, 최대 8자를 입력해주세요',
      });
    }
  });

export type RoomCreateFormData = z.infer<typeof roomCreateSchema>;

export const useRoomCreateForm = () => {
  const router = useRouter();

  const { getUserId } = useAuthStore();
  const { data: userInfo } = useUserInfo();
  const joinRoomMutation = useJoinRoomMutation();

  const form = useForm({
    resolver: zodResolver(roomCreateSchema),
    mode: 'onChange' as const,
    defaultValues: {
      title: '',
      isPrivate: false,
      password: '',
      maxParticipants: 6,
      category: '',
      isPomodoroEnabled: true,
      focusTime: undefined,
      breakTime: undefined,
      tags: [],
      description: '',
      thumbnailFile: undefined,
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: (data: RoomCreateFormData) => {
      const userId = getUserId();
      if (!userId) {
        throw new Error('로그인이 필요합니다.');
      }

      const formData: CreateRoomFormData = {
        title: data.title,
        description: data.description || undefined,
        password: data.isPrivate ? data.password : undefined,
        maxParticipants: data.maxParticipants,
        tag: data.tags.length > 0 ? data.tags.join(',') : undefined,
        category: CATEGORY_MAP[data.category as keyof typeof CATEGORY_MAP],
        focusTime: data.isPomodoroEnabled ? data.focusTime || 25 : undefined,
        breakTime: data.isPomodoroEnabled ? data.breakTime || 5 : undefined,
        roomImage: data.thumbnailFile,
      };

      return createRoom(formData, userId);
    },
    onSuccess: (data) => {
      toast.success('스터디룸이 성공적으로 생성되었습니다!');

      const userId = getUserId();
      if (!userId || !userInfo?.nickname) {
        toast.error('사용자 정보가 없습니다. 다시 로그인해주세요.');
        return;
      }

      const formValues = form.getValues();

      joinRoomMutation.mutate(
        {
          roomId: data.roomId,
          userId,
          identity: userInfo.nickname,
          password: formValues.isPrivate ? formValues.password : undefined,
        },
        {
          onSuccess: () => {
            router.navigate({ to: `/room/${data.roomId}` });
          },
          onError: (error) => {
            console.error('방 참가 실패:', error);
            toast.error('방 참가에 실패했습니다. 다시 시도해주세요.');
          },
        },
      );

      form.reset();
    },
    onError: (error) => {
      console.error('스터디룸 생성 실패:', error);
      toast.error('스터디룸 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });

  return {
    form,
    createRoomMutation,
    isSubmitting: createRoomMutation.isPending || joinRoomMutation.isPending,
  };
};
