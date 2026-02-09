import { useState } from "react";
import "./cadastro.css";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
    const navigate = useNavigate();

    return (
        <div className="cadastro-page">
        <div className="cadastro-card">

            <div className="cadastro-left">
            <h1 className="logo">STUDENT<span>+</span></h1>
            <p>
                Seja bem-vindo ao Student+! Crie <br />
                sua conta para começar a usar.
            </p>
            </div>

            <div className="cadastro-right">
            <input type="text" placeholder="Nome" />
            <input type="text" placeholder="Matrícula" />
            <input type="email" placeholder="E-mail" />
            <input type="password" placeholder="Senha" />

            <button className="btn-cadastrar" onClick={() => navigate("/professores")}>
                Cadastrar
            </button>

            <small>
                Já tem uma conta? <a onClick={() => navigate("/login")}>Clique aqui para fazer login</a>
            </small>
            </div>

        </div>
        </div>
    );
}