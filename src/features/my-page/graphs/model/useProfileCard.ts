import { useState, useEffect } from 'react';
import { fetchProfileData } from '../api/ProfileCardApi';
import type { ProfileApiResponse } from '../types/ProfileCardTypes';

export function useProfileCard(userId: string) {
  const [profile, setProfile] = useState<ProfileApiResponse['data'] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProfileData(userId)
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userId]);

  return { profile, loading };
}
