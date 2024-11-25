
// pages/index.js
import { useEffect, useState } from "react";
import { checkAuth } from '../lib/check-auth';
import { companiesList } from "../utils/companies_data";
import { createClient } from '../lib/supabase/component'
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { defaultToast } from "../lib/toastify";
import { useTranslation } from "next-i18next";
import { getWeekSearches } from "../lib/week-searches";
import WeekSearchItem from "../components/WeekSearchItem";
import ProfileWeekSearchItem from "../components/ProfileWeekSearchItem";

export const getServerSideProps = async (ctx) => {
  return await checkAuth(ctx);
};

export default function Index({ profile }) {
  const { t } = useTranslation("common")

  const [weekSearches, setWeekSearches] = useState([]);


  const businessNetworks = profile?.businessNetworks
    ? companiesList.filter(el => el.name === profile.businessNetworks.find(bns => bns === el.name))
    : [];

  useEffect(() => {
    const getSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession()
      console.log(data)
    }
    getSession()
  }, [])
  const router = useRouter();

  useEffect(() => {
    if (router.query.alreadyIn) {
      defaultToast("You are already in this group!");
      console.log('User was redirected back to this page');
    }
  }, [router.query]);

  const fetchWeekSearches = async () => {
    const res = await getWeekSearches(5);
    setWeekSearches([...res.result])
  }

  useEffect(() => {
    fetchWeekSearches();
  }, [])

  return (
    // <div className="w-full h-full grid grid-cols-[1fr_35%] gap-4">
    <div className="w-full h-full flex items-start flex-wrap">
      <div className="w-[60%] max-thousand:w-full max-h-screen bg-white shadow-md rounded-lg overflow-hidden">
        <div className="h-60 overflow-hidden">
          <img src={"/bg_image.jpg"} className="object-cover" />
        </div>
        <div className="p-6 sm:flex sm:justify-between sm:items-center">
          <div className="flex items-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img src={profile.avatar ? profile.avatar : "/blank_profile.png"} className='object-cover' />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h2>

              <p className="text-gray-400 font-semibold">{profile.title}</p>

              <p className="text-indigo-500 font-semibold">{profile.company.company_name}</p>
              {profile?.company?.company_logo && <img className="w-[100px] h-[50px] object-contain" src={profile.company.company_logo} />}



              <p className=" text-gray-600">{profile.address1}</p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0">
            {profile.privacy_settings?.email && (
              <a href={`mailto:${profile?.email_address}`} className="block text-blue-500 hover:underline">
                {profile.email_address}
              </a>
            )}
            {profile.privacy_settings?.phone && (
              <p className="text-gray-600">{profile?.phone}</p>
            )}

            <a href={profile?.website} className="text-blue-500 hover:underline">
              {profile?.website}
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-5 mb-5">
          {
            businessNetworks.length !== 0 &&
            businessNetworks.map((el, i) => <img key={i} className='w-[45px] h-[45px]' src={el.image} alt="network_logo" title={el.name} />)
          }
        </div>
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{t("introduction")}</h3>
          <p className="mt-2 text-gray-700">{profile.notice}</p>
        </div>

        <div className="p-6 border-t border-gray-200 sm:flex sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h4 className="text-lg font-medium text-gray-900">{t("searching")}</h4>
            <p className="mt-2 text-gray-700">{profile.searching}</p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">{t("offering")}</h4>
            <p className="mt-2 text-gray-700">{profile.offering}</p>
          </div>
        </div>
      </div>
      <div className="w-[40%] px-3 max-thousand:w-full max-thousand:px-0">
        {weekSearches.length !== 0 
          ? weekSearches.map(weekSearch => <ProfileWeekSearchItem key={weekSearch.id} profileId={profile.id} avatar={profile.avatar} weekSearch={weekSearch} />)
          : "No week searches"
        }
      </div>
      <ToastContainer />
    </div>
  );
};

