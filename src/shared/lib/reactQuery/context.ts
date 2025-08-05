import { queryClient } from './queryClient';

export function getContext() {
  return {
    queryClient,
  };
}
