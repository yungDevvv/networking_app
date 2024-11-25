import { useRef, useState } from 'react';
import axios from 'axios';
import { checkAuth } from '../../lib/check-auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { Button } from '@nextui-org/button';
import { useTranslation } from 'next-i18next';
import { companiesList } from '../../utils/companies_data';
import { Plus, Settings, X } from 'lucide-react';
import ProfileSettingsModal from '../../components/modals/profile-settings-modal';
import { hashEncodeId } from '../../../hashId';
import SearchCompanyModal from '../../components/modals/search-company-modal';
import { getCompanies, getUserCompany } from '../../lib/companies';
import CreateCompanyModal from '../../components/modals/create-company-modal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { ToastContainer } from 'react-toastify';
import { error, success } from '../../lib/toastify';

export const getServerSideProps = async (ctx) => {
  const { props } = await checkAuth(ctx);
  const companies = await getCompanies();

  if (!props.profile) {
    const default_company = await getUserCompany(8);

    return {
      props: {
        user: { ...props.user },
        default_company: default_company.userCompany,
        companies: [...companies.companies],
        ...(await serverSideTranslations(ctx.locale, [
          'common',
        ]))
      }
    }
  }

  const userCompany = await getUserCompany(props.profile.id);
  
  return { props: { ...props, ...companies, ...userCompany } }
};

export default function ProfilePage({ user, profile, companies, userCompany = null, default_company = null }) {

  const fileInputRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation('common');
  const [searchValue, setSearchValue] = useState("")
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  const [formData, setFormData] = useState({
    firstName: profile?.first_name || user?.user_metadata.firstName || '',
    lastName: profile?.last_name || user?.user_metadata.lastName || '',
    emailAddress: user.email,
    company_name: profile?.company?.company_name || '',
    company: profile?.company?.id || null,
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
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selCompaniesOpen, setSelCompaniesOpen] = useState(false);
  const [createCompanyModalOpen, setCreateCompanyModalOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [checkError, setCheckError] = useState();
  const [companyError, setCompanyError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
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
      const updatedBusinessNetworks = formData.businessNetworks.includes(value)
        ? formData.businessNetworks.filter((company) => company !== value)
        : [...formData.businessNetworks, value];

      setFormData((prevData) => ({
        ...prevData,
        businessNetworks: updatedBusinessNetworks,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company) {
      setCompanyError("This field is required");
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.title || !formData.phone) {
      setCheckError(true)
      return;
    }
    try {
      const response = await axios.post('/api/update-profile', {
        ...formData,
        user_id: user.id,
      });
      if (!profile) {
        router.push('/');
      } else {
        success(t("profile_updated"));
      }
    } catch (err) {
      console.error(err.message);
      error(t("profile_update_error"));
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchValue(term);

    if (term) {
      const filtered = companies.filter((company) =>
        company.company_name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies([]);
    }
  }

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md relative">
      {profile && (
        <button onClick={() => setModalOpen(open => !open)} className='absolute right-8 top-8 hover:text-indigo-500 transition-all duration-150' title='Customize profile view'>
          <Settings size={26} />
        </button>
      )}
      <ToastContainer />
      {!profile && (
        <div className='flex justify-end'>
          <LanguageSwitcher />
        </div>
      )}
      <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">{!profile ? t("complete_profile") : t("edit_profile")}</h2>

      {checkError && <p className='text-red-500'>{t("check_req_fields")}</p>}

      {profile && (
        <div className='w-full flex justify-center mb-6'>
          <Link href={"/profile/" + hashEncodeId(profile.id)} className='text-center underline text-indigo-500'>{t("visit_public_profile")}</Link>
        </div>
      )}

      <form className="space-y-6">
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
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">{t("company")} <span className='text-red-600'>*</span>{companyError && <span className='text-sm text-red-500'> {companyError}</span>}</label>
            <div className='relative'>
              <div onClick={() => setContentOpen(open => !open)} className="select-none mt-1 block cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm">
                <span className="block truncate">
                  {formData.company_name ? formData.company_name : 'Search company'}
                </span>
              </div>
              {contentOpen && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
                  <div className='relative flex items-center'>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder={t("search_company_name")}
                      autoComplete="off"
                      value={searchValue}
                      onChange={handleSearchChange}
                      className="mt-1 block w-full px-3 py-2 border-b bg-transparent text-sm border-gray-300 focus:outline-none"
                    />
                    {userCompany !== null
                      ? (
                        <button title="Edit company" onClick={() => setCreateCompanyModalOpen(open => !open)} type="button" className='absolute right-2 rounded-md hover:bg-gray-100 p-1'>
                          <Settings size={20} className='text-indigo-400' />
                        </button>
                      )
                      : (
                        <>
                          {default_company === null && <button onClick={() => setCreateCompanyModalOpen(open => !open)} type="button" className='absolute right-2 rounded-md hover:bg-gray-100 p-1'>
                            <Plus size={20} className='text-indigo-400' />
                          </button>}
                        </>
                      )}
                  </div>
                  <div className='overflow-hidden'>
                    {filteredCompanies.length !== 0
                      ? filteredCompanies.map(company => (
                        <button onClick={() => {
                          setFormData(prev => ({ ...prev, company: company.id, company_name: company.company_name }))
                          setContentOpen(false);
                          setSearchValue("");
                          setFilteredCompanies([]);
                        }}
                          key={company.id}
                          type="button"
                          className='text-sm text-left py-2 px-3 block hover:bg-gray-100 w-full'
                        >{company.company_name}</button>
                      ))
                      : <>
                        {default_company !== null && <button onClick={() => {
                          setFormData(prev => ({ ...prev, company: default_company.id, company_name: default_company.company_name }))
                          setContentOpen(false);
                          setSearchValue("");
                          setFilteredCompanies([]);
                        }}
                          key={default_company.id}
                          type="button"
                          className='text-sm py-2 px-3 block hover:bg-gray-100 w-full text-center'
                        >{default_company.company_name}
                          <span className='block text-center text-indigo-500'>{t("asd1")}</span>
                          <span className='block text-center text-red-500'>{t("asd2")}</span>
                        </button>}
                        <p className='select-none text-sm text-left py-2 px-3 block w-full'>{t("no_company_found")}</p>
                      </>
                    }
                  </div>
                </div>
              )}
            </div>
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
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-hidden">
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
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={handleSubmit}>{t("save")}</button>
        </div>
      </form>
      {searchModalOpen && <SearchCompanyModal setSearchModalOpen={setSearchModalOpen} />}
      {modalOpen && <ProfileSettingsModal setModalOpen={setModalOpen} profileId={profile.id} privacy_settings={profile.privacy_settings} />}
      {createCompanyModalOpen && <CreateCompanyModal profileId={profile?.id ? profile.id : user.id} setCreateCompanyModalOpen={setCreateCompanyModalOpen} userCompany={userCompany} />}
    </div>

  );
}
