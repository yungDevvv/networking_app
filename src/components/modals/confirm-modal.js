
import { useEffect } from "react";
import { X } from "lucide-react";

function ConfirmModal({setConfirmStatus, setConfirmOpen}) {
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
               <h2 className="text-xl font-semibold">Title</h2>
               <button
                  onClick={() => setConfirmOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
               >
                  <X size={18} />
               </button>
            </div>
            <div className="space-y-6">
               
            </div>
         </div>
      </div>
   )
}

export default ConfirmModal;