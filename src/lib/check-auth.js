import axios from "axios";
import { createClient } from "./supabase/server-props";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const checkAuth = async (ctx) => {
  const supabase = createClient(ctx);
  let { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Supabase ERROR", error);
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  let profile = null;

  try {
    const res = await axios.get(`https://nodetest.crossmedia.fi/api/profile-exists`, {
      params: {
        user_id: user.id,
      }
    });

    profile = res.data.profile ? res.data.profile[0] : null;

    if (!profile) {
      if (ctx.resolvedUrl === '/auth/profile') {
        return { props: { user } };
      }
      return {
        redirect: {
          destination: '/auth/profile',
          permanent: false,
        },
      };
    }

  } catch (error) {
    console.error('Error during API request:', error.message);
    return {
      redirect: {
        destination: '/error',
        permanent: false,
      },
    };
  }


  return {
    props: {
      user, 
      profile, 
      ...(await serverSideTranslations(ctx.locale, [
        'common',
      ]))
    }
  };
};
