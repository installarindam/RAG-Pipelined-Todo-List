import { useState } from 'react';
import axios from 'axios';

const CreateAccountForm = ({ onCreateAccount }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Reset error state
    setError('');
    try {
      // Make POST request to create account
      const response = await axios.post('/api/create-account', { email, password });
      console.log(response.data);
      // Check if request was successful
      if (response.status === 200 && response.data.message === 'Account created successfully') {
        // Call onCreateAccount function with email and password
        setError('');
        //onCreateAccount(email, password);
        window.alert('Account created successfully');
        // Clear form fields
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        window.location.href = '/'; 
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err) {
      console.error('Error creating account:', err);
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <div className="input-group">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Create Account</button>

      <style jsx>{`
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
        .error-message {
          color: red;
          margin-top: 5px;
        }
      `}</style>
    </form>
  );
};

export default CreateAccountForm;
