// WeeklyBarChart.tsx
import { Bar } from 'react-chartjs-2';

const dummyData = [
  { day: '월', hours: 3 },
  { day: '화', hours: 4 },
  { day: '수', hours: 2 },
  { day: '목', hours: 5 },
  { day: '금', hours: 4 },
  { day: '토', hours: 6 },
  { day: '일', hours: 1 },
];

export default function WeeklyBarChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
      <h4>주간 공부 시간 통계</h4>
      <Bar
        data={{
          labels: dummyData.map((d) => d.day),
          datasets: [
            {
              label: '공부 시간(시간)',
              data: dummyData.map((d) => d.hours),
              backgroundColor: '#1792FF',
              borderRadius: 6,
              barThickness: 32,
            },
          ],
        }}
        options={{
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}시간` } },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#222' } },
            y: { beginAtZero: true, ticks: { color: '#222' } },
          },
        }}
      />
    </div>
  );
}
