import { checkAuth } from "../../lib/check-auth"
import { createWeekSearches, getWeekSearches } from "../../lib/week-searches";
import WeekSearchItem from "../../components/WeekSearchItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const week_search = await getWeekSearches();
   return { props: { ...props, week_search: week_search.result } }
}

export default function All({ profile, week_search }) {
   const [text, setText] = useState("");
   const [weekSearches, setWeekSearches] = useState([...week_search] || []);

   const formatDate = (date) => date.toISOString().split('T')[0];

   const handleSubmit = async () => {
      const startDate = new Date();

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const data = {
         profileId: profile.id,
         search_text: text,
         start_date: formatDate(startDate),
         end_date: formatDate(endDate)
      }
      const res = await createWeekSearches(data);

      if (res.status === 201) {
         setText("")
         const week_search = await getWeekSearches();
         setWeekSearches([...week_search.result])
      }
   }

   const [searchTerm, setSearchTerm] = useState('');
   const [results, setResults] = useState([]);

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
      <div className="flex item-center justify-center">
         <div className="max-w-[850px]">
            <div className="border border-indigo-200 p-3 rounded-md">
               <p className="font-semibold">Enter your weekly search request here</p>
               <small className="text-gray-500 block">
                  Specify who or what you're looking for. The request will be active for a week and visible to other users.
               </small>
               <textarea onChange={(e) => setText(e.target.value)} value={text} placeholder="For example: Looking for marketing decision-makers in company XXX Ltd." className="p-2 h-32 resize-none w-full mt-5 shadow-sm border border-indigo-200 rounded-md" />
               <button onClick={handleSubmit} className="w-40 bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
            </div>
            <div>
               {weekSearches.length !== 0
                  ? weekSearches.map(weekSearch => <WeekSearchItem key={weekSearch.id} profileId={profile.id} avatar={profile.avatar} weekSearch={weekSearch} />)
                  : "No week searches"
               }
            </div>
         </div>
         <div className="max-w-[250px] ml-4 border border-indigo-200 p-3 rounded-md h-max">
            <div className="relative flex items-center shadow-md">
               <input onChange={(e) => handleChange(e)} className="py-2 px-3 border border-indigo-50" type="text" placeholder="Search..." />
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
                  All time
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
                  This week
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
                  Last 2 weeks
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
                  This month
               </label>

            <button onClick={() => handleSearch()} type="button" className="flex rounded justify-center text-white h-full w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
               <Search size={18} className="mr-2" />
               <span className="">Search</span>
            </button>
         </div>

      </div>
   )
}


