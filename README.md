# 🎓 Smore - 실시간 협업 스터디 플랫폼

## 🎯 프로젝트 소개

**Smore**는 AI 기반 학습 관리와 실시간 화상 회의 기능을 결합한 차세대 협업 스터디 플랫폼입니다. 

MediaPipe 기반의 얼굴 인식 기술로 자동 출석 체크를 제공하고, LiveKit을 활용한 고품질 실시간 소통 환경에서 효율적인 그룹 스터디를 경험할 수 있습니다. 스톱워치, 포모도로 타이머, 화이트노이즈 등 다양한 학습 도구를 통해 개인의 집중력을 극대화하고 학습 성과를 체계적으로 관리할 수 있습니다.

## ✨ 주요 기능

### 🎥 실시간 화상 회의
- **LiveKit 기반 고품질 스트리밍**: WebRTC 기술을 활용한 끊김 없는 비디오/오디오 통신
- **다중 참가자 지원**: 최대 여러 명이 동시 참여 가능한 스터디룸
- **화면 공유**: 학습 자료 및 화면 실시간 공유 기능

### 🤖 AI 기반 자리 비움 감지
- **MediaPipe 얼굴 인식**: 실시간 얼굴 감지를 통한 자동 출석 체크
- **집중도 분석**: 학습 중 집중 상태 모니터링 및 분석
- **자동 알림**: 자리 비움 감지 시 자동 알림 시스템

### ⏱️ 학습 생산성 도구
- **스톱워치**: 개인별 학습 시간 측정 및 기록
- **포모도로 타이머**: 25분 집중 + 5분 휴식 사이클 관리
- **화이트노이즈**: 집중력 향상을 위한 배경음 제공
- **마이크 시각화**: 실시간 음성 레벨 시각적 표시

### 👥 참가자 관리 및 소통
- **실시간 채팅**: 텍스트 기반 즉시 소통
- **참가자 상태 관리**: 온라인/오프라인 상태 실시간 표시
- **룸 생성 및 관리**: 스터디룸 생성, 초대, 설정 관리

### 📊 학습 분석 및 리포트
- **개인 학습 통계**: 일일/주간/월간 학습 시간 분석
- **집중도 리포트**: AI 기반 집중도 측정 결과 제공
- **그룹 스터디 분석**: 팀 전체 학습 패턴 및 성과 분석

## 🛠️ 기술 스택

### Frontend
- **React 19**: 최신 React 버전으로 구현된 사용자 인터페이스
- **TypeScript**: 타입 안전성을 보장하는 정적 타입 언어
- **Vite**: 빠른 개발 환경과 최적화된 빌드 시스템

### Real-time Communication
- **LiveKit**: WebRTC 기반 실시간 비디오/오디오 스트리밍
- **STOMP WebSocket**: 실시간 메시징 및 데이터 통신
- **@livekit/components-react**: LiveKit React 컴포넌트 라이브러리

### AI/ML
- **MediaPipe**: Google의 얼굴 인식 및 컴퓨터 비전 라이브러리
- **@mediapipe/tasks-vision**: 실시간 얼굴 감지 및 분석

### State Management
- **Zustand**: 경량 상태 관리 라이브러리
- **TanStack Query**: 서버 상태 관리 및 캐싱
- **React Hook Form**: 효율적인 폼 상태 관리

### UI/UX
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **shadcn/ui**: 모던한 React 컴포넌트 라이브러리
- **Radix UI**: 접근성이 뛰어난 헤드리스 UI 컴포넌트
- **Lucide React**: 아이콘 라이브러리

### Development & Testing
- **Vitest**: 빠른 유닛 테스트 프레임워크
- **Testing Library**: React 컴포넌트 테스팅
- **ESLint**: 코드 품질 및 일관성 검사
- **Prettier**: 코드 포매팅 자동화

## 📸 사용화면

<!-- 이곳에 스크린샷 및 사용 화면을 추가해주세요 -->

