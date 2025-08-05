// StatPanel.tsx
const dummyPanel = {
  maxFocusTime: '오전 6시-오전 8시',
  avgFocusDuration: '1시간 5분',
  aiFeedback: '오늘은 집중력이 좋아요! 내일도 화이팅!',
};

export default function StatPanel() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        marginTop: 16,
      }}
    >
      <div>
        <h5>최고 집중 시간대</h5>
        <p>{dummyPanel.maxFocusTime}</p>
      </div>
      <div>
        <h5>평균 집중 유지 시간</h5>
        <p>{dummyPanel.avgFocusDuration}</p>
      </div>
      <div>
        <h5>AI 피드백</h5>
        <p>{dummyPanel.aiFeedback}</p>
      </div>
    </div>
  );
}
