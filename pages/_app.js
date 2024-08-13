// pages/_app.js
import { useRouter } from 'next/router';
import Navbar from '../components/NavBar';
import { UserProvider } from '../context/UserContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  // Скрываем Navbar на страницах логина и регистрации
  const showNavbar = !['/login', '/register'].includes(pathname);

  return (
    <UserProvider>
      {showNavbar && <Navbar />}
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
