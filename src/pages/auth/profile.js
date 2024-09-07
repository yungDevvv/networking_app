import { useRef, useState } from 'react';
import axios from 'axios';
import { checkAuth } from '../../lib/check-auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { Button } from '@nextui-org/button';
import { useTranslation } from 'next-i18next';
import { companiesList } from '../../utils/companies_data';
import { Settings, X } from 'lucide-react';
import ProfileSettingsModal from '../../components/modals/profile-settings-modal';


export const getServerSideProps = async (ctx) => {
  return await checkAuth(ctx);
};

export default function ProfilePage({ user, profile }) {
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || user?.user_metadata.firstName || '',
    lastName: profile?.last_name || user?.user_metadata.lastName || '',
    emailAddress: user.email,
    company: profile?.company || '',
    title: profile?.title || '',
    phone: profile?.phone || '',
    address1: profile?.address1 || '',
    website: profile?.website || '',
    businessNetworks: profile?.businessNetworks || [],
    searching: profile?.searching || '',
    offering: profile?.offering || '',
    notice: profile?.notice || '',
    avatar: profile?.avatar || user?.user_metadata.avatar_url || ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selCompaniesOpen, setSelCompaniesOpen] = useState(false);
  console.log(profile)
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          [name]: reader.result
        }));
      };

      reader.readAsDataURL(file);
    } else if (name === 'businessNetworks') {
      const updatedCompanies = formData.businessNetworks.includes(value)
        ? formData.businessNetworks.filter((company) => company !== value)
        : [...formData.businessNetworks, value];

      setFormData((prevData) => ({
        ...prevData,
        businessNetworks: updatedCompanies,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const removeAvatar = () => {
    if (fileInputRef.current) {
      setFormData(prevData => ({
        ...prevData,
        avatar: ''
      }))

      fileInputRef.current.value = '';
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/update-profile', {
        ...formData,
        user_id: user.id,
      });
      if (response.status === 200) {
        router.push('/');
      }
    } catch (err) {
      console.error(err.message);
      alert('An error occurred while saving your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">{t("complete_profile")}</h2>
      <div className='w-full flex justify-center mb-6'>
        <Link href={"/profile/" + profile.id} className='text-center underline text-indigo-500'>Visit your public profile</Link>
        <button onClick={() => setModalOpen(open => !open)} className='ml-2 hover:text-indigo-500 transition-all duration-150' title='Customize profile view'>
          <Settings />
        </button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">{t("first_name")} <span className='text-red-600'>*</span></label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">{t("last_name")} <span className='text-red-600'>*</span></label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">{t("email")} <span className='text-red-600'>*</span></label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              disabled
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">{t("company")} <span className='text-red-600'>*</span></label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t("job_title")} <span className='text-red-600'>*</span></label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t("phone_number")} <span className='text-red-600'>*</span></label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="address1" className="block text-sm font-medium text-gray-700">{t("location")} </label>
            <input
              id="address1"
              name="address1"
              type="text"
              value={formData.address1}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">{t("website")}</label>
            <input
              id="website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">{t("avatar")}</label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-[5px] border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formData.avatar
              ? (
                <div className='relative w-32 h-32'>
                  <img className='w-32 h-32 rounded object-cover mt-4' src={formData.avatar} alt="avatar" />
                  <span onClick={() => removeAvatar()} className='bg-red-600 hover:bg-red-700 rounded-full inline-block p-1 cursor-pointer absolute right-[-5px] top-[-5px]'>
                    <X color="#fff" size={14} />
                  </span>
                </div>
              ) : ''
            }
          </div>

          <div className="relative select-none">
            <label htmlFor="" className="block text-sm font-medium text-gray-700">{t("business_networks")}</label>
            <div className="mt-1 block cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm" onClick={() => setSelCompaniesOpen(open => !open)}>
              <span className="block truncate">
                {
                  formData.businessNetworks.length === 0
                    ? 'Select networks'
                    : formData.businessNetworks.join(', ')
                }
              </span>
            </div>

            {selCompaniesOpen &&
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {companiesList.map((company) => (
                  <label key={company.name} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      value={company.name}
                      name="businessNetworks"
                      checked={formData.businessNetworks.includes(company.name)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {company.name}
                    <img className='w-[20px] h-[20px] ml-auto' src={company.image} />
                  </label>
                ))}
              </div>
            }
          </div>

          <div className="col-span-2">
            <label htmlFor="searching" className="block text-sm font-medium text-gray-700">{t("searching")}</label>
            <textarea
              id="searching"
              name="searching"
              rows="5"
              value={formData.searching}
              onChange={handleChange}
              placeholder="Kirjoita tähän mitä etsitte ..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="offering" className="block text-sm font-medium text-gray-700">{t("offering")}</label>
            <textarea
              id="offering"
              name="offering"
              rows="5"
              value={formData.offering}
              onChange={handleChange}
              placeholder="Kirjoita tähän mitä tarjoatte ..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="notice" className="block text-sm font-medium text-gray-700">{t("write_short_introduction")}</label>
            <textarea
              id="notice"
              name="notice"
              rows="5"
              value={formData.notice}
              onChange={handleChange}
              placeholder="Kirjoita tähän esittelysi ..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          {profile &&
            <Link href="/" className=" text-black py-2 px-4 underline">{t("back")}</Link>
          }
          {/* <Button
              onClick={handleSubmit}
              radius="sm"
              className=' bg-indigo-600 hover:bg-indigo-700'
              color="primary"
              spinner={
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              }
              isLoading={isLoading}
            >
              {t("save")}
            </Button> */}
          <button type="button" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={handleSubmit}>{t("save")}</button>
        </div>
      </div>
      {modalOpen && <ProfileSettingsModal setModalOpen={setModalOpen} profileId={profile.id} privacy_settings={profile.privacy_settings} />}
    </div>

  );
}
