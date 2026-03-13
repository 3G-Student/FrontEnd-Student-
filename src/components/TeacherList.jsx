import { useState } from 'react';

export default function TeacherList({ teachers, onSelect }) {

  const [query, setQuery] = useState('');

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.id.includes(query)
  );

  return (
    <div className="teacher-list-panel">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Digite o id do professor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.map((teacher) => (
        <div 
          key={teacher.id}
          className="teacher-card"
          onClick={() => onSelect(teacher)}
        >
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="teacher-avatar"
          />
          <span className="teacher-card-name">{teacher.name}</span>
          <div className="teacher-card-id-group">
            <span className="teacher-card-id-label">ID</span>
            <span className="teacher-card-id-value">{teacher.id}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
