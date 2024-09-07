import { checkAuth } from "../../lib/check-auth"
import { Clock, MapPin, MessageSquare, Reply, ShieldCheck } from "lucide-react"
import { getWeekSearches } from "../../lib/week-searches";
import WeekSearchItem from "../../components/WeekSearchItem";

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const week_search = await getWeekSearches();
   // console.log("SERVER SIDE PROPS", week_search.result)
   return { props: { ...props, week_search: week_search.result } }
}

export default function All({profile, week_search }) {
   return (
      <div className="max-w-[850px] mx-auto">
         <h1>All</h1>
         <div>
            {week_search.length !== 0
               ? week_search.map(weekSearch => <WeekSearchItem key={weekSearch.id} profileId={profile.id} avatar={profile.avatar} weekSearch={weekSearch} />)
               : "No week searches"
            }
         </div>
      </div>
   )
}


