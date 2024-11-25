import { useState } from "react";
import { checkAuth } from "../../lib/check-auth"
import CreateGroupModal from "../../components/modals/create-group-modal";
import { getPrivateGroups, getUserPrivateGroups } from "../../lib/private-groups";
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "next-i18next";

export const getServerSideProps = async (ctx) => {
   const { props } = await checkAuth(ctx);
   const groups = await getUserPrivateGroups(ctx);

   return { props: { ...props, groups: groups.groups } }
};


export default function PrivateGroups({ groups }) {
   const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
   const { t } = useTranslation("common")
   return (
      <div>
         <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold mb-3">{t("private_groups")}</h1>
            <button type="button" className="border border-green-500 px-3 py-1 text-lg font-semibold" onClick={() => setCreateGroupModalOpen(true)}>{t("create_group")}</button>
         </div>
         <div className="space-y-6 w-full">
            {groups.length !== 0
               ? groups.map((group) => (
                  <Link
                     href={"/private-group/" + group.id}
                     key={group.id}
                     className="bg-white w-full border rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow duration-300 flex items-center justify-between"
                  >
                     <h3 className="text-lg font-semibold">{group.title}</h3>
                     <button>
                        <CircleArrowRight strokeWidth={1.25} />
                     </button>
                  </Link>
               ))
               : <span className="mt-3">{t("no_groups_found")}</span>
            }
         </div>
         {createGroupModalOpen && <CreateGroupModal setCreateGroupModalOpen={setCreateGroupModalOpen} />}
      </div>
   )
}

