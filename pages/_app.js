// pages/_app.js
import '../styles/globals.css'
import { useRouter } from 'next/router';
import Navbar from '../components/NavBar';


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  // Скрываем Navbar на страницах логина и регистрации
  const showNavbar = !['/login', '/register', '/reset-password', '/update-password'].includes(pathname);

  return (
      <div>
         {showNavbar && <Navbar />}
         <Component {...pageProps} />
      </div>
  );
}

export default MyApp;
