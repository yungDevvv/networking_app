import { Clock, CopyCheck, EllipsisVertical, FilePenLine, MapPin, MessageSquare, ShieldCheck, Trash2 } from "lucide-react";
import { formatDate, formatDateTime } from "../utils/formatDate";
import { createWeekSearchComment, deleteUserWeekSearch, getWeekSearchComments, updateUserWeekSearch } from "../lib/week-searches";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import WeekSearchComment from "./WeekSearchComment";
import ConfirmModal from './modals/confirm-modal'
import { i18n, useTranslation } from 'next-i18next';

const UserWeekSearchItem = ({ avatar, weekSearch, profileId, setDuplicatedWeekSearch }) => {
   const router = useRouter();
   const currentLanguage = i18n.language;
   const {t} = useTranslation("common");
   const [editorOpen, setEditorOpen] = useState(false);
   const [commentsOpen, setCommentsOpen] = useState(false);
   const [text, setText] = useState(weekSearch.search_text);
   

   const [isActiveMenuOpen, setIsActiveMenuOpen] = useState(false);

   const handleDelete = async (id) => {
      const res = await deleteUserWeekSearch(id, profileId);
      if (res) {
         router.reload()
      }
   }
   const handleUpdate = async (is_active) => {
      const startDate = new Date();

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      let res;
      if (!Number.isNaN(is_active)) {
         res = await updateUserWeekSearch(weekSearch.id, text, is_active = weekSearch.is_active === 0 ? 1 : 0, endDate.toISOString());
      } else {
         res = await updateUserWeekSearch(weekSearch.id, text, is_active = weekSearch.is_active === 0 ? 1 : 0, endDate.toISOString());
      }
      if (res) {
         router.reload()
      }
   }

   const [comments, setComments] = useState([]);
   const [commentText, setCommentText] = useState('');

   const handleSubmit = async () => {
      const res = await createWeekSearchComment(profileId, weekSearch.id, commentText);

      if (res) {
         setCommentText("");
         setComments(prev => [res, ...prev])
      }
   }

   const fetchComments = async () => {
      const res = await getWeekSearchComments(weekSearch.id);
      if (res) {
         setComments([...res])
      }
   }
   useEffect(() => {
      fetchComments()
   }, [])


   return (
      <div className="p-3 border border-indigo-200 rounded-md mt-3">
         <div className="flex items-center">
            <img src={avatar ? avatar : "/blank_profile.png"} alt="avatar" className="w-[50px] h-[50px] mr-2 rounded object-cover" />
            <div>
               <strong className="font-semibold w-full">You</strong>
            </div>
            <div className="ml-auto flex">
               <div className="relative flex flex-col">
                  <div className="flex items-center ml-auto">
                     <Clock size={16} className="text-indigo-600 mr-1" />
                     <span className="text-sm text-gray-500">{formatDateTime(weekSearch.start_date, currentLanguage)}</span>
                  </div>
                  <button
                     type="button"
                     className="flex items-center mt-1 ml-auto"
                     onClick={() => setIsActiveMenuOpen(prev => !prev)}
                  >
                     <ShieldCheck strokeWidth={2} size={16} className={`mr-1 ${weekSearch.is_active ? "text-green-500" : "text-red-500"}`} />
                     <span className={`text-sm font-semibold max-md:underline ${weekSearch.is_active ? "text-green-500" : "text-red-500"}`}>
                        {weekSearch.is_active
                           ? "ACTIVE"
                           : "NOT ACTIVE"
                        }
                     </span>
                  </button>
                  {isActiveMenuOpen && (
                     <div
                        className="absolute right-0 top-10 mt-2 border w-[125px] bg-white rounded-lg shadow-lg z-10 overflow-hidden"
                     >
                        {weekSearch.is_active
                           ? <button type="button" onClick={() => handleUpdate(0)} className="block w-full px-4 py-2  text-red-600 hover:text-red-800">Deactivate</button>
                           : <button type="button" onClick={() => handleUpdate(1)} className="block w-full px-4 py-2 text-green-600 hover:text-green-800">Activate</button>
                        }
                     </div>
                  )}
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
               <button onClick={handleUpdate} className="bg-green-500 rounded-md text-white px-2 py-1 mt-2">{t("save")}</button>
            </div>
         )}
         <div className="mt-4 space-x-3 flex items-center">
            <button onClick={() => handleDelete(weekSearch.id)} type="button" className="bg-red-600 rounded-md py-1 px-2">
               <Trash2 size={20} color="#fff" />
            </button>
            <button onClick={() => setEditorOpen(open => !open)} type="button" className="bg-indigo-500 rounded-md py-1 px-2">
               <FilePenLine size={20} color="#fff" />
            </button>
            <button onClick={() => setCommentsOpen(open => !open)} type="button" className="bg-indigo-500 rounded-md py-1 px-2 flex items-center">
               <MessageSquare size={20} color="#fff" />
               <span className="text-white ml-1 -mt-1">{comments.length}</span>
            </button>
            <button onClick={() => setDuplicatedWeekSearch({search_text: weekSearch.search_text})} type="button" className="bg-slate-500 rounded-md py-1 px-2" title="duplicate">
               <CopyCheck size={20} color="#fff" />
            </button>
         </div>
         {commentsOpen && (
            <Fragment>
               <hr className="border-indigo-200 my-3" />
               <div className="p-3 rounded-md bg-gray-100">
                  {comments.length !== 0
                     ? comments.map(comment => <WeekSearchComment key={comment.id} comment={comment} />)
                     : <p className="mb-2 font-mono">No comments yet...</p>
                  }
                  <div className="flex items-center">
                     <img src={avatar ? avatar : "/blank_profile.png"} alt="avatar" className="self-start w-[35px] h-[35px] mr-2 rounded object-cover" />
                     <div>
                        <textarea onChange={(e) => setCommentText(e.target.value)} value={commentText} placeholder="Add comment" className="block p-2 h-24 resize-none w-72 shadow-sm border border-indigo-200 rounded-md"></textarea>
                        <button onClick={handleSubmit} className="mt-2 float-end bg-indigo-600 text-white py-1.5 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
                     </div>
                  </div>
               </div>
            </Fragment>
         )}

      </div>
   )
}

export default UserWeekSearchItem;