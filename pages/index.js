
// pages/index.js
import { useEffect, useState } from "react";
import { checkAuth } from '../lib/check-auth';
// export const getServerSideProps = async (ctx) => {
//   return await checkAuth(ctx);
// };

const Home = () => {
  // const user = useUser();
  
  // if (!user) {
  //   return <p>Loading...</p>;
  // }

  console.log("HOME")
  const [user, setUser] = useState(null);

  return (
    <div>
      <h1>Home Page</h1>
      <a href="/logout">Logout</a>
    </div>
  );
};

export default Home;
