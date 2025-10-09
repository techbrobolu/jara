import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded w-full p-2"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded w-full p-2"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Log in
        </button>

        {/* Divider + signup link below the inputs */}
        <div className="my-4 text-center">
          <div className="flex items-center">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-sm text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <Link to="/register" className="inline-block mt-3 text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;