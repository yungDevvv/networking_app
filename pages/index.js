// pages/index.js
import { useUser } from '../context/UserContext';
import withAuth from '../lib/withAuth';

const Home = () => {
  const user = useUser();
  
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome, {user.email}!</p>
      <a href="/logout">Logout</a>
    </div>
  );
};

export default withAuth(Home);
