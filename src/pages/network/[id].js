import { checkAuth } from "../../lib/check-auth";
import { deleteNetwork, getNetworkWithMembers, leaveNetwork, removeUserFromNetwork } from "../../lib/networks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import ProfileCard from '../../components/ProfileCard'
import MemberCard from "../../components/MemberCard";
import { getUserWeekSearches } from "../../lib/week-searches";
import { ToastContainer } from "react-toastify";
import { error, success } from "../../lib/toastify";

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const id = ctx.params.id;

   let { network, members } = await getNetworkWithMembers(id);
   
   // members = [...members[0].members];
   network = network.network[0];
   return { props: { ...props, network, members } }
};


export default function Network({ network, members, profile }) {
   
   const { t } = useTranslation("common")
   const router = useRouter();
   const { id: networkId } = router.query;

   const me = members.find(member => member.id === profile.id);
   const isAdmin = me.role === "ADMIN";

   members = members.filter(member => member.id !== profile.id)
   
   const deleteMemberFromNetwork = async (memberProfileId) => {
      const res = await removeUserFromNetwork(network.id, memberProfileId);

      if(res.status === 200) {
         success("Member was successfully kicked!");
         router.replace(router.asPath);
      } else {
         error("Ops! Something went wrong, member wasn't deleted!")
      }
   }

   const handleDelete = async () => {
      await deleteNetwork(network.id);
      router.push("/network/networks")
   }

   const handleLeave = async () => {
      const res = await leaveNetwork(network.id);
      
      if(res.status === 200) {
         router.push("/network/networks");
      }
   }
   return (
      <div>
         <h2 className="text-center font-bold text-lg">{network.name}</h2>
         <div className="my-5">
            <h4 className="font-semibold mb-3">{t("members")}</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
               {
                  members.length !== 0
                     ? members.map((user, i) => <MemberCard key={i} member={user} isAdmin={isAdmin} deleteMemberFromNetwork={deleteMemberFromNetwork} />)
                     : <h3>No users</h3>
               }
            </div>
         </div>
         <ToastContainer />
         {!isAdmin && <button type="button" className="text-white bg-red-700 p-2 mt-5" onClick={() => handleLeave()}>Leave</button>}
         {isAdmin && <button type="button" className="text-white bg-red-700 p-2 mt-5" onClick={() => handleDelete()}>Delete this Network</button>}
      </div>
   )
}

