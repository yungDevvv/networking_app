import { useState } from 'react';
import { createClient } from '../lib/supabase/component';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setcConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const supabase = createClient();

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords are not same!")
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: password })
    if (error) {
      console.error('Error resetting password:', error.message);
      setErrorMessage(error.message)
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Update Your Password</h2>
        <div className="space-y-4">
          {
            errorMessage && (
              <p className="mt-[-20px] text-center text-sm text-red-600">
                Error: {errorMessage}
              </p>
            )
          }
          <div className="form-group">
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              id="new-password"
              name="new-password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your new password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm your new password"
              required
              onChange={(e) => setcConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            onClick={() => handleUpdatePassword()}
          >
            Update Password
          </button>
        </div>
        <div className="text-center mt-6">
          <a href="/login" className="text-indigo-600 hover:text-indigo-700">Return to Login</a>
        </div>
      </div>
    </div>

  );
}
