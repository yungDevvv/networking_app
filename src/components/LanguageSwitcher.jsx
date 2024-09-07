import { useRouter } from 'next/router';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale, pathname, asPath } = router;

  const changeLanguage = (lang) => {
    if (locale !== lang) {
      router.push(pathname, asPath, { locale: lang });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('fi')}
        className={`w-[35px] py-1 rounded-lg transition-all duration-300 focus:outline-none
          ${locale === 'fi' 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
          }`}
      >
        FI
      </button>

      <button
        onClick={() => changeLanguage('en')}
        className={`w-[35px] py-1 rounded-lg transition-all duration-300 focus:outline-none
          ${locale === 'en' 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
          }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
