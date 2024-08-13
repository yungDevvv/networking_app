// components/Navbar.js
import Link from 'next/link';
import { useUser } from '../context/UserContext'; // Используем контекст для доступа к пользователю

const Navbar = () => {
  const user = useUser();

  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link href="/profilePage">Profile</Link>
            </li>
            <li>
              <Link href="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
