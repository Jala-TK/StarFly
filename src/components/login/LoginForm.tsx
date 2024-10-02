'use client'
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleGitHubLogin = () => {
    signIn('github',
      { callbackUrl: '/chat' }
    );
    console.log('Logging in with GitHub');
  };

  /*   const handleGoogleLogin = () => {
      signIn('google',
        { callbackUrl: '/chat' }
      );
      console.log('Logging in with Google');
    }; */

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <form onSubmit={handleSubmit}>
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
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
          <div className="divider">OR</div>
          <button className="btn btn-outline" onClick={handleGitHubLogin}>
            Login with GitHub
          </button>
          {/*           <button className="btn btn-outline" onClick={handleGoogleLogin}>
            Login with Google
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
