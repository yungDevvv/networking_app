import { useEffect, useState } from "react";
import { useModal } from "../../context/ModalProvider";
import { addUserToNetwork, getUserAdminNetworks } from "../../lib/networks";
import { useRouter } from 'next/router';
import { useTranslation } from "next-i18next";

function ChooseNetworkModal({ userProfileId }) {
   const {t} = useTranslation("common");

   const { modals, closeModal } = useModal();
   const [userNetworks, setUserNetworks] = useState([])
   const isOpen = modals["choose-network"];
   const [message, setMessage] = useState("")
   const [error, setError] = useState("")
   const router = useRouter();
   const { profileId } = router.query;

   useEffect(() => {
      const fetchUserNetworks = async () => {
         try {
            const res = await getUserAdminNetworks(userProfileId);
            setUserNetworks(res.networks);
         } catch (error) {
            console.error(error)
         }
      }
      fetchUserNetworks();

   }, [])

   useEffect(() => {
      if (isOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "auto";


      return () => {
         document.body.style.overflow = "auto";
         setMessage("");
         setError("");
      }
   }, [isOpen])

   const handle = async (networkId) => {
      const res = await addUserToNetwork(+profileId, networkId);
      setMessage("");
      setError("");
      if (res?.error) {
         setError(res.error);
         return;
      }
      if (res.message) {
         setMessage(res.message);
         return;
      }
   }

   if (!isOpen) return null;
   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-semibold">{t("pick_network")}</h2>
               <button
                  onClick={() => closeModal("choose-network")}
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
            {message && <p className="py-2 text-green-600">{message}</p>}
            {error && <p className="py-2 text-red-600">{error}</p>}
            <div className="space-y-3">
               {userNetworks.length !== 0
                  ? userNetworks.map((network) => (
                     <button key={network.id} type="button" className="w-full border rounded border-indigo-500 py-3 hover:shadow-md" onClick={() => handle(network.id)}>
                        {network.name}
                     </button>
                  ))
                  : <span>{t("networks_not_found")}</span>
               }
            </div>
         </div>
      </div>
   )
}

export default ChooseNetworkModal;