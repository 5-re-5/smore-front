// src/pages/my-page/ui/ProfileCard.tsx
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import MarshmallowHeatmap from './MarshmallowHeatmap';
import styles from './ProfileCard.module.css';

// 등급별 동적 과자 배열 (이후 gradeLevel을 API 등에서 받아올 경우 대응)
const getSnackIcons = (level: number) =>
  Array.from({ length: level }, (_, i) => (
    <img
      key={i}
      className={styles.snackIcon}
      src="/images/snack_o.png" // 과자 아이콘 (PNG, 투명 배경 권장)
      alt="등급 과자"
      draggable={false}
    />
  ));

const dummyUser = {
  name: '김종운',
  streak: 25,
  goal: '토익 스피킹 IH 취득',
  grade: 'OrerereO',
  gradeLevel: 3, // ← 등급 1~N (동적으로)
  profileImg: '', // 실제 서비스에서 유저별 URL 사용
};

const DEFAULT_PROFILE_IMG = '/images/profile_apple.jpg';

const ProfileImage: FunctionComponent<{
  src: string | null | undefined;
  alt: string;
}> = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_PROFILE_IMG);
  return (
    <img
      className={styles.profileImg}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(DEFAULT_PROFILE_IMG)}
      draggable={false}
    />
  );
};

const ProfileCard: FunctionComponent = () => {
  const handleEditProfile = () => {
    window.location.href = '/profile-edit';
  };

  return (
    <div className={styles.profileCard}>
      {/* 상단 프로필/정보/등급 */}
      <div className={styles.infoRow}>
        <div className={styles.profileWrapper}>
          <ProfileImage src={dummyUser.profileImg} alt="프로필 이미지" />
          <button
            className={styles.editButton}
            onClick={handleEditProfile}
            title="프로필 수정"
          >
            {/* svg 아이콘 유지 */}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                stroke="#888"
                strokeWidth="2"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 1 0 2.83l-.5.29a2 2 0 0 1-2.74-.7l-.14-.24a5.31 5.31 0 0 1-1.78.32 5.31 5.31 0 0 1-1.77-.32l-.15.25a2 2 0 0 1-2.74.7l-.5-.28A1.65 1.65 0 0 1 4.6 15c.07-.18.11-.37.14-.56a5.27 5.27 0 0 1-.34-1.87c0-.65.13-1.29.34-1.87-.03-.18-.07-.37-.14-.55a1.65 1.65 0 0 1 0-2.83l.5-.29a2 2 0 0 1 2.74.7l.15.24c.57.17 1.16.26 1.77.32a5.31 5.31 0 0 1 1.77-.32l.15-.25a2 2 0 0 1 2.74-.7l.5.28a1.65 1.65 0 0 1 0 2.83c-.07.18-.11.37-.14.56a5.27 5.27 0 0 1 .34 1.87c0 .65-.13 1.29-.34 1.87.03.18.07.37.14.55Z"
                stroke="#888"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
        <div className={styles.infoWrapper}>
          <div
            className={styles.streak}
          >{`연속 ${dummyUser.streak}일 출석!`}</div>
          <div className={styles.name}>{dummyUser.name}</div>
          <div className={styles.goal}>{dummyUser.goal}</div>
        </div>
        <div className={styles.gradeNeumorph}>
          <span className={styles.gradeText}>{dummyUser.grade}</span>
          <div className={styles.snackRow}>
            {getSnackIcons(dummyUser.gradeLevel)}
          </div>
        </div>
      </div>

      {/* 하단 마시멜로 히트맵, 음각 테두리 카드 */}
      <div className={styles.heatmapCard}>
        <div className={styles.heatmapTitleWrap}>
          <span className={styles.heatmapTitle}>마시멜로 굽기</span>
        </div>
        <MarshmallowHeatmap />
      </div>
    </div>
  );
};

export default ProfileCard;
