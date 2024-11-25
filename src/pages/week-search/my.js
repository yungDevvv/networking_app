import { checkAuth } from "../../lib/check-auth"
import { createWeekSearches, getUserWeekSearches, getWeekSearches } from "../../lib/week-searches"
import { useState } from "react"
import UserWeekSearchItem from "../../components/UserWeekSearchItem"
import UserDuplicateWeekSearch from "../../components/UserDuplicateWeekSearch"
import { useRouter } from "next/router"
import ConfirmModal from "../../components/modals/confirm-modal"
import { formatDate } from "../../utils/formatDate"
import { useTranslation } from "next-i18next"

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const week_search = await getUserWeekSearches(props.profile.id);

   return { props: { ...props, week_search: week_search.result } }
}

export default function My({ profile, week_search }) {
   const { t } = useTranslation("common")
   const [confirmStatus, setConfirmStatus] = useState(false);
   const [confirmModalOpen, setConfirmModalOpen] = useState(false);
   const [duplicatedWeekSearch, setDuplicatedWeekSearch] = useState(null);
   const [text, setText] = useState("");
   const [weekSearches, setWeekSearches] = useState([...week_search] || []);
   const router = useRouter()

   const handleSubmit = async (text) => {
      const startDate = new Date();

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const data = {
         profileId: profile.id,
         search_text: text,
         start_date: startDate.toISOString(),
         end_date: endDate.toISOString()
      }
      const res = await createWeekSearches(data);

      if (res.status === 201) {
         setText("")
         router.reload();
         // const week_search = await getWeekSearches(); 
         // setWeekSearches([...week_search.result])
      }
   }
 

   return (
      <div className="max-w-[850px] mx-auto">
         <div className="border border-indigo-200 p-3 rounded-md">
            <p className="font-semibold">{t("asd100")}</p>
            <small className="text-gray-500 block">
               {t("asd101")}
            </small>
            <textarea onChange={(e) => setText(e.target.value)} value={text} placeholder={t("asd102")} className="p-2 h-32 resize-none w-full mt-5 shadow-sm border border-indigo-200 rounded-md" />
            <button onClick={() => handleSubmit(text)} className="w-40 bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{t("send")}</button>
         </div>
         {duplicatedWeekSearch && <UserDuplicateWeekSearch handleSubmit={handleSubmit} avatar={profile.avatar} profileId={profile.id} weekSearch={duplicatedWeekSearch} />}
         {weekSearches.length !== 0
            ? weekSearches.map(weekSearch => <UserWeekSearchItem setDuplicatedWeekSearch={setDuplicatedWeekSearch} avatar={profile.avatar} profileId={profile.id} key={weekSearch.id} weekSearch={weekSearch} />)
            : <span className="block mt-4">{t("asd400")}</span>
         }

         {confirmModalOpen && <ConfirmModal setConfirmStatus={setConfirmStatus} setConfirmOpen={setConfirmOpen} />}
      </div>
   )
}
