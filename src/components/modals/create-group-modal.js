import { X } from "lucide-react"
import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { success } from "../../lib/toastify";
import { createPrivateGroup, deletePrivateGroup, editPrivateGroup } from "../../lib/private-groups";
import { useTranslation } from "next-i18next";

function CreateGroupModal({ setCreateGroupModalOpen, edit = false, group = {} }) {
   const [groupTitle, setGroupTitle] = useState(group ? group.title : "");
   const [groupDescription, setGroupDescription] = useState(group ? group.description : "");
   const {t} = useTranslation("common");
   const router = useRouter();

   const handleSubmit = async () => {
      const res = await createPrivateGroup({ title: groupTitle, description: groupDescription })

      if (res.status === 201) {
         router.push("/private-group/" + res.data.privateGroupId)
      }
   }

   const handleEdit = async () => {
      const res = await editPrivateGroup(group.id, { title: groupTitle, description: groupDescription })
      
      if (res.status === 200) {
         // success("Group data edited successfully!")
         router.replace(router.asPath)
         setCreateGroupModalOpen(false);
      }
   }
   
   const handleDelete = async () => {
      const res = await deletePrivateGroup(group.id) 
       
      if (res.status === 200) {
         setCreateGroupModalOpen(false);
         router.replace("/private-group/groups");
      }
   }
   

   useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = "auto";
      }
   }, [])
   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full ">
            <div className="flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-semibold -mt-1">{edit ? t("edit_group") : t("create_group")} </h2>
                  {!edit && (
                     <small className="block">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget eros arcu.
                     </small>
                  )}
               </div>
               <button
                  onClick={() => setCreateGroupModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 block mb-auto"
               >
                  <X />
               </button>
            </div>
            <div className="my-5">
               <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t("group_title")} <span className='text-red-600'>*</span></label>
                  <input
                     id="title"
                     name="title"
                     type="text"
                     value={groupTitle}
                     onChange={(e) => setGroupTitle(e.target.value)}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     required
                  />
               </div>
               <div className="mt-2">
                  <label htmlFor="group-description" className="block text-sm font-medium text-gray-700">{t("group_description")} <span className='text-red-600'>*</span></label>
                  <input
                     id="group-description"
                     name="group-description"
                     type="text"
                     value={groupDescription}
                     onChange={(e) => setGroupDescription(e.target.value)}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     required
                  />
               </div>
            </div>
            <div className="w-full flex justify-between items-center">
               {edit 
                  ? (
                     <Fragment>
                        <button onClick={() => handleDelete()} className="bg-red-500 self-start text-white py-2 px-4 rounded-md hover:bg-red-700">{t("delete")}</button>
                        <button onClick={() => handleEdit()} className="bg-indigo-600 self-start text-white py-2 px-4 rounded-md hover:bg-indigo-700">{t("edit")}</button>
                     </Fragment>
                  )
                  : <button onClick={() => handleSubmit()} className="bg-indigo-600 self-start text-white py-2 px-4 rounded-md hover:bg-indigo-700">{t("create")}</button>
               }
            </div>
         </div>
      </div>
   )
}

export default CreateGroupModal;