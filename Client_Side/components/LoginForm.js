// components/LoginForm.js
import { useState } from 'react';
import axios from 'axios';
import CreateAccountForm from './CreateAccountForm';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Validate email and password on the server
    try {
      const response = await axios.post('/api/login-validation', { email, password });
      if (response.status === 200 && response.data.valid) {
        // Call onLogin function with email and password
        // After successful login
        localStorage.setItem('userEmail', email);

        onLogin(email, password);
      } 
    } catch (err) {
      console.error('Error during login validation:', err);
      if (err.response && err.response.status === 404) {
        setError('User not found.');
      } else if (err.response && err.response.status === 401) {
        setError('Wrong password.');
      } else {
        setError('Failed to validate login. Please try again.');
      }
    }
  };

  const handleToggleCreateAccount = () => {
    setShowCreateAccount(!showCreateAccount);
  };

  return (
    <div className="login-form-container">
      {!showCreateAccount ? (
        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <p className="create-account-link">Don't have an account? <button onClick={handleToggleCreateAccount}>Create one</button></p>
          {error && <p className="error-message">{error}</p>}
        </form>
      ) : (
        <div className="create-account-container">
          <h2>Create Account</h2>
          <CreateAccountForm />
          <p className="back-to-login-link">Already have an account? <button onClick={handleToggleCreateAccount}>Back to login</button></p>
        </div>
      )}
      <style jsx>{`
        .login-form-container {
          max-width: 400px;
          margin: auto;
          padding: 20px;
          background-color: #000;
          border-radius: 10px;
          color: #fff;
        }
        .create-account-container {
          padding-top: 20px;
        }
        .input-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #00ff00;
        }
        input {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 5px;
          background-color: #222;
          color: #fff;
          font-size: 1rem;
        }
        button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 5px;
          background-color: #00ff00;
          color: #000;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #009900;
        }
        .create-account-link, .back-to-login-link {
          margin-top: 10px;
          text-align: center;
        }
        .error-message {
          color: red;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
