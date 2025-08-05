// AiFocusLineChart.tsx
import { Line } from 'react-chartjs-2';

const dummyData = [
  { hour: '0시', score: 30 },
  { hour: '2시', score: 40 },
  { hour: '4시', score: 35 },
  { hour: '6시', score: 60 },
  { hour: '8시', score: 55 },
  { hour: '10시', score: 70 },
  { hour: '12시', score: 65 },
];

export default function AiFocusLineChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
      <h4>AI 집중도 분석 (한달 평균)</h4>
      <Line
        data={{
          labels: dummyData.map((d) => d.hour),
          datasets: [
            {
              label: '집중도 점수',
              data: dummyData.map((d) => d.score),
              borderColor: '#FF7B94',
              backgroundColor: '#FF7B9440',
              fill: true,
              tension: 0.3,
              pointRadius: 5,
            },
          ],
        }}
        options={{
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 0, max: 100 },
          },
        }}
      />
    </div>
  );
}
