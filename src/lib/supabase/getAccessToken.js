import { createClient } from "./component";
import {createClient as createServerClient} from './server-props'

export const getSession = async () => {
   const supabase = createClient();
   const { data, error } = await supabase.auth.getSession();
   
   console.log(error, "ERROR")

   if(error) {
      alert("ERROR getSession", error)
      return;
   }
   
   return data.session.access_token;
 }

 export const getServerPropsSession = async (ctx) => {
   const supabase = createServerClient(ctx);
   const { data, error } = await supabase.auth.getSession();
   
   console.log(data)

   if(error) {
      alert("ERROR getSession", error)
      return;
   }
   
   return data.session.access_token;
 }