import { Fragment } from "react";
import { getUserProfile } from "../../lib/users";
import { companiesList } from "../../utils/companies_data";
import { useRouter } from "next/router";
import Head from "next/head";

export async function getServerSideProps(ctx) {
  const { hashId } = ctx.params;
  
  const { hashDecodeId } = require('../../../hashId');
  const originalId = hashDecodeId(hashId);
  
  const { user } = await getUserProfile(originalId);

  return { props: { profile: user } }
}
export default function Profile({ profile }) {
  

  const router = useRouter();
  const { hashId } = router.query;

  const businessNetworks = profile?.businessNetworks
    ? companiesList.filter(el => el.name === profile.businessNetworks.find(bns => bns === el.name))
    : [];
 
  if (!profile) return "Profile not found";
  
  if(!profile.privacy_settings?.show_profile) {
    return "The user has prohibited showing his profile";
  }
  return (
    <Fragment>
     
      <Head>
        <meta property="og:title" content={`${profile.first_name} ${profile.last_name} - Profile`} />
        {/* <meta property="og:description" content={profile.notice || 'No description available'} /> */}
        <meta property="og:image" content={profile.avatar || '/blank_profile.png'} />
        <meta property="og:url" content={`https://nodetest.crossmedia.fi/profile/${hashId}`} />
        <meta property="og:type" content="profile" />
        <title>{profile.first_name} {profile.last_name} - Profile</title>
      </Head>

      <div className="w-full h-full bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
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
                <p> <span className="text-indigo-500">{profile.title}</span> at <span className="text-indigo-500">{profile.company_name}</span></p>
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
            <h3 className="text-lg font-medium text-gray-900">Introduction</h3>
            <p className="mt-2 text-gray-700">{profile.notice}</p>
          </div>

          <div className="p-6 border-t border-gray-200 sm:flex sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h4 className="text-lg font-medium text-gray-900">Searching</h4>
              <p className="mt-2 text-gray-700">{profile.searching}</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Offering</h4>
              <p className="mt-2 text-gray-700">{profile.offering}</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}