## 🚀 시작하기

### 필수 요구사항
- **Node.js**: 18.0.0 이상
- **npm**: 8.0.0 이상

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/smore-front.git
   cd smore-front
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경변수 설정**
   ```bash
   # .env.local 파일 생성 후 다음 변수들을 설정해주세요
   VITE_LIVEKIT_WS_URL=your_livekit_server_url
   VITE_BACK_URL=your_api_server_url
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   
   애플리케이션이 `http://localhost:3000`에서 실행됩니다.

### 추가 명령어

```bash
# 프로덕션 빌드
npm run build

# 테스트 실행
npm run test

# 코드 린팅
npm run lint

# 코드 포매팅 및 린트 수정
npm run check

# TypeScript 타입 체크
npx tsc --noEmit
```

## 📁 프로젝트 구조

본 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처 패턴을 따릅니다.

```
src/
├── app/                    # 애플리케이션 레이어
│   ├── providers/          # React Context, 상태 제공자
│   └── router/             # 라우팅 설정
├── pages/                  # 페이지 컴포넌트
├── widgets/                # 복합 UI 블록
│   ├── room-layout/        # 스터디룸 레이아웃
│   ├── media-toolbar/      # 미디어 제어 도구
│   └── header/             # 헤더 컴포넌트
├── features/               # 비즈니스 기능
│   ├── face-detection/     # 얼굴 인식 기능
│   ├── participants/       # 참가자 관리
│   ├── stopwatch/          # 스톱워치 기능
│   ├── pomodoro/           # 포모도로 타이머
│   ├── white-noise/        # 화이트노이즈
│   └── chat/               # 채팅 기능
├── entities/               # 핵심 비즈니스 엔티티
│   └── track/              # LiveKit 트랙 관리
├── shared/                 # 공통 유틸리티
│   ├── api/                # API 클라이언트
│   ├── ui/                 # 공통 UI 컴포넌트
│   ├── lib/                # 유틸리티 함수
│   └── types/              # TypeScript 타입 정의
└── styles/                 # 전역 스타일
```

### 아키텍처 특징
- **단방향 의존성**: 상위 레이어에서 하위 레이어로만 의존
- **기능별 격리**: 각 feature는 독립적이고 재사용 가능
- **명확한 책임 분리**: 각 레이어는 고유한 역할과 책임을 가짐

## 🛠️ 개발 가이드

### 코딩 컨벤션

**컴포넌트 구조**
```typescript
// ✅ 권장: 로직과 UI 분리
const useFeatureLogic = () => {
  // 비즈니스 로직
}

const FeatureComponent = () => {
  const logic = useFeatureLogic()
  return <div>...</div>
}
```

**네이밍 규칙**
- 커스텀 훅: `use~` (예: `useStopwatchStore`, `useFaceDetection`)
- 컴포넌트: `PascalCase` (예: `StopwatchController`, `VideoTile`)
- 스토어: `use~Store` (예: `useWhiteNoiseStore`)

**Early Return 패턴**
```typescript
// ✅ 권장: Early return 사용
if (!data) return <Loading />
if (error) return <Error />
return <Content data={data} />

// ❌ 지양: else 구문 사용
if (condition) {
  return result1
} else {
  return result2
}
```

### 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **TanStack Query**: 서버 상태 및 캐싱
- **선언적 프로그래밍**: useEffect보다 선언적 접근 방식 선호

### 테스트
```bash
# 전체 테스트 실행
npm run test

# 특정 파일 테스트
npm run test -- feature.test.ts

# 커버리지 확인
npm run test -- --coverage
```

### 빌드 및 배포
```bash
# TypeScript 타입 체크
npx tsc --noEmit

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run serve
```

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조해주세요.

---

💡 **문의사항이나 버그 리포트는 [Issues](https://github.com/your-username/smore-front/issues)를 통해 제보해주세요.**