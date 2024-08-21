// lib/checkAuth.js

import { createClient } from "./supabase/server-props";


export const checkAuth = async (ctx) => {
  const supabase = createClient(ctx);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: { user } };
};
