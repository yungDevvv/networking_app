import { useState } from 'react';
import Image from 'next/image';
import { EllipsisVertical, Mail, MapPin, Phone } from 'lucide-react';
import { companiesList } from '../utils/companies_data';

const MemberCard = ({ member }) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

   const businessNetworks = member.businessNetworks
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
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Add to Network</a>
                     </li>
                     <li>
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
                     </li>
                  </ul>
               </div>
            )}
         </div>
         <div className='flex items-center'>
            <div className='mr-5'>
               <img className="w-24 h-24 rounded mx-auto object-cover" src={member.avatar ? member.avatar : '/blank_profile.png'} alt="Avatar" />
            </div>
            <div>
               <h2 className="text-md font-semibold">{member.first_name} {member.last_name}{member.role === "ADMIN" && <span className='font-normal text-red-500'> (ADMIN)</span>}</h2>
               <p className='text-indigo-500'>{member.title}</p>
               <p className=''>{member.company}</p>
            </div>
            <div className='ml-auto'>
               {
                  businessNetworks.length !== 0 &&
                  businessNetworks.map((el, i) => <img key={i} className='w-[20px] h-[20px]' src={el.image} alt="network_logo" title={el.name} />)
               }
            </div>
         </div>
         <hr className='my-5' />
         <div className="flex items-start flex-col space-y-2">
            {
               member.phone && (
                  <div className="flex items-center">
                     <div className="rounded bg-indigo-100 p-[5px] mr-2">
                        <Phone size={18} className='text-indigo-700' />
                     </div>
                     <span>{member.phone}</span>
                  </div>
               )
            }
            {
               member.email_address && (
                  <div className="flex items-center">
                     <div className="rounded bg-indigo-100 p-1 mr-2">
                        <Mail size={18} className='text-indigo-700' />
                     </div>
                     <span>{member.email_address}</span>
                  </div>
               )
            }
            {
               member.address1 && (
                  <div className="flex items-center">
                     <div className="rounded bg-indigo-100 p-1 mr-2">
                        <MapPin size={18} className='text-indigo-700' />
                     </div>
                     <span>{member.address1}</span>
                  </div>
               )
            }

         </div>
      </div>
   );
};

export default MemberCard;


