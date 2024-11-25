import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const success = async (text) => {
    toast.success(text, {
     position: "bottom-center",
     autoClose: 3000,
   });
}

export const error = (text) => {
   toast.error(text, {
     position: "bottom-center",
     autoClose: 3000, 
   });
}

export const defaultToast = (text) => {
  toast(text, {
    position: "bottom-center",
    autoClose: 3000, 
  });
}