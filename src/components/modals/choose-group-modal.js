import { useEffect, useState } from "react";

import { X } from "lucide-react";
import { getUserAdminPrivateGroups, InviteToPrivateGroup } from "../../lib/private-groups";
import { useRouter } from "next/router";
import { success } from "../../lib/toastify";
import axios from "axios";
import { useTranslation } from "next-i18next";

function ChooseGroupModal({ setChooseGroupModalOpen }) {
   const [groups, setGroups] = useState([])
   const {t} = useTranslation("common")
   const router = useRouter();
   const { profileId } = router.query;

   const handleInvite = async (groupId) => {
      try {
         const res = await InviteToPrivateGroup(profileId, groupId);
         success(t("invite_send"))
      } catch (err) {
         console.error('Error send invite', err);
      }
   };

   useEffect(() => {
      const fetchUserNetworks = async () => {
         try {
            const res = await getUserAdminPrivateGroups();
            
            if (res.status === 200) {
               setGroups(res.data)
            }
         } catch (error) {
            console.error(error)
         }
      }
      fetchUserNetworks();

   }, [])

   useEffect(() => {
      document.body.style.overflow = "hidden";

      return () => {
         document.body.style.overflow = "auto";
      }
   }, [])

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-semibold">{t("choose_group")}</h2>
               <button
                  onClick={() => setChooseGroupModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
               >
                  <X size={18} />
               </button>
            </div>
            <div className="space-y-3">
               {groups.length !== 0
                  ? groups.map((group) => (
                     <button key={group.id} type="button" className="w-full border rounded border-indigo-500 py-3 hover:shadow-md" onClick={() => handleInvite(group.id)}>
                        {group.title}
                     </button>
                  ))
                  : <span>{t("no_groups_found")}</span>
               }
            </div>
         </div>
      </div>
   )
}

export default ChooseGroupModal;