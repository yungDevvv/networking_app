import { useState } from "react";

const AvatarBox = ({ firstName, lastName, avatarUrl,setInviteUserModalOpen }) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <div className="relative">
         <button type="button" className="flex items-center" onClick={() => setIsOpen(open => !open)}>
            <img className="w-[36px] h-[36px] mr-2 rounded object-cover" src={avatarUrl ? avatarUrl : "/blank_profile.png"} alt="avatar" />
            <span>{firstName} {lastName?.charAt(0)}.</span>
         </button>

         {isOpen && (
            <div className="absolute top-12 -right-1 bg-white border border-gray-200 shadow-lg rounded-lg w-56 z-50">
               {/* <button onClick={() => setInviteUserModalOpen(open => !open)} type="button" className="font-semibold text-center w-full hover:bg-gray-100 py-2">Invite user by Email</button> */}
               <button onClick={() => setInviteUserModalOpen(open => !open)} type="button" className="font-semibold text-center w-full hover:bg-gray-100 py-2">Invite user by Email</button>
            </div>
         )}
      </div>
   )
}

export default AvatarBox;