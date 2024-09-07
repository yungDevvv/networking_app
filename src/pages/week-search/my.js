import { checkAuth } from "../../lib/check-auth"
import { createWeekSearches, getUserWeekSearches } from "../../lib/week-searches"
import { useState } from "react"
import UserWeekSearchItem from "../../components/UserWeekSearchItem"
import { useRouter } from "next/router"

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const week_search = await getUserWeekSearches(props.profile.id);

   return { props: { ...props, week_search: week_search.result } }
}

export default function My({ profile, week_search }) {
   const [text, setText] = useState("");

   const router = useRouter();

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
      router.reload();
     
   }

   return (
      <div className="max-w-[850px] mx-auto">
         <div className="border border-indigo-200 p-3 rounded-md">
            <p className="font-semibold">Enter your weekly search request here</p>
            <small className="text-gray-500 block">
               Specify who or what you're looking for. The request will be active for a week and visible to other users.
            </small>
            <textarea onChange={(e) => setText(e.target.value)} value={text} placeholder="For example: Looking for marketing decision-makers in company XXX Ltd." className="p-2 h-32 resize-none w-full mt-5 shadow-sm border border-indigo-200 rounded-md" />
            <button onClick={handleSubmit} className="w-40 bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
         </div>
         {week_search.length !== 0 
            ? week_search.map(weekSearch => <UserWeekSearchItem profileId={profile.id} key={weekSearch.id} weekSearch={weekSearch} />)
            : "Add your search request here."
         }
      </div>
   )
}
