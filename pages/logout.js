// pages/logout.js
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Logout = () => {
  useEffect(() => {
    const handleLogout = async () => {
      await supabase.auth.signOut();
      window.location.href = '/login';
    };

    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
