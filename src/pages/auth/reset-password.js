import { useState } from 'react';
import { createClient } from '../../lib/supabase/component';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const supabase = createClient();

  const handleResetPassword = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://nodetest.crossmedia.fi/auth/update-password',
    })
    if (error) {
      console.error('Error resetting password:', error.message);
      setErrorMessage(error.message)
    } else {
      setSuccessMessage('Password reset email sent successfully!')
    }
  }

  return (
  
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot password?</h2>
        <div className="space-y-4">
          {
            errorMessage && (
              <p className="mt-[-20px] text-center text-sm text-red-600">
                Error: {errorMessage}
              </p>
            )
          }
          {
            successMessage && (
              <p className="mt-[-20px] text-center text-sm text-green-500">
                {successMessage}
              </p>
            )
          }
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email address"
              required
            />
          </div>
          <button
            type="button"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            onClick={() => handleResetPassword()}
          >
            Send reset link
          </button>
        </div>
        <div className="text-center mt-6">
          <a href="/auth/login" className="text-indigo-600 hover:text-indigo-700">Back to login</a>
        </div>
      </div>
   
  );
}
