# Smore (Study More) 📚

실시간 화상 회의와 AI 기반 학습 관리 기능을 제공하는 협업 스터디 플랫폼입니다.

## 🚀 주요 기능

### 📹 실시간 화상 회의

- LiveKit 기반 고품질 비디오/오디오 스트리밍
- 다중 참가자 지원
- 실시간 참가자 관리

### 🤖 AI 기반 자리 비움 감지

- MediaPipe를 활용한 얼굴 인식 기술
- 자동 출석 체크 및 집중도 모니터링
- 학습 효율성 향상

### ⏱️ 학습 도구

- **스톱워치**: 학습 시간 측정 및 관리
- **화이트 노이즈**: 집중력 향상을 위한 배경음 제공
- **마이크 시각화**: 실시간 음성 레벨 표시

### 🎯 스터디 관리

- 개인별 학습 시간 추적
- 그룹 스터디 세션 관리
- 학습 통계 및 분석

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Real-time**: LiveKit (WebRTC)
- **AI/ML**: MediaPipe (Face Detection)
- **State**: Zustand, TanStack Query
- **Styling**: Tailwind CSS, shadcn/ui
- **Testing**: Vitest, Testing Library

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev

# 빌드
npm run build

# 테스트
npm run test
```

## 📋 현재 구현된 기능

- ✅ 실시간 화상 회의 (LiveKit)
- ✅ 얼굴 인식 기반 출석 감지 (MediaPipe)
- ✅ 스톱워치 기능
- ✅ 화이트 노이즈 플레이어
- ✅ 마이크 시각화
- ✅ 참가자 관리 시스템
