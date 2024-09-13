import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import axios from "axios";

function ProfileSettingsModal({setModalOpen, profileId, privacy_settings}) {
   console.log(privacy_settings)
   const { t } = useTranslation("common")
   const router = useRouter();

   const [showEmail, setShowEmail] = useState(privacy_settings?.email || false);
   const [showPhone, setShowPhone] = useState(privacy_settings?.phone || false);

   const handleSubmit = async () => {
      try {
         const res = await axios.post("/api/privacy-settings/" + profileId, {
            email: showEmail,
            phone: showPhone,
         })
      
         if(res) {
            setModalOpen(false);
            router.replace(router.asPath)
         }
      } catch (error) {
         console.log("Error sending privacy settings: ", error)
      }
      
   }


   useEffect(() => {
      console.log(showEmail, showPhone)
   }, [showEmail, showPhone])
   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
               <div>
                  <h2 className="text-xl font-semibold">Public profile settings</h2>
                  <small>Specify wich fields you want to display in your public profile.</small>
               </div>

               <button
                  onClick={() => setModalOpen(false)}
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
            <div className="space-y-3 select-none">
               <div>
                  <label className="flex items-center space-x-2">
                     <input
                        type="checkbox"
                        checked={showEmail}
                        onChange={(e) => setShowEmail(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-indigo-600"
                     />
                     <span>Show email</span>
                  </label>
               </div>
               <div>
                  <label className="flex items-center space-x-2">
                     <input
                        type="checkbox"
                        checked={showPhone}
                        onChange={(e) => setShowPhone(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-indigo-600"
                     />
                     <span>Show phone</span>
                  </label>
               </div>
               <button onClick={handleSubmit} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Save</button>
            </div>
         </div>
      </div>
   )
}

export default ProfileSettingsModal;