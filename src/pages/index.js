
// pages/index.js
import { useEffect, useState } from "react";
import { checkAuth } from '../lib/check-auth';
// import { Button } from 'shadcn-ui';
export const getServerSideProps = async (ctx) => {
  return await checkAuth(ctx);
};

const Home = ({user}) => {
  return (
    <div>
      {/* <Button>ADASDASD</Button> */}
      {user &&
        <h3>{user.email}</h3>
      }
    </div>
  );
};

export default Home;
