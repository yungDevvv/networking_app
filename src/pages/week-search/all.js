import { checkAuth } from "../../lib/check-auth"
import { getWeekSearches } from "../../lib/week-searches";
import WeekSearchItem from "../../components/WeekSearchItem";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { useTranslation } from "next-i18next";

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const week_search = await getWeekSearches();
   return { props: { ...props, week_search: week_search.result } }
}

export default function All({ profile, week_search }) {
   const [weekSearches, setWeekSearches] = useState([...week_search] || []);
   const [searchTerm, setSearchTerm] = useState('');
   const { t } = useTranslation("common")

   const handleChange = (e) => {
      setSearchTerm(e.target.value);
   };

   const [filter, setFilter] = useState('');

   const handleFilterChange = (e) => {
      setFilter(e.target.value);
   };

   const handleSearch = async () => {
      try {
         const query = new URLSearchParams({
            search: searchTerm,
            filter
         }).toString();

         const response = await axios.get(`/api/search-week-searches?${query}`);
         setWeekSearches(response.data);
      } catch (error) {
         console.error('Error fetching data', error);
      }
   };

   useEffect(() => {
      handleSearch();
   }, []);

   return (
      <Fragment>
         <div className="flex items-start justify-center">
            <div className="max-w-[850px] w-full">
               <div className="w-full">
                  {weekSearches.length !== 0
                     ? weekSearches.map(weekSearch => <WeekSearchItem key={weekSearch.id} profileId={profile.id} avatar={profile.avatar} weekSearch={weekSearch} />)
                     : "No week searches"
                  }
               </div>
            </div>
            <div className="max-w-[250px] mt-3 ml-4 border border-indigo-200 p-3 rounded-md h-max">
               <div className="relative flex items-center shadow-md">
                  <input onChange={(e) => handleChange(e)} className="py-2 px-3 border border-indigo-50" type="text" placeholder={t("search") + "..."} />
               </div>
               <label className="flex items-center p-2 mt-3 hover:bg-gray-100 cursor-pointer">
                  <input
                     type="radio"
                     name="time-filter"
                     value=""
                     checked={filter === ''}
                     onChange={handleFilterChange}
                     className="mr-2"
                  />
                  {t("all_time")}
               </label>
               <label className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                  <input
                     type="radio"
                     name="time-filter"
                     value="thisWeek"
                     checked={filter === 'thisWeek'}
                     onChange={handleFilterChange}
                     className="mr-2"
                  />
                  {t("this_week")}
               </label>
               <label className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                  <input
                     type="radio"
                     name="time-filter"
                     value="twoWeeks"
                     checked={filter === 'twoWeeks'}
                     onChange={handleFilterChange}
                     className="mr-2"
                  />
                  {t("last_two_week")}
               </label>
               <label className="flex items-center mb-3 p-2 hover:bg-gray-100 cursor-pointer">
                  <input
                     type="radio"
                     name="time-filter"
                     value="thisMonth"
                     checked={filter === 'thisMonth'}
                     onChange={handleFilterChange}
                     className="mr-2"
                  />
                  {t("this_month")}
               </label>

               <button onClick={() => handleSearch()} type="button" className="flex rounded justify-center text-white h-full w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  <Search size={18} className="mr-2" />
                  <span className="">{t("search")}</span>
               </button>
            </div>
         </div>
      </Fragment>

   )
}


