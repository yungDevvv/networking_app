import axios from "axios";
import { useModal } from "../../context/ModalProvider";
import { useState } from "react";
import { useRouter } from "next/router";
import { createNetwork } from "../../lib/networks";
import { useTranslation } from "next-i18next";

function CreateNetworkModal({ profileId }) {
   const {t} = useTranslation("common")

   const { modals, closeModal } = useModal();
   const isOpen = modals["create-network"];
   

   const [name, setName] = useState('')

   const router = useRouter();

   const handleSubmit = async () => {
      const res = await createNetwork(name, profileId)
      closeModal("create-network")
      router.reload();
   }
   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-semibold">{t("create_network")}</h2>
               <button
                  onClick={() => closeModal("create-network")}
                  className="text-gray-500 hover:text-gray-700"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="w-6 h-6"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                     />
                  </svg>
               </button>
            </div>
            <div className="space-y-6">
               <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t("network_name")} <span className='text-red-600'>*</span></label>
                  <input
                     id="name"
                     name="name"
                     type="text"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     required
                  />
               </div>
               <button onClick={() => handleSubmit()} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">{t("create")}</button>
            </div>
         </div>
      </div>
   )
}

export default CreateNetworkModal;