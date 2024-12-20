// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '../../lib/supabase/component';

const Register = () => {
  const [email, setEmail] = useState('sem.m1415@mail.ru');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://nodetest.crossmedia.fi/api/auth/callback',
      },
    });

    if (error) {
      setErrorMessage(error.message)
      console.error('Error logging in with Google:', error.message);
    }
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password, options: {
      data: {
        firstName: firstName,
        lastName: lastName
      }
    } })
    if (error) {
      setErrorMessage(error.message)
      console.error('Error sing up:', error.message);
    } else {
      router.push('/auth/login?registered=true');
    }
  }

  return (
 
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">Create a new account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?
            <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500"> Sign in here</a>
          </p>
        </div>

        <div className="space-y-4">
          {
            errorMessage && (
              <p className="mt-[-20px] text-center text-sm text-red-600">
                Error: {errorMessage}
              </p>
            )
          }

          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Firstname</label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              required
              placeholder="Firstname"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Lastname</label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              required
              placeholder="Lastname"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

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
              <svg data-id="24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" x2="12" y1="8" y2="8"></line><line x1="3.95" x2="8.54" y1="6.06" y2="14"></line><line x1="10.88" x2="15.46" y1="21.94" y2="14"></line></svg>

              Sign up with Google
            </button>
          </div>
        </div>
      </div>
 
  );
};

export default Register;
