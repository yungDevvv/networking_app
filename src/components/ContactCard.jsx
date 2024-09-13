import { Fragment, useState } from 'react';
import Image from 'next/image';
import { ContactRound, EllipsisVertical, Info, Link, Mail, MapPin, Phone, Search } from 'lucide-react';
import { companiesList } from '../utils/companies_data';
import { hashEncodeId } from '../../hashId';
import MemberCardWeekSearch from './MemberCardWeekSearchItem';
import { useModal } from "../context/ModalProvider";
import { useRouter } from "next/router";

const ContactCard = ({ member, searchTerm }) => {
   
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [contentOpen, setContentOpen] = useState(1)
   const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

   const {openModal} = useModal();
   const router = useRouter();

   const handleAddToNetwork = (profileId) => {
      router.replace(`?profileId=${profileId}`);
      openModal("choose-network")
   }

   const highlightText = (text) => {
      if (!searchTerm) return text;

      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const parts = text.split(regex);

      return parts.map((part, index) => (
         regex.test(part) ? <span key={index} className="bg-yellow-200">{part}</span> : part
      ));
   };

   const businessNetworks = member?.businessNetworks
      ? companiesList.filter(el => el.name === member.businessNetworks.find(bns => bns === el.name))
      : [];
   
   return (
      <div className={`bg-white shadow-md rounded-lg p-4 border border-gray-100 relative`}>

         {/* Actions Menu */}
         <div className="relative text-right -mb-3">
            <button
               onClick={handleMenuToggle}
               className="text-gray-500 hover:text-gray-700 ml-auto h-5"

            >
               <EllipsisVertical size={20} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg text-left">
                  <ul className="py-1">
                     <li> 
                        <a href={`/profile/` + hashEncodeId(member.id)} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</a>
                     </li>
                     <li> 
                        <button onClick={() => handleAddToNetwork(member.id)} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">Add to network</button>
                     </li>
                     {/* <li>
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Kick</a>
                     </li>
                     <li>
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Change Role</a>
                     </li>
                     <li>
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Add to Contacts</a>
                     </li>
                     <li>
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Send Message</a>
                     </li> */}
                  </ul>
               </div>
            )}
         </div>
         <div className='flex items-center'>
            <div className='mr-5'>
               <img className="w-24 h-24 rounded mx-auto object-cover" src={member.avatar ? member.avatar : '/blank_profile.png'} alt="Avatar" />
            </div>
            <div>
               <h2 className="text-md font-semibold">{highlightText(member.first_name)} {highlightText(member.last_name)}{member.role === "ADMIN" && <span className='font-normal text-red-500'> (ADMIN)</span>}</h2>
               <p className='text-indigo-500'>{member.title}</p>
               <p>{highlightText(member.company)}</p>
            </div>
            <div className='ml-auto'>
               {
                  businessNetworks.length !== 0 &&
                  businessNetworks.map((el, i) => <img key={i} className='w-[20px] h-[20px]' src={el.image} alt="network_logo" title={el.name} />)
               }
            </div>
         </div>
         <hr className='my-5' />
         <div className="flex items-start justify-center flex-col min-h-[150px]">
            {contentOpen === 1 && (
               <div className="space-y-3">
                  {
                     member.phone && (
                        <div className="flex items-center">
                           <div className="rounded bg-indigo-100 p-[5px] mr-2">
                              <Phone size={18} className='text-indigo-700' />
                           </div>
                           <span>{highlightText(member.phone)}</span>
                        </div>
                     )
                  }
                  {
                     member.email_address && (
                        <div className="flex items-center">
                           <div className="rounded bg-indigo-100 p-1 mr-2">
                              <Mail size={18} className='text-indigo-700' />
                           </div>
                           <span>{highlightText(member.email_address)}</span>
                        </div>
                     )
                  }
                  {
                     member.address1 && (
                        <div className="flex items-center">
                           <div className="rounded bg-indigo-100 p-1 mr-2">
                              <MapPin size={18} className='text-indigo-700' />
                           </div>
                           <span>{highlightText(member.address1)}</span>
                        </div>
                     )
                  }
               </div>
            )}
            {contentOpen === 2 && (
               <div className='space-y-1'>
                  <div>
                     <strong className="text-gray-700">Esittely:</strong>
                     <p className="text-gray-600 text-sm leading-tight">
                        {highlightText(member.notice)}
                     </p>
                  </div>
                  <div>
                     <strong className="text-gray-700">Tarjoamme:</strong>
                     <p className="text-gray-600 text-sm leading-tight">
                        {highlightText(member.offering)}
                     </p>
                  </div>
                  <div>
                     <strong className="text-gray-700">Etsimme:</strong>
                     <p className="text-gray-600 text-sm leading-tight">
                        {highlightText(member.searching)}
                     </p>
                  </div>
               </div>
            )}

            {contentOpen === 3 && (
               // <MemberCardWeekSearch profileId={member.profileId} />
               <MemberCardWeekSearch profileId={member.id} />
            )}
            

         </div>
         <hr className='my-5' />
         <div className='flex items-center justify-between'>
            <button onClick={() => setContentOpen(1)} className={'bg-indigo-100 px-4 py-2 rounded hover:bg-indigo-200 text-indigo-700 transition-all duration-150 ' + `${contentOpen === 1 && "!text-gray-200 bg-indigo-500 hover:text-gray-200 hover:bg-indigo-500"}`}><ContactRound /></button>
            <button onClick={() => setContentOpen(2)} className={'bg-indigo-100 px-4 py-2 rounded hover:bg-indigo-200 text-indigo-700 transition-all duration-150 ' + `${contentOpen === 2 && "!text-gray-200 bg-indigo-500 hover:text-gray-200 hover:bg-indigo-500"}`}><Info /></button>
            <button onClick={() => setContentOpen(3)} className={'bg-indigo-100 px-4 py-2 rounded hover:bg-indigo-200 text-indigo-700 transition-all duration-150 ' + `${contentOpen === 3 && "!text-gray-200 bg-indigo-500 hover:text-gray-200 hover:bg-indigo-500"}`}><Search /></button>
         </div>

         
      </div>
   );
};

export default ContactCard;

