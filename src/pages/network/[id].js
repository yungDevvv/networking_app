import { checkAuth } from "../../lib/check-auth";
import { deleteNetwork, getNetwork, removeUserFromNetwork } from "../../lib/networks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import ProfileCard from '../../components/ProfileCard'
import MemberCard from "../../components/MemberCard";
import { getUserWeekSearches } from "../../lib/week-searches";

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const id = ctx.params.id;

   let { network, members } = await getNetwork(id);
   
   // members = [...members[0].members];
   network = network.network[0];
   return { props: { ...props, network, members } }
};


export default function Network({ network, members, profile }) {
   
   const { t } = useTranslation("common")
   console.log(members)
   const router = useRouter();
   const { id: networkId } = router.query;

   const me = members.find(member => member.id === profile.id);
   const isAdmin = me.role === "ADMIN";

   members = members.filter(member => member.id !== profile.id)

   const handle = async (memberId) => {
      const res = await removeUserFromNetwork(profile.id, networkId, memberId);
      router.reload();
   }

   const handleDelete = async () => {
      await deleteNetwork(networkId);
      router.push("/network/networks")
   }

   return (
      <div>
         <h2 className="text-center font-bold text-lg">{network.name}</h2>
         <div className="my-5">
            <h4 className="font-semibold mb-3">{t("members")}</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
               {
                  members.length !== 0
                     ? members.map((user, i) => <MemberCard key={i} member={user} />)
                     : <h3>No users</h3>
               }
            </div>
         </div>

         {isAdmin && <button type="button" className="text-white bg-red-700 p-2 mt-5" onClick={() => handleDelete()}>Delete this Network</button>}
      </div>
   )
}

