// MonthlyLineChart.tsx
import { Line } from 'react-chartjs-2';

const dummyData = [
  { date: '1주차', lastMonth: 2, thisMonth: 3 },
  { date: '2주차', lastMonth: 5, thisMonth: 4 },
  { date: '3주차', lastMonth: 6, thisMonth: 7 },
  { date: '4주차', lastMonth: 3, thisMonth: 5 },
];

export default function MonthlyLineChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
      <h4>월별 공부 시간 통계</h4>
      <Line
        data={{
          labels: dummyData.map((d) => d.date),
          datasets: [
            {
              label: '지난달',
              data: dummyData.map((d) => d.lastMonth),
              borderColor: '#b8b8ff',
              borderWidth: 2,
              pointRadius: 4,
              fill: false,
            },
            {
              label: '이번달',
              data: dummyData.map((d) => d.thisMonth),
              borderColor: '#1792FF',
              borderWidth: 2,
              pointRadius: 4,
              fill: false,
            },
          ],
        }}
        options={{
          plugins: {
            legend: { display: true, position: 'top' },
            tooltip: {
              callbacks: { label: (ctx) => `${ctx.parsed.y || 0}시간` },
            },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
}
