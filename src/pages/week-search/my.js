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
   const [confirmStatus, setConfirmStatus] = useState(false);
   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
   return (
      <div className="max-w-[850px] mx-auto">

         {week_search.length !== 0
            ? week_search.map(weekSearch => <UserWeekSearchItem avatar={profile.avatar} profileId={profile.id} key={weekSearch.id} weekSearch={weekSearch} />)
            : "Add your search request here."
         }

         {confirmModalOpen && <ConfirmModal setConfirmStatus={setConfirmStatus} setConfirmOpen={setConfirmOpen} />}
      </div>
   )
}
