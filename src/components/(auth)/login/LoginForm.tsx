'use client'
import React, { useState } from 'react';
import { signIn } from "next-auth/react"


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const credentialsAction = async (formData: FormData) => {
    const formObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formObject[key] = value.toString();
    });

    try {
      const result = await signIn("credentials", {
        ...formObject,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    await credentialsAction(formData);
    setLoading(false);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label" htmlFor="credentials-email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                id="credentials-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="credentials-password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                id="credentials-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <div className="divider">OR</div>
          <button className="btn btn-outline" onClick={() => signIn("github", { redirectTo: "/" })}>
            Login with GitHub
          </button>
          <div className="flex justify-center mt-4">
            <a href="/registro" className="link link-primary">Não tem uma conta? Faça o registro aqui</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
