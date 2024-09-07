import { formatDate } from "../utils/formatDate";

const WeekSearchComment = ({comment}) => {
   return (
      <div className="flex mb-5">
         <img src={comment.avatar ? comment.avatar : "/blank_profile.png"} alt="avatar" className="self-start w-[35px] h-[35px] mr-2 rounded object-cover" />
         {/* <img src={"/blank_profile.png"} alt="avatar" className="self-start w-[35px] h-[35px] mr-2 rounded object-cover" /> */}
         <div className="ml-2 -mt-1">
            <div className="flex items-center">
               <h4 className="font-semibold mr-3">{comment.first_name} {comment.last_name}</h4>
               <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
            </div>
            <p>{comment.comment_text}</p>
         </div>
      </div>
   )
}

export default WeekSearchComment;