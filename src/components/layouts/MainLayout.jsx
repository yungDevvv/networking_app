import { useTranslation } from 'next-i18next';
import Logo from "../ui/Logo";
import Link from "next/link";
import LanguageSwitcher from "../LanguageSwitcher";
import { LayoutDashboard, LucideUserSquare2, Network, Users, LogOut, Bell, CalendarSearch, ChevronDown, Plus, LockKeyhole } from 'lucide-react';
import AvatarBox from '../ui/AvatarBox';
import { createClient } from '../../lib/supabase/component';
import { useRouter } from 'next/router';
import { useState } from 'react';
import NotificationBell from '../NotificationBell';
import InviteUserModal from '../modals/invite-user-modal';
import { ToastContainer } from 'react-toastify';

const MainLayout = ({ children, profile, user }) => {
   const { t } = useTranslation("common")
   const router = useRouter();
   const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);

   const handleLogout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
   }

   const [isOpen, setIsOpen] = useState(false);
   const toggleDropdown = () => {
      setIsOpen(!isOpen);
   };
   
   return (
      <div>
         <header className="flex px-5 py-3 justify-between w-full items-center h-[65px] border-b-1">
            <Logo />
            <div className='flex items-center'>
               <div>
                  <NotificationBell recipientId={profile?.id} />
               </div>
               <div className="border-l border-gray-300 h-9 mx-5"></div>
               <div>
                  <LanguageSwitcher />
               </div>
               <div className="border-l border-gray-300 h-9 mx-5"></div>
               <AvatarBox firstName={profile?.first_name} lastName={profile?.last_name} avatarUrl={profile?.avatar} setInviteUserModalOpen={setInviteUserModalOpen} />
            </div>
         </header>

         <div className='flex'>
            <aside className='xl:px-5 px-3 w-[235px] xl:w-[275px]'>
               <ul>
                  <li>
                     <Link href="/" className='bg-indigo-500 transition-all duration-200 hover:bg-indigo-700 rounded-md flex items-center text-white font-medium p-2 text-sm'>
                        <LayoutDashboard className='mr-2' size={21} />
                        {t("home")}
                     </Link>
                  </li>
                  <li>
                     <Link href="/users/users-list" className='bg-indigo-500 transition-all duration-200 hover:bg-indigo-700 rounded-md flex items-center text-white font-medium p-2 mt-3 text-sm'>
                        <Users className='mr-2' size={21} />
                        {t("navbar_contacts")}
                     </Link>
                  </li>
                  <li>
                     <Link href="/network/networks" className='bg-indigo-500 transition-all duration-200 hover:bg-indigo-700 rounded-md flex items-center text-white font-medium p-2 mt-3 text-sm'>
                        <Network className='mr-2' size={21} />
                        {t("navbar_mynetworks")}
                     </Link>
                  </li>
                  <li>
                     <Link href="/auth/profile" className='bg-indigo-500 transition-all duration-200 hover:bg-indigo-700 rounded-md flex items-center text-white font-medium p-2 mt-3 text-sm'>
                        <LucideUserSquare2 className='mr-2' size={21} />
                        {t("navbar_myprofile")}
                     </Link>
                  </li>
                  <li>
                     <Link href="/private-group/groups" className='bg-indigo-500 transition-all duration-200 hover:bg-indigo-700 rounded-md flex items-center text-white font-medium p-2 mt-3 text-sm'>
                        <LockKeyhole className='mr-2' size={21} /> 
                        {t("private_groups")}
                     </Link>
                  </li>
                  
                  <li className="relative">
                     <button
                        className='bg-indigo-500 transition-all duration-200 hover:bg-indigo-700 w-full rounded-md flex items-center text-white font-medium p-2 mt-3 text-sm'
                        onClick={toggleDropdown}
                     >
                        <CalendarSearch className='mr-2' size={21} />
                        {t("navbar_week_search")}
                        <ChevronDown size={19} className={isOpen ? 'ml-auto rotate-180' : 'ml-auto'} />
                     </button>
                     {isOpen && (
                        <ul className="absolute mt-2 w-full bg-white rounded-md overflow-hidden border border-indigo-500 shadow-lg z-10">
                           <li>
                              <Link
                                 href="/week-search/my"
                                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                              >
                                 <Plus size={16} strokeWidth={2} className='text-indigo-500' /> 
                              </Link>
                           </li>
                           <li>
                              <Link
                                 href="/week-search/all"
                                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
                              >
                                 {t("all")}
                              </Link>
                           </li>
                        </ul>
                     )}
                  </li>
                  <li>
                     <button onClick={handleLogout} className='bg-indigo-500 transition-all duration-200 hover:bg-indigo-700 w-full rounded-md flex items-center text-white font-medium p-2 mt-3 text-sm'>
                        <LogOut className='mr-2' size={21} />
                        {t("navbar_logout")}
                     </button>
                  </li>

               </ul>
            </aside>
            
            <main className='bg-slate-100 w-full p-2 h-full'>
               <div className='bg-white w-full rounded-lg p-2 xl:p-4 h-full'>
                  {children}
               </div>
            </main>
         </div>
         <ToastContainer />
         {inviteUserModalOpen && <InviteUserModal setInviteUserModalOpen={setInviteUserModalOpen} />}
      </div>
   )
}

export default MainLayout;