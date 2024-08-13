import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext'; // Импортируйте контекст пользователя
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const user = useUser();
    const router = useRouter();

    // Выводим состояние `user` и отладочную информацию
    
    if (user === null) {
      console.log(user, "USER withAUTH");
      // Если пользователь не авторизован, перенаправляем на /login
      router.push('/login');
    }
    // Пока данные о пользователе загружаются
    if (user === undefined) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
