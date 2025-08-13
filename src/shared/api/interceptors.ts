import type { AxiosInstance } from 'axios';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

export const setupAuthInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // refresh API 전용 401 처리 (다른 로직보다 먼저)
      if (
        error.response?.status === 401 &&
        originalRequest.url?.includes('/api/v1/auth/refresh')
      ) {
        // store 상태 초기화 (쿠키와 동기화)
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        try {
          await axiosInstance.post(
            `${import.meta.env.VITE_BACK_URL}/api/v1/auth/refresh`,
          );
          processQueue(null);
          return axiosInstance(originalRequest);
        } catch (refreshError: unknown) {
          const axiosError = refreshError as { response?: { status: number } };

          // refresh 실패 시 즉시 로그인 페이지로 리다이렉트
          if (
            axiosError.response?.status === 401 ||
            axiosError.response?.status === 403
          ) {
            // store 상태 초기화 (쿠키와 동기화)
            useAuthStore.getState().logout();
            window.location.href = '/login';
            processQueue(refreshError, null); // 리다이렉트 후 대기 중인 요청들 정리
            return Promise.reject(refreshError);
          }

          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
};
