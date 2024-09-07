import { SquarePlus, Mail } from "lucide-react";
import { Fragment, useState } from "react";
import { useModal } from "../context/ModalProvider";
import { useRouter } from "next/router";

const ProfileCard = ({ user, searchTerm }) => {
   const [tab, setTab] = useState(true);
   const {openModal} = useModal();
   const router = useRouter();

   const highlightText = (text) => {
      if (!searchTerm) return text;

      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const parts = text.split(regex);

      return parts.map((part, index) => (
         regex.test(part) ? <span key={index} className="bg-yellow-200">{part}</span> : part
      ));
   };

   const handleClick = (profileId) => {
      router.replace(`?profileId=${profileId}`);
      openModal("choose-network")
   }
   return (
      <div className={`bg-white min-h-[350px] shadow-lg rounded-lg p-6 border border-gray-100 relative ${tab && 'space-y-2'}`}>
         <div className="absolute select-none right-6 bg-indigo-500 rounded-full p-1 cursor-pointer hover:bg-indigo-400" title="more info" onClick={() => setTab(prev => !prev)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFF" className="bi bi-question-lg select-none" viewBox="0 0 16 16" title="more info">
               <path fillRule="evenodd" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14" />
            </svg>
         </div>
         {!tab
            ? (
               <Fragment>
                  <div>
                     <p className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 011.832 2.555l-2.564 7.32A2 2 0 0116.384 20H7.615a2 2 0 01-1.884-1.875L3.167 10.556A2 2 0 015 8h2m0-6h10v2H7V2z" />
                        </svg>
                        <strong>Sijainti:</strong> <span className="ml-1">{highlightText(user.address1)}</span>
                     </p>
                  </div>

                  <div className="mt-1">
                     <p className="flex items-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4V4z" />
                        </svg>
                        <strong>Website:</strong> <span className="text-blue-500 ml-1">{user?.website ? user.website : '-'}</span>
                     </p>
                  </div>

                  <div className="mt-2">
                     <strong className="text-gray-700">Esittely:</strong>
                     <p className="text-gray-600 text-sm leading-tight">
                        {highlightText(user.notice)}
                     </p>
                  </div>

                  <div className="mt-2">
                     <strong className="text-gray-700">Tarjoamme:</strong>
                     <p className="text-gray-600 text-sm leading-tight">
                        {highlightText(user.offering)}
                     </p>
                  </div>

                  <div className="mt-2">
                     <strong className="text-gray-700">Etsimme:</strong>
                     <p className="text-gray-600 text-sm leading-tight">
                        {highlightText(user.searching)}
                     </p>
                  </div>

               </Fragment>
            )
            : (
               <Fragment>
                  <img className="w-36 h-36 rounded mx-auto object-cover" src={user.avatar ? user.avatar : '/blank_profile.png'} alt="Avatar" />
                  <div className="text-center mt-4">
                     <h2 className="text-lg font-semibold">{highlightText(user.first_name)} {highlightText(user.last_name)}</h2>
                     <p className="text-gray-600">{highlightText(user.company)}</p>
                     <p className="text-gray-500">{highlightText(user.title)}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                     <div className="flex items-center">
                        <div className="rounded bg-indigo-100 p-2 mr-2">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4338ca" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                           </svg>
                        </div>
                        {user.phone}
                     </div>
                     <div className="flex items-center">
                        <div className="rounded bg-indigo-100 p-2 mr-2">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4338ca" className="bi bi-envelope" viewBox="0 0 16 16">
                              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                           </svg>
                        </div>
                        {user.email_address}
                     </div>
                     <div className="py-2">
                     <hr className="block" />
                     </div>
                    
                     <div className="flex items-center justify-between">
                        <button type="button"><Mail strokeWidth={1.25} /></button>
                        <button type="button" className="text-green-700" onClick={() => handleClick(user.id)}><SquarePlus strokeWidth={1.25} /></button>
                     </div>

                  </div>
               </Fragment>
            )
         }
      </div>
   )
}

export default ProfileCard;