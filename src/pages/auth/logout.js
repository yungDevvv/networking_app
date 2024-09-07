// pages/auth/logout.js
import { useEffect } from 'react';
import { createClient } from '../../lib/supabase/component';

const Logout = () => {
  useEffect(() => {
    const supabase = createClient();
    const handleLogout = async () => {
      await supabase.auth.signOut();
      window.location.href = '/auth/login';
    };

    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
