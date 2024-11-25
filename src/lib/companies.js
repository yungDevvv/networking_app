import axios from "axios"
import { getSession } from "./supabase/getAccessToken";

export const getCompanies = async () => {
   try {
      const res = await axios.get("https://nodetest.crossmedia.fi/api/companies"); 
      return res.data;
   } catch (error) {
      console.log("ERROR fetching companies", error)
   }
}

export const getUserCompany = async (profileId) => {
   
   try {
      const res = await axios.get(`https://nodetest.crossmedia.fi/api/companies/${profileId}`); 
      return res.data;
   } catch (error) {
      console.log("ERROR fetching companies", error)
   }
}

export const createCompany = async (name, logo, profileId) => {
   try {
      const res = await axios.post("https://nodetest.crossmedia.fi/api/companies", {
          company_name: name,
          company_logo: logo,
          profileId
       })
       return res;
    } catch (error) {
       console.error("ERROR creating company ", error)
       return error;
    }
}

export const editCompany = async (company_name, company_logo, companyId) => {
   const access_token = await getSession(); 

   try {
      const res = await axios.put("https://nodetest.crossmedia.fi/api/companies/" + companyId, 
         {
          company_name,
          company_logo
         },
         {
            headers: {
               'Authorization': `Bearer ${access_token}`  
             }
         }
      )
       return res;
    } catch (error) {
       console.error("ERROR creating company ", error)
       return error;
    }
}

export const deleteCompany = async (companyId) => {
   const access_token = await getSession(); 

   try {
      const res = await axios.delete("https://nodetest.crossmedia.fi/api/companies/" + companyId, 
         {
            headers: {
               'Authorization': `Bearer ${access_token}`  
             }
         }
      )
       return res;
    } catch (error) {
       console.error("ERROR creating company ", error)
       return error;
    }
}