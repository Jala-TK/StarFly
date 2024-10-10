'use client'
import React, { useState } from 'react';
import { signIn } from "next-auth/react"


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const credentialsAction = (formData: FormData) => {
    const formObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formObject[key] = value.toString();
    });
    signIn("credentials", formObject);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    credentialsAction(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
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
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
          <div className="divider">OR</div>
          <button className="btn btn-outline" onClick={() => signIn("github", { redirectTo: "/salas" })}>
            Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
