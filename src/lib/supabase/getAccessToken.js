import { createClient } from "./component";

const supabase = createClient();

export const getSession = async () => {
   const supabase = createClient();
   const { data, error } = await supabase.auth.getSession();

   if(error) {
      alert("ERROR getSession", error)
      return;
   }
   
   return data.session.access_token;
 }