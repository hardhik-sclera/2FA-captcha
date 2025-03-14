import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [error, setError] = useState(null);

  // Function to handle login through OAuth providers (Google, GitHub)
  const handleLogin = (provider) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtext">Sign in with your favorite provider</p>

        <div className="login-buttons">
          <button className="login-btn google" onClick={() => handleLogin('google')}>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.8-.2-2.6H12v5.1h6.6c-.3 1.6-1.2 2.9-2.5 3.8v3h4.1c2.4-2.2 3.8-5.5 3.8-9.3z"/>
              <path fill="#34A853" d="M12 24c3.4 0 6.2-1.1 8.3-3.1l-4.1-3c-1.1.7-2.5 1.1-4.1 1.1-3.2 0-5.9-2.1-6.8-5H1v3.1C3.2 21.2 7.3 24 12 24z"/>
              <path fill="#FBBC05" d="M5.2 14.5c-.3-.8-.5-1.6-.5-2.5s.2-1.7.5-2.5V6.4H1C.4 7.8 0 9.3 0 11s.4 3.2 1 4.6l4.2-3.1z"/>
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.5.6 4.9 1.8l3.6-3.6C17.9 1.1 15.1 0 12 0 7.3 0 3.2 2.7 1 6.4l4.2 3.1c1-2.9 3.6-4.7 6.8-4.7z"/>
            </svg>
            Login with Google
          </button>

          <button className="login-btn github" onClick={() => handleLogin('github')}>
            <svg className="icon" viewBox="0 0 24 24" fill="white">
              <path d="M12 .3C5.4.3 0 5.7 0 12.3c0 5.3 3.4 9.8 8.1 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-.8-4-1.6 0-.4-.2-1-.6-1.2-.5-.3-1.1-.8 0-.8.9 0 1.5.9 1.7 1.3 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.4-2.3 1.1-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.2 1.9-.4 2.8-.4.9 0 1.9.1 2.8.4 2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3.1 0 4.6-2.7 5.6-5.3 5.9.4.3.7 1 .7 2v3c0 .3.2.7.8.6 4.7-1.6 8.1-6.1 8.1-11.4C24 5.7 18.6.3 12 .3z"/>
            </svg>
            Login with GitHub
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
