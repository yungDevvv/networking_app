import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import axios from "axios";
import { Search, X } from "lucide-react"
import { useEffect } from "react";
function SearchCompanyModal({setSearchModalOpen}) {

   useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = "auto";
      }
   }, []) 

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden backdrop-blur-sm">
         <div className="bg-white rounded-lg shadow-lg max-w-lg w-full border">
            <div className="flex items-center border-b px-3">
               <Search size={22} className="mr-2" />
               <input
                  type="text"
                  className="flex h-11 w-full rounded-md  bg-transparent py-3 text-md outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Search all companies"
               />
               <button
                  onClick={() => setSearchModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
               >
                  <X size={18} />
               </button>

            </div>
            <div className="space-y-3 select-none">
               asdasasd
               <p>asdasdasd</p>
            </div>
         </div>
      </div>
   )
}

export default SearchCompanyModal;