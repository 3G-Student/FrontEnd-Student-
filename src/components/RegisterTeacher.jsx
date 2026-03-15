import { useState } from 'react';

export default function RegisterTeacher({ onRegister, showNotification }) {

const [name, setName] = useState('Vanessa Lima de Santana'); 
const [email, setEmail] = useState('vanessa.santana@gmail.com');

  const handleSubmit = () => {

    if (!name || !email) {
      showNotification("Preencha todos os campos.", "error");
      return;
    }

    const newTeacher = {
      id: Date.now().toString(),
      name,
      email,
      avatar: "https://cdn.codia.ai/figma/6DAspzy5AqWCvWiZgFCcbv/img-5df6a5cd6ba7f533.svg"
    };

    onRegister(newTeacher);

    showNotification("Professor cadastrado com sucesso!", "success");

    setName('');
    setEmail('');
  };

  return (
    <div className="register-card">
      <h2 className="register-title">Cadastrar professor</h2>

      <div className="register-form">
        <div className="form-field">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="register-btn" onClick={handleSubmit}>
          Cadastrar
        </button>
      </div>
    </div>
  );
}