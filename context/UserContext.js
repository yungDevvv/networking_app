import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Обратите внимание на правильный путь к вашему файлу

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Начальное состояние - null (пользователь не определен)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем текущую сессию
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    fetchSession();

    // Обработка изменений состояния аутентификации
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={user}>
      {loading ? <p>Loading...</p> : children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
