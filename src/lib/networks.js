import axios from "axios"
import { getSession } from "./supabase/getAccessToken";

export const getUserNetworks = async (id) => {
   try {
      const res = await axios.get('https://nodetest.crossmedia.fi/api/get-user-networks/' + id);

      return res.data;
   } catch (error) {
      console.error("ERROR fetching networks:", error)
   }
}

export const getNetworkWithMembers = async (id) => {
   try {
      const networkRes = await axios.get(`https://nodetest.crossmedia.fi/api/networks/${id}`);
      const network = networkRes.data;

      const membersRes = await axios.get(`https://nodetest.crossmedia.fi/api/networks/${id}/members`);
      const members = membersRes.data;
   
      return {
         network,
         members: members.members,
      };
   } catch (error) {
      console.error('Error fetching network or members data:', error.message);
   }
}

export const getUserAdminNetworks = async (profileId) => {
   try {
      const res = await axios.get('/api/networks/admin/' + profileId);

      return res.data;
   } catch (error) {
      console.error('Failed to add user to network:', error);

      return { error: error.response?.data?.error || 'An unexpected error occurred.' };
   }
};

export const addUserToNetwork = async (profileId, networkId) => {
   try {
      const res = await axios.post('/api/add-user-to-network', {
         profileId,
         networkId
      });

      return res.data;
   } catch (error) {
      console.error('Failed to add user to network:', error);

      return { error: error.response?.data?.error || 'An unexpected error occurred.' };
   }
};


export const removeUserFromNetwork = async (networkId, memberProfileId) => {
   const access_token = await getSession();
  
   try {
      const res = await axios.delete(`/api/networks/${networkId}/members/${memberProfileId}`, {
         headers: {
            'Authorization': `Bearer ${access_token}`
         }
      });

      return res;
   } catch (error) {
      console.error('Failed to add user to network:', error);

      return { error: error.response?.data?.error || 'An unexpected error occurred.' };
   }
};

export const leaveNetwork = async (networkId) => {
   const access_token = await getSession();
  
   try {
      const res = await axios.delete(`/api/networks/${networkId}/leave`, {
         headers: {
            'Authorization': `Bearer ${access_token}`
         }
      });

      return res;
   } catch (error) {
      console.error('Failed to add user to network:', error);

      return { error: error.response?.data?.error || 'An unexpected error occurred.' };
   }
};

export const createNetwork = async (name, profileId) => {
   try {
      const res = await axios.post("/api/create-network", {
         name,
         profileId
      })
      return res;
   } catch (error) {
      console.error(error)
   }
}

export const deleteNetwork = async (networkId) => {
   try {
      const res = await axios.delete(`/api/networks/${networkId}/delete`);

   } catch (error) {
      console.error(error)
   }
}