import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import axios from "axios";

function ProfileSettingsModal({ setModalOpen, profileId, privacy_settings }) {

   const { t } = useTranslation("common")
   const router = useRouter();

   const [showEmail, setShowEmail] = useState(privacy_settings?.email || false);
   const [showPhone, setShowPhone] = useState(privacy_settings?.phone || false);
   const [showProfile, setShowProfile] = useState(privacy_settings?.show_profile || false);

   const handleSubmit = async () => {
      try {
         const res = await axios.post("/api/privacy-settings/" + profileId, {
            email: showEmail,
            phone: showPhone,
            show_profile: showProfile
         })

         if (res.status === 200) {
            setModalOpen(false);
            router.replace(router.asPath)
         }
      } catch (error) {
         console.log("Error sending privacy settings: ", error)
      }

   }


   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
               <div>
                  <h2 className="text-xl font-semibold">{t("public_profile_settings")}</h2>
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
            <div className="select-none">
               <div>
                  <span className="mb-2 block font-semibold">{t("ads301")}</span>
                  <label className="flex items-center space-x-2">
                     <input
                        type="checkbox"
                        checked={showEmail}
                        onChange={(e) => setShowEmail(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-indigo-600"
                     />
                     <span>{t("show_email")}</span>
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
                     <span>{t("show_phone")}</span>
                  </label>
               </div>
               <span className="block mt-2 font-semibold">{t("asd302")}</span>
               <div className="mt-2">
                  <label className="flex items-center space-x-2">
                     <input
                        type="checkbox"
                        checked={showProfile}
                        onChange={(e) => setShowProfile(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-indigo-600"
                     />
                     <span>{t("show_profile")}</span>
                  </label>
               </div>
               <div className="mt-4">
                  <button onClick={handleSubmit} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">{t("save")}</button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ProfileSettingsModal;