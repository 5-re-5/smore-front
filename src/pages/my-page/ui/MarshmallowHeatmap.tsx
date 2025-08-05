const dummyData = [
  { date: '2025-08-01', level: 3 },
  { date: '2025-08-02', level: 1 },
  { date: '2025-08-03', level: 5 },
  { date: '2025-08-04', level: 2 },
  { date: '2025-08-05', level: 4 },
  { date: '2025-08-06', level: 1 },
  { date: '2025-08-07', level: 2 },
];

export default function MarshmallowHeatmap() {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {dummyData.map((d) => (
        <div
          key={d.date}
          title={`${d.date} 공부 레벨: ${d.level}`}
          style={{
            width: 20,
            height: 20,
            backgroundColor: `rgba(255, 123, 148, ${d.level / 5})`,
            borderRadius: 4,
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  );
}
