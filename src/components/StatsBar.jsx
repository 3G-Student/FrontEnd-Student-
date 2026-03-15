const stats = [
  { value: '72', label: 'Alunos ativos' },
  { value: '15', label: 'Professores ativos' },
  { value: '24', label: 'Alunos em recuperação' },
];

export default function StatsBar() {
  return (
    <div className="stats-bar">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-item">
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
