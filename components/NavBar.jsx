// components/Navbar.js
import Link from 'next/link';

const Navbar = () => {
  let user = true;
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {user &&
          <>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/logout">Logout</Link>
            </li>
          </>
        }
      </ul>
    </nav>
  );
};

export default Navbar;
