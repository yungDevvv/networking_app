
// pages/index.js
import { useEffect, useState } from "react";
import { checkAuth } from '../lib/check-auth';

export const getServerSideProps = async (ctx) => {
  return await checkAuth(ctx);
};

const Home = ({user}) => {
  
  return (
    <div>
      {user &&
        <h3>{user.email}</h3>
      }
      <a href="/logout">Logout</a>
    </div>
  );
};

export default Home;
