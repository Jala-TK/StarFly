'use client'
import React, { useState } from 'react';
import { signIn } from "next-auth/react"


const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [message, setMessage] = useState('');
  const [erro, setErro] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== checkPassword) {
      setMessage('Passwords do not match');
      return;
    }
    fetch('/api/auth/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 201) {
          setMessage(data.message);
          setTimeout(() => {
            signIn('credentials', { redirectTo: "/rooms" });
          }, 5000);
        } else {
          setErro(true);
          setMessage(data.error)
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          {message && (
            <div role="alert" className={`alert ${erro ? 'alert-error' : 'alert-success'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{message}</span>
            </div>
          )}
          <h2 className="card-title justify-center">Cadastro</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nome</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Senha</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirmar senha</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Cadastrar</button>
            </div>
          </form>
          <div className="divider">OR</div>
          <button className="btn btn-outline" onClick={() => signIn("github", { redirectTo: "/rooms" })}>
            Cadastrar-se com GitHub
          </button>
          <div className="flex justify-center mt-4">
            <a href="/login" className="link link-primary">Já tem uma conta? Faça o login aqui</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
