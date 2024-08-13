// // pages/login.js
// import { useState } from 'react';
// import { supabase } from '../lib/supabase';
// import { useRouter } from 'next/router';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   const handleEmailLogin = async () => {
//     setLoading(true);
//     setError(null);
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     setLoading(false);
//     if (error) {
//       setError(error.message);
//     } else {
//       router.push('/');
//     }
//   };

//   const handleGoogleLogin = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         redirectTo: 'https://arzprbxlhvfnbwpztmpo.supabase.co/auth/v1/callback', // Замените на ваш URI
//       },
//     });
//     if (error) {
//       console.error('Error logging in with Google:', error.message);
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Login</h1>
//       <div style={{ marginBottom: '20px' }}>
//         <button onClick={handleGoogleLogin} disabled={loading}>
//           {loading ? 'Loading...' : 'Login with Google'}
//         </button>
//       </div>
//       <div>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           style={{ marginBottom: '10px', display: 'block' }}
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           style={{ marginBottom: '10px', display: 'block' }}
//         />
//         <button onClick={handleEmailLogin} disabled={loading}>
//           {loading ? 'Loading...' : 'Login with Email/Password'}
//         </button>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login


// pages/login.js
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) console.error('Ошибка входа:', error.message);
    else window.location.href = '/';
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://arzprbxlhvfnbwpztmpo.supabase.co/auth/v1/callback',
      },
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;

