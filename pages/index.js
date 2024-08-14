
// pages/index.js
import { useEffect, useState } from "react";
import { checkAuth } from '../lib/check-auth';
import { createClient } from "../lib/supabase/component";
export const getServerSideProps = async (ctx) => {
  return await checkAuth(ctx);
};

const Home = ({user}) => {
  // const user = useUser();
  // const [user, setUser] = useState(null);
  // if (!user) {
  //   return <p>Loading...</p>;
  // }

  // useEffect(() => {
  //   async function getUser() {
  //     const supabase = createClient();
  //     const { data: { user }, error } = await supabase.auth.getUser();
  //     setUser(user) 
  //   }
  //   getUser();
  //   console.log(user)
  // }, [])
  return (
    <div>
      <h1>Home Page</h1>
      {user &&
        <h3>{user.email}</h3>
      }
      <a href="/logout">Logout</a>
    </div>
  );
};

export default Home;
