import { X } from "lucide-react"
import { Fragment, useEffect, useRef, useState } from "react";
import { createCompany, editCompany } from "../../lib/companies";

function CreateCompanyModal({ profileId, setCreateCompanyModalOpen, userCompany }) {
   const [companyName, setCompanyName] = useState(userCompany ? userCompany.company_name : "");
   const [errorMessage, setErrorMessage] = useState("");
   const [companyImage, setCompanyImage] = useState(userCompany ? userCompany.company_logo : "");

   const fileInputRef = useRef();
  
   const handleSubmit = async () => {
      const res = await createCompany(companyName, profileId);

      if (res.status === 201) {
         setCreateCompanyModalOpen(false);
      } else {
         setErrorMessage(res.response.data.error)
      }
   }
   const handleEdit = async () => {
      const res = await editCompany(companyName, companyImage, userCompany.id);

      if (res.status === 200) {
         setCreateCompanyModalOpen(false);
      } else {
         console.log(res.response.data.message)
         setErrorMessage(res.response.data.message)
      }
   }
   
   const handleImage = (e) => {

      const { files } = e.target;

      const maxSize = 1 * 1024 * 1024; 

      if (files[0] && files[0].size > maxSize) {
         e.preventDefault();
         setErrorMessage('File size exceeds 1 MB limit!');
         return;
      }
 
      if (files.length > 0) {
         const file = files[0];
         const reader = new FileReader();
         reader.onloadend = () => {
            console.log(reader.result)
            setCompanyImage(reader.result)
         };

         reader.readAsDataURL(file);
      }
   }

   const removeAvatar = () => {
      if (fileInputRef.current) {
         setCompanyImage("")
         fileInputRef.current.value = '';
      }
   }


   useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = "auto";
      }
   }, [])

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-hidden">
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full ">
            <div className="flex justify-between items-center">
               <div>
                  <h2 className="text-xl font-semibold -mt-1">{userCompany ? "Edit company" : "Create company"}</h2>
                  <small className="block">
                     {userCompany
                        ? "The changes will also take effect for all users who have chosen this company."
                        : "Make sure that you don't miss spell company name"
                     }
                  </small>
                  {errorMessage && <p className="text-sm text-red-500 my-1">{errorMessage}</p>}
               </div>
               <button
                  onClick={() => setCreateCompanyModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 block mb-auto"
               >
                  <X />
               </button>
            </div>
            <div className="my-5">
               <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Company name <span className='text-red-600'>*</span></label>
                  <input
                     id="name"
                     name="name"
                     type="text"
                     value={companyName}
                     onChange={(e) => setCompanyName(e.target.value)}
                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     required
                  />
               </div>
               <div className="mt-2">
                  <label htmlFor="companyImage" className="block text-sm font-medium text-gray-700">Company Logo (Max size: 0.5MB) <span className='text-red-600'>*</span></label>
                  <input
                     id="companyImage"
                     name="companyImage"
                     type="file"
                     ref={fileInputRef}
                     onChange={handleImage}
                     className="cursor-pointer mt-1 block w-[50%] px-3 py-[5px] border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {companyImage
                     ? (
                        <div className='relative w-32 h-32'>
                           <img className='w-32 h-32 rounded object-contain mt-4' src={companyImage} alt="company-image" />
                           <span onClick={() => removeAvatar()} className='bg-red-600 hover:bg-red-700 rounded-full inline-block p-1 cursor-pointer absolute right-[-5px] top-[-5px]'>
                              <X color="#fff" size={14} />
                           </span>
                        </div>
                     ) : ''
                  }
               </div>
            </div>
            <div className="w-full flex justify-between items-center">
               {userCompany
                  ? (
                     <Fragment>
                        <button onClick={() => handleEdit()} className="bg-indigo-600 self-start text-white py-2 px-4 rounded-md hover:bg-indigo-700">Edit</button>
                        <button type="button" className="bg-red-500 self-start text-white py-2 px-4 rounded-md hover:bg-red-700">Delete</button>
                     </Fragment>
                     
                  )
                  : <button onClick={() => handleSubmit()} className="bg-indigo-600 self-start text-white py-2 px-4 rounded-md hover:bg-indigo-700">Create</button>
               }
            </div>
         </div>
      </div>
   )
}

export default CreateCompanyModal;