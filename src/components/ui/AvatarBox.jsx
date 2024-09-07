const AvatarBox = ({firstName, lastName, avatarUrl}) => {
   return (
      <div className="flex items-center">
         <img className="w-[36px] h-[36px] mr-2 rounded object-cover" src={avatarUrl ? avatarUrl : "/blank_profile.png"} alt="avatar" />
         <span>{firstName} {lastName?.charAt(0)}.</span>
      </div>
   )
}

export default AvatarBox;