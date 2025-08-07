// WeeklyAvgBarChart.tsx
import { Bar } from 'react-chartjs-2';

const dummyData = [
  { week: '1주차', hours: 15 },
  { week: '2주차', hours: 20 },
  { week: '3주차', hours: 12 },
  { week: '4주차', hours: 14 },
];

export default function WeeklyAvgBarChart() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 20,
        marginTop: 16,
      }}
    >
      <h4>주평균 공부 시간</h4>
      <Bar
        data={{
          labels: dummyData.map((d) => d.week),
          datasets: [
            {
              label: '평균 공부 시간',
              data: dummyData.map((d) => d.hours),
              backgroundColor: '#17B4FF',
              borderRadius: 8,
              barThickness: 28,
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
