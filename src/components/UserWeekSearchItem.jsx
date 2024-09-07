import { Clock, FilePenLine, MapPin, MessageSquare, ShieldCheck, Trash2 } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { deleteUserWeekSearch, updateUserWeekSearch } from "../lib/week-searches";
import { useRouter } from "next/router";
import { useState } from "react";


const UserWeekSearchItem = ({ weekSearch, profileId }) => {
   const router = useRouter();
   const [editorOpen, setEditorOpen] = useState(false);
   const [commentsOpen, setCommentsOpen] = useState(false);
   const [text, setText] = useState(weekSearch.search_text)
   const handleDelete = async (id) => {
      const res = await deleteUserWeekSearch(id, profileId);
      if (res) {
         router.reload();
      }
   }
   const handleUpdate = async () => {
      const res = await updateUserWeekSearch(weekSearch.id, text);
      if (res) {
         router.reload();
      }
   }
   return (
      <div className="p-3 border border-indigo-200 rounded-md mt-3">
         <div className="flex items-center">
            <img src={weekSearch.avatar ? weekSearch.avatar : "/blank_profile.png"} alt="avatar" className="w-[50px] h-[50px] mr-2 rounded object-cover" />
            <div>
               <strong className="font-semibold w-full">You</strong>
            </div>
            <div className="ml-auto">
               <div className="flex items-center">
                  <Clock size={16} className="text-indigo-600 mr-1" />
                  <span className="text-sm text-gray-500">{formatDate(weekSearch.start_date)}</span>
               </div>
               <div className="flex items-center">
                  <ShieldCheck size={16} className={`mr-1 ${weekSearch.is_active ? "text-green-500" : "text-gray-600"}`} />
                  <span className={`text-sm ${weekSearch.is_active ? "text-green-500" : "text-gray-600"}`}>{weekSearch.is_active ? "Active" : "Not active"}</span>
               </div>
            </div>
         </div>
         <hr className="border-indigo-200 my-3" />
         <p>
            {weekSearch.search_text}
         </p>
         {editorOpen && (
            <div className="w-full mt-2">
               <textarea className="resize-none h-20 mt-1 block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="text" value={text} onChange={(e) => setText(e.target.value)} />
               <button onClick={handleUpdate} className="bg-green-500 rounded-md text-white px-2 py-1 mt-2">Apply</button>
            </div>
         )}
         <div className="mt-4 space-x-3">
            <button onClick={() => handleDelete(weekSearch.id)} type="button" className="bg-red-600 rounded-md py-1 px-2">
               <Trash2 size={20} color="#fff" />
            </button>
            <button onClick={() => setEditorOpen(open => !open)} type="button" className="bg-indigo-500 rounded-md py-1 px-2">
               <FilePenLine size={20} color="#fff" />
            </button>
            {/* <button onClick={() => setCommentsOpen(open => !open)} type="button" className="bg-indigo-500 rounded-md py-1 px-2">
               <MessageSquare size={20} color="#fff" />
            </button> */}
         </div>
         {commentsOpen && (
            <div className="border border-slate-200 shadow-md">
               <div>
                  <textarea className="p-2 h-32 resize-none w-full mt-5 shadow-sm border border-indigo-200 rounded-md"></textarea>
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
               </div>
            </div>
         )}
      </div>
   )
}

export default UserWeekSearchItem;