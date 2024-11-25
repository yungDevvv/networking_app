import { useEffect, useState } from "react"
import { getUserWeekSearches } from "../lib/week-searches";
import { formatDate } from "../utils/formatDate";
import { useTranslation } from "next-i18next";


const MemberCardWeekSearch = ({ profileId }) => {
   const [weekSearches, setWeekSearches] = useState([]);
   const {t} = useTranslation("common");
   const fetchUserWeekSearches = async () => {
      let twoWeeks = true;
      const res = await getUserWeekSearches(profileId, twoWeeks);
      setWeekSearches(res.result);
   }
   useEffect(() => {
      fetchUserWeekSearches()
     
   }, [])

   return (
      <div className="justify-self-start self-start">
         {weekSearches.length !== 0
            ? weekSearches.map(item => (
               <div key={item.id} className="w-full font-semibold mb-1">
                  <span className="text-xs text-indigo-500 block">{formatDate(item.start_date)}</span>
                  <p className="block max-w-72 overflow-hidden text-ellipsis whitespace-nowrap leading-tight">{item.search_text}</p>
               </div>
            ))
            : t("asd22")
         }
      </div>
   )
}

export default MemberCardWeekSearch;