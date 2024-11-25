import { Settings } from "lucide-react";
import PrivateGroupMember from "../../components/PrivateGroupMember";
import { checkAuth } from "../../lib/check-auth";
import { changeMemberRole, checkAccessToPrivateGroup, deletePrivateGroup, getPrivateGroupById, getPrivateGroupMembers, leaveGroup, removeMemberFromPrivateGroup } from "../../lib/private-groups";
import { useState } from "react";
import CreateGroupModal from "../../components/modals/create-group-modal";
import { ToastContainer } from "react-toastify";
import { success, error } from "../../lib/toastify";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export const getServerSideProps = async (ctx) => {
   const id = ctx.params.id;
   const { props } = await checkAuth(ctx);

   let res = await checkAccessToPrivateGroup(ctx, id);
   if(res.data.access === false) {
      return {
         redirect: {
             destination: '/private-group/no-access',
             permanent: false, 
         },
     };
   }

   const group = await getPrivateGroupById(id);
   const members = await getPrivateGroupMembers(id);
  
   return { props: { ...props, group: { ...group.group[0] }, members: [...members.members] } }
};


export default function PrivateGroup({ group, members, profile }) {
   const [editGroupModalOpen, setCreateGroupModalOpen] = useState(false);
   const router = useRouter()
   const {t} = useTranslation("common")
   const me = members.find(member => member.id === profile.id);

   const isAdmin = me.role === "ADMIN";

   members = members.filter(member => member.id !== profile.id)


   const handleRemoveMember = async (memberId) => {
      const res = await removeMemberFromPrivateGroup(group.id, memberId) 

      if(res.status === 200) {
         success("Member removed successfully!")
         router.replace(router.asPath)
      }
   }

   const handleDelete = async () => {
      const res = await deletePrivateGroup(group.id); 
      if(res.status === 200) {
         router.push("/private-group/groups");
      }
   }

   const handleLeave = async () => {
      const res = await leaveGroup(group.id); 
      
      if(res.status === 200) {
         router.push("/private-group/groups");
      }
   }

   const handleChangeRole = async (memberId, role) => {
    
         const res = await changeMemberRole(group.id, memberId, role); 
      
      
      if(res.status === 200) {
         const ready = await router.replace(router.asPath);
       
         if(ready) {
            await success("Role changed successfully!");
         }
      }
   }
   return (
      <div className="relative">
         <ToastContainer />
         <h1 className="text-center font-bold text-lg">{group.title}</h1>
         <p className="text-center">{group.description}</p>

         {isAdmin && (
            <div className="absolute z-10 top-1 right-1 cursor-pointer text-indigo-500 hover:text-indigo-700" onClick={() => setCreateGroupModalOpen(true)}>
               <Settings />
            </div>
         )}

         <div>
            <h3 className="font-bold text-lg mb-2">{t("members")}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
               {
                  members.length !== 0
                     ? members.map((user, i) => <PrivateGroupMember key={i} member={user} isAdmin={isAdmin} handleRemoveMember={handleRemoveMember} handleChangeRole={handleChangeRole}  />)
                     : <h3>No members yet... Invite someone!</h3>
               }
            </div>
         </div>
         {!isAdmin && <button type="button" className="text-white bg-red-700 p-2 mt-5" onClick={() => handleLeave()}>{t("leave")}</button>}
         {isAdmin && <button type="button" className="text-white bg-red-700 p-2 mt-5" onClick={() => handleDelete()}>{t("delete_this_group")}</button>}
         {isAdmin && editGroupModalOpen && <CreateGroupModal edit={true} setCreateGroupModalOpen={setCreateGroupModalOpen} group={group} />}
      </div>
   )
}

