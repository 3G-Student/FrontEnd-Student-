export default function TeacherProfile({ teacher, onDelete }) {

  if (!teacher) {
    return (
      <div className="teacher-profile">
        <p>Selecione um professor</p>
      </div>
    );
  }

  return (
    <div className="teacher-profile">
      <img
        src={teacher.avatar}
        alt={teacher.name}
        className="profile-avatar"
      />
      <div className="profile-info">
        <h2 className="profile-name">{teacher.name}</h2>
        <p className="profile-email">{teacher.email}</p>

        <button 
          className="remove-btn"
          onClick={() => onDelete(teacher.id)}
        >
          Remover funcionário
        </button>
      </div>
    </div>
  );
}
