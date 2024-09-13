import { useEffect, useState } from "react";
import MemberCard from "../../components/MemberCard";
import ProfileCard from "../../components/ProfileCard";
import { checkAuth } from "../../lib/check-auth";
import { getUsersProfiles } from "../../lib/users";
import axios from "axios"
import { useTranslation } from "next-i18next";
import ContactCard from "../../components/ContactCard";

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const users = await getUsersProfiles();

   return { props: { ...props, ...users } }
};

const usersList = ({ user, users }) => {
   const {t} = useTranslation("common")
   
   const [searchTerm, setSearchTerm] = useState('');
   const [results, setResults] = useState([]);

   
   const handleChange = (e) => {
      setSearchTerm(e.target.value);
   };

   const handleSearch = async () => {
      console.log("HANDLE SEARCH")
      try {
         const query = new URLSearchParams({ search: searchTerm }).toString();
         const response = await axios.get(`/api/search-users?${query}`);
         const me = response.data.find(member => member.user_id === user.id);
         const users = response.data.filter(user => user.user_id !== me.user_id)
         setResults(users);
      } catch (error) {
         console.error('Error fetching data', error);
      }
   };

   
   useEffect(() => {
      handleSearch()
   }, [])
   return (
      <div className="w-full">
         <div className="flex justify-between">
            <h1 className="text-2xl font-bold">{t("users")}</h1>
            <div className="relative flex items-center shadow-md">
               <input onChange={(e) => handleChange(e)} className="py-2 px-3 border border-indigo-50" type="text" placeholder="Search..." />
               <button onClick={() => handleSearch()} type="button" className="text-white h-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  <svg className="bi bi-search" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" viewBox="0 0 16 16">
                     <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
               </button>
            </div>
         </div>
         <div className="mx-auto py-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
               {results.length !== 0
                  ? results.map((user, i) => <ContactCard key={i} member={user} searchTerm={searchTerm} />)
                  : <h3>No users</h3>
               }
            </div>
         </div>
      </div>
   )
}

export default usersList;