// pages/profilePage/index.js
import Image from 'next/image';
import { useUser } from '../../context/UserContext';
import withAuth from '../../lib/withAuth';

const ProfilePage = () => {
  const user = useUser();
  console.log(user)
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>ProfilePage</h1>
      <img src={user.user_metadata.avatar_url} />
      {/* <Image src={user.user_metadata.avatar_url} width={200} height={200} /> */}
    </div>
  );
};

export default withAuth(ProfilePage);
