import { Clock, MapPin, MessageSquare } from "lucide-react";
import { formatDate, formatDateTime } from "../utils/formatDate";
import { Fragment, useEffect, useState } from "react";
import WeekSearchComment from "./WeekSearchComment";
import { createWeekSearchComment, getWeekSearchComments } from "../lib/week-searches";
import { i18n } from 'next-i18next';

const ProfileWeekSearchItem = ({ weekSearch, profileId, avatar }) => {
   const currentLanguage = i18n.language;

   const [commentsOpen, setCommentsOpen] = useState(false);
   const [comments, setComments] = useState([]);
   const [commentText, setCommentText] = useState('');
  
   const handleSubmit = async () => {
      const res = await createWeekSearchComment(profileId, weekSearch.id, commentText);
      
      if(res) {
         setCommentText("");
         setComments(prev => [res, ...prev])
      }
   }

   const fetchComments = async () => {
      const res = await getWeekSearchComments(weekSearch.id);
      if(res) {
         setComments([...res])
      }
   }
   useEffect(() => {
      fetchComments()
   }, [])
   
   return (
      <div className="2xl:p-3 p-2 border border-indigo-200 rounded-md mb-3">
         <div className="flex items-center">
            <img src={weekSearch.avatar ? weekSearch.avatar : "/blank_profile.png"} alt="avatar" className="2xl:w-[50px] 2xl:h-[50px] w-[40px] h-[40px] mr-2 rounded object-cover" />
            <div>
               <strong className="font-semibold w-full xl:text-base text-sm">{weekSearch.first_name} {weekSearch.last_name[0]}.</strong>
               <div className="flex items-center">
                  <MapPin size={16} className="text-indigo-600" />
                  <span className="xl:text-sm text-xs">{weekSearch.address1}</span>
               </div>
            </div>
            <div className="ml-auto self-start">
               <div className="flex items-center">
                  <Clock className="text-indigo-600 mr-1 w-[16px]" />
                  <span className="xl:text-sm text-xs text-gray-500 ">{formatDateTime(weekSearch.start_date, currentLanguage)}</span> 
               </div>
              
            </div>
         </div>
         <hr className="border-indigo-200 my-3" />
         <p>
            {weekSearch.search_text}
         </p>

         {/* <div className="mt-4">
            <button onClick={() => setCommentsOpen(open => !open)} type="button" className="bg-indigo-500 rounded-md py-1 px-2 flex items-center">
               <MessageSquare size={20} color="#fff" />
               <span className="text-white ml-1 -mt-1">{comments.length}</span>
            </button>
         </div> */}

         {/* {commentsOpen && (
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
         )} */}
      </div>
   )
}

export default ProfileWeekSearchItem;