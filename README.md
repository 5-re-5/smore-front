# 🎓 Smore - 화상 스터디 플랫폼
## [SMORE 이용해보기](https://dev-smore-front.vercel.app)

## 🎯 프로젝트 소개

**Smore**는 AI를 활용한 **실시간 집중도** 기반 학습 관리와 실시간 화상 회의 기능을 결합한 차세대 협업 스터디 플랫폼입니다. 

MediaPipe 기반의 얼굴 인식 기술로 실시간 **자리비움을 감지**하여 학습 시간 스톱워치 중단을 제공하고, 4개의 AI 모델을 앙상블하여 **실시간 집중도**를 체크하고, LiveKit을 활용한 고품질 실시간 소통 환경에서 효율적인 그룹 스터디를 경험할 수 있습니다. 스톱워치, 포모도로 타이머, 화이트노이즈 등 다양한 학습 도구를 통해 개인의 집중력을 극대화하고 **학습 성과를 체계적으로 관리**할 수 있습니다.

## ✨ 주요 기능

### 🤖 AI 기반 자리 비움 감지
- **MediaPipe 얼굴 인식**: 실시간 얼굴 감지를 통한 자동 출석 체크
- **실시간 집중도 분석**: 학습 중 집중 상태 모니터링 및 분석
- **스톱워치 자동 중단**: 자리 비움 감지 시 스톱워치 자동 중단 시스템

### ⏱️ 학습 생산성 도구
- **스톱워치**: 개인별 학습 시간 측정 및 기록
- **포모도로 타이머**: 25분 집중 + 5분 휴식 사이클 관리
- **화이트노이즈**: 집중력 향상을 위한 8종 화이트 노이즈 제공

### 🎥 실시간 화상 회의
- **LiveKit 기반 고품질 스트리밍**: WebRTC 기술을 활용한 끊김 없는 비디오/오디오 통신
- **다중 참가자 지원**: 최대 6명이 동시 참여 가능한 스터디룸
- **화면 공유**: 화면 실시간 공유 기능

### 👥 참가자 관리 및 소통
- **실시간 채팅**: 텍스트 기반 즉시 소통
- **참가자 상태 관리**: 스터디룸 현재 참가자 표시
- **룸 생성 및 관리**: 스터디룸 생성, 초대, 설정 관리

### 📊 학습 분석 및 리포트
- **집중도 리포트**: AI 기반 집중도 측정 결과 제공
- **개인 학습 기록**: 지난 1년간의 학습 기록 제공
- **개인 학습 통계**: 일일/주간/월간 학습 시간 분석

## 🛠️ 기술 스택

### Frontend
- **React 19**: 최신 React 버전으로 구현된 사용자 인터페이스
- **TypeScript**: 타입 안전성을 보장하는 정적 타입 언어
- **Vite**: 빠른 개발 환경과 최적화된 빌드 시스템

### State Management
- **Zustand**: 경량 상태 관리 라이브러리
- **TanStack Query**: 서버 상태 관리 및 캐싱
- **React Hook Form**: 효율적인 폼 상태 관리

### Real-time Communication
- **LiveKit**: WebRTC 기반 실시간 비디오/오디오 스트리밍
- **@livekit/components-react**: LiveKit React 컴포넌트 라이브러리
- **STOMP WebSocket**: 실시간 메시징 및 데이터 통신

### AI/ML
- **MediaPipe**: Google의 얼굴 인식 및 컴퓨터 비전 라이브러리
- **@mediapipe/tasks-vision**: 실시간 얼굴 감지 및 분석

### UI/UX
- **Tailwind CSS**: 유틸리티 CSS 프레임워크
- **shadcn/ui**: 모던한 React 컴포넌트 라이브러리
- **Radix UI**: 접근성이 뛰어난 헤드리스 UI 컴포넌트
- **Lucide React**: 아이콘 라이브러리

### Development & Testing
- **ESLint**: 코드 품질 및 일관성 검사
- **Prettier**: 코드 포매팅 자동화
- **Husky**: 커밋 시 기준 검사 및 커밋 제어

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
├── app/                        # 애플리케이션 레이어
│   ├── routing/                # 라우팅 설정
│   ├── reportWebVitals.ts      # 성능 모니터링
│   └── styles.css              # 전역 스타일
├── pages/                      # 페이지 컴포넌트
│   ├── edit-page/              # 프로필 수정 페이지
│   ├── homepage/               # 홈페이지
│   ├── login/                  # 로그인 페이지
│   ├── my-page/                # 마이페이지
│   ├── not-found/              # 404 페이지
│   ├── prejoin/                # 입장 전 설정 페이지
│   ├── room-create/            # 룸 생성 페이지
│   ├── room/                   # 스터디룸 페이지
│   ├── search-detail-page/     # 검색 상세 페이지
│   └── study-list/             # 스터디 목록 페이지
├── widgets/                    # 복합 UI 블록
│   ├── AnalysisSection/        # 분석 섹션
│   ├── ExtraFeaturesSection/   # 부가 기능 섹션
│   ├── FeaturesSection/        # 기능 소개 섹션
│   ├── HeroSection/            # 메인 히어로 섹션
│   ├── ReviewsSection/         # 리뷰 섹션
│   ├── SolutionSection/        # 솔루션 섹션
│   ├── footer/                 # 푸터
│   ├── header/                 # 헤더
│   ├── media-toolbar/          # 미디어 제어 도구
│   ├── room-layout/            # 스터디룸 레이아웃
│   └── user/                   # 사용자 관련 위젯
├── features/                   # 비즈니스 기능
│   ├── chat/                   # 채팅 기능
│   ├── face-detection/         # 얼굴 인식 기능
│   ├── focus-capture/          # 집중도 캡처
│   ├── focus-gauge/            # 집중도 게이지
│   ├── my-page/                # 마이페이지 기능
│   ├── participants/           # 참가자 관리
│   ├── pomodoro/               # 포모도로 타이머
│   ├── prejoin/                # 입장 전 설정
│   ├── profile-card/           # 프로필 카드
│   ├── room-create/            # 룸 생성
│   ├── room/                   # 룸 관리
│   ├── stopwatch/              # 스톱워치 기능
│   └── white-noise/            # 화이트노이즈
├── entities/                   # 핵심 비즈니스 엔티티
│   ├── focus/                  # 집중도 엔티티
│   ├── room/                   # 룸 엔티티
│   ├── study/                  # 학습 엔티티
│   └── user/                   # 사용자 엔티티
├── shared/                     # 공통 유틸리티
│   ├── api/                    # API 클라이언트
│   ├── config/                 # 설정 파일
│   ├── constants/              # 상수 정의
│   ├── hooks/                  # 공통 훅
│   ├── lib/                    # 유틸리티 함수
│   ├── stores/                 # 전역 상태 저장소
│   ├── types/                  # TypeScript 타입 정의
│   ├── ui/                     # 공통 UI 컴포넌트
│   └── utils/                  # 유틸리티 함수
├── styles/                     # 전역 스타일
├── types/                      # 전역 타입 정의
├── App.tsx                     # 메인 앱 컴포넌트
├── main.tsx                    # 엔트리 포인트
└── vite-env.d.ts              # Vite 환경 타입 정의
```

### 아키텍처 특징
- **단방향 의존성**: 상위 레이어에서 하위 레이어로만 의존
- **기능별 격리**: 각 feature는 독립적이고 재사용 가능
- **명확한 책임 분리**: 각 레이어는 고유한 역할과 책임을 가짐

---

💡 **문의사항이나 버그 리포트는 [Issues](https://github.com/5-re-5/smore-front/issues)를 통해 제보해주세요.**