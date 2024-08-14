// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '../lib/supabase/component';

const Register = () => {
  const [email, setEmail] = useState('sem.m1415@mail.ru');
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://arzprbxlhvfnbwpztmpo.supabase.co/auth/v1/callback',
      },
    });
    if (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error('Error sing up:', error.message);
    } else {
      router.push('/login?registered=true');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
    <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900">Create a new account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500"> Sign in here</a>
        </p>
      </div>
      
      <form className="space-y-6" action="#" method="POST">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email address"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {/* <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            placeholder="Confirm Password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div> */}

        <div>
          <button
            type="button"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => handleRegister()}
          >
            Sign up
          </button>
        </div>

        <div>
          <button
            type="button"
            className="w-full border border-gray-300 bg-white text-gray-900 py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center"
            onClick={() => handleGoogleLogin()}
          >
            <svg className="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.6c-3.7 0-6.8 2.9-6.8 6.8 0 1.1.3 2.2.7 3.1l-4.7 4.7c-1.1-2.2-1.7-4.6-1.7-7.5C1.3 5.3 5.8 1 11.7 1c2.7 0 5.2.9 7.2 2.4l-3.7 3.7c-1.6-1.6-3.7-2.5-6.2-2.5zM12 7c1.5 0 2.9.5 4 1.4l-4.5 4.5c-.3-.1-.7-.2-1.1-.2-1.7 0-3.2.7-4.4 1.8L3.4 10.7c1.5-1.5 3.6-2.5 5.9-2.5zm1.5 6.7c.3-.4.7-.8 1.2-1.1l4.4-4.4c.2.5.4 1.1.4 1.7 0 3.2-2.6 5.9-5.8 5.9-1.8 0-3.5-.8-4.8-2.1l-4.5 4.5c2.1 2.1 4.9 3.5 8.1 3.5 4.4 0 8.2-2.5 10.2-6.2l-4.5-4.5c-.8 1.4-2.2 2.4-3.8 2.4-1.6 0-3.1-.7-4.2-1.8z" />
            </svg>
            Sign up with Google
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default Register;
