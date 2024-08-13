// pages/reset-password.js
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error('Error resetting password:', error.message);
      setError(error.message);
    } else {
      setMessage('Check your email for the password reset link.');
      // setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleResetPassword}>Send Password Reset Email</button>
    </div>
  );
};

export default ResetPassword;
