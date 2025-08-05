// ProfileCard.tsx
import MarshmallowHeatmap from './MarshmallowHeatmap';

const dummyUser = {
  name: '김종운',
  streak: 25,
  goal: '토익 스피킹 IH 취득',
  grade: '오레레레오',
  oreoCount: 3,
  profileImg: 'https://via.placeholder.com/120x120.png?text=Profile',
};

export default function ProfileCard() {
  const handleEditProfile = () => {
    window.location.href = '/profile-edit';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 2px 12px #eef1f9',
        padding: 36,
        marginBottom: 32,
        gap: 36,
        flexDirection: 'row',
      }}
    >
      {/* 프로필 사진 + 톱니바퀴 */}
      <div style={{ position: 'relative', minWidth: 122 }}>
        <img
          src={dummyUser.profileImg}
          alt="프로필"
          style={{
            width: 120,
            height: 120,
            objectFit: 'cover',
            borderRadius: 24,
            border: '2px solid #e6edf7',
          }}
        />
        <button
          style={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            background: '#fff',
            borderRadius: '50%',
            border: 'none',
            boxShadow: '0 2px 8px #eee',
            padding: 6,
            cursor: 'pointer',
          }}
          onClick={handleEditProfile}
          title="프로필 수정"
        >
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

      {/* 유저 정보 */}
      <div style={{ minWidth: 200, marginTop: 8 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#222',
            marginBottom: 2,
          }}
        >
          {dummyUser.name}
        </div>
        <div style={{ color: '#666', fontWeight: 600, marginBottom: 4 }}>
          연속 {dummyUser.streak}일 출석!
        </div>
        <div
          style={{
            color: '#19c4b2',
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          {dummyUser.goal}
        </div>
        {/* 하단에 '마시멜로 굽기' + 히트맵 */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>마시멜로 굽기</div>
          <MarshmallowHeatmap />
        </div>
      </div>

      {/* 등급/오레오 카드 */}
      <div
        style={{
          background: '#f8fafd',
          borderRadius: 16,
          padding: '18px 28px',
          marginLeft: 'auto',
          minWidth: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 2px 10px #eef1f9',
        }}
      >
        <div
          style={{
            color: '#555',
            background: '#fff',
            borderRadius: 15,
            padding: '2px 15px',
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {dummyUser.grade}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 6,
          }}
        >
          {Array.from({ length: dummyUser.oreoCount }).map((_, i) => (
            <img
              key={i}
              src="https://cdn-icons-png.flaticon.com/512/1734/1734063.png"
              alt="오레오"
              style={{
                width: 36,
                height: 36,
                filter: 'drop-shadow(0 1px 2px #d1d1d1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
