import axios from "axios"
import { getServerPropsSession, getSession } from "./supabase/getAccessToken";

export const createPrivateGroup = async (data) => {
   const access_token = await getSession(); 

   try {
      const res = await axios.post("https://nodetest.crossmedia.fi/api/private-groups",
         {
            ...data,
         },
         {
            headers: {
               'Authorization': `Bearer ${access_token}`
            }
         }
      );

      return res;
   } catch (error) {
      console.error("ERROR creating private group:", error)
   }
}

export const getPrivateGroups = async () => {
   try {
      const res = await axios.get("https://nodetest.crossmedia.fi/api/private-groups");
      return res.data;
   } catch (error) {
      console.error("ERROR fetch private group:", error)
   }
}

export const getPrivateGroupById = async (privateGroupId) => {
   try {
      const res = await axios.get("https://nodetest.crossmedia.fi/api/private-groups/" + privateGroupId);
      return res.data;
   } catch (error) {
      console.error("ERROR fetch private group:", error)
   }
}

export const getPrivateGroupMembers = async (privateGroupId) => {
   try {
      const res = await axios.get(`https://nodetest.crossmedia.fi/api/private-groups/${privateGroupId}/members`); 
      return res.data;
   } catch (error) {
      console.error("ERROR fetch private group members:", error)
   }
}

export const getUserPrivateGroups = async (ctx) => {
   const access_token = await getServerPropsSession(ctx);
   try {
      const res = await axios.get(`https://nodetest.crossmedia.fi/api/private-groups/user/1`, {
         headers: {
            'Authorization': `Bearer ${access_token}`
         }
      }); 
      
      return res.data;
   } catch (error) {
      console.error("ERROR fetch private user group :", error)
   }
}

export const getUserAdminPrivateGroups = async () => {
   const access_token = await getSession();

   try {
      const res = await axios.get(`https://nodetest.crossmedia.fi/api/private-groups/admin/1`, {
         headers: {
            'Authorization': `Bearer ${access_token}`
         }
      }); 
      return res;
   } catch (error) {
      console.error("ERROR fetch private group:", error)
   }
}

export const editPrivateGroup = async (privateGroupId, data) => {
   const access_token = await getSession();

   try {
      const res = await axios.put(`https://nodetest.crossmedia.fi/api/private-groups/${privateGroupId}`, 
         {
            ...data,
         },
         {
            headers: {
               'Authorization': `Bearer ${access_token}`
            }
         }
      ); 
      return res;
   } catch (error) {
      console.error("ERROR fetch private group members:", error)
   }
}

export const deletePrivateGroup = async (privateGroupId) => {
   const access_token = await getSession();

   try {
      const res = await axios.delete(`https://nodetest.crossmedia.fi/api/private-groups/${privateGroupId}`, 
         {
            headers: {
               'Authorization': `Bearer ${access_token}`
            }
         }
      ); 
      return res;
   } catch (error) {
      console.error("ERROR fetch private group members:", error)
   }
}

export const checkAccessToPrivateGroup = async (ctx, privateGroupId) => {
   const access_token = await getServerPropsSession(ctx); 

   try {
      const res = await axios.get(`https://nodetest.crossmedia.fi/api/private-groups/${privateGroupId}/access`, 
         {
            headers: {
               'Authorization': `Bearer ${access_token}`
            }
         }
      );
       
      return res;
   } catch (error) {
      console.error("ERROR fetch private group members:", error)
   }
}

export const removeMemberFromPrivateGroup = async (privateGroupId, memberId) => {
   const access_token = await getSession(); 

   try {
      const res = await axios.delete(`https://nodetest.crossmedia.fi/api/private-groups/${privateGroupId}/members/${memberId}`,
         {
            headers: {
               'Authorization': `Bearer ${access_token}`
            }
         }
      );
       
      return res;
   } catch (error) {
      console.error("ERROR fetch private group members:", error)
   }
}

export const InviteToPrivateGroup = async (profileId, groupId) => {
   const access_token = await getSession();
   try {
      const res = await axios.post('/api/invite', { 
         recipientId: profileId, 
         groupId 
      }, 
      {
         headers: {
            'Authorization': `Bearer ${access_token}`
         }
      });
      
      return res;
   } catch (err) {
      console.error('Error invite', err);
   }
}

export const leaveGroup = async (privateGroupId) => {
   const access_token = await getSession();
  
   try {
      const res = await axios.delete(`/api/private-groups/${privateGroupId}/leave`, {
         headers: {
            'Authorization': `Bearer ${access_token}`
         }
      });

      return res;
   } catch (error) {
      console.error('Failed leave group:', error);

      return { error: error.response?.data?.error || 'An unexpected error occurred.' };
   }
};

export const changeMemberRole = async (privateGroupId, memberProfileId, role) => {
   const access_token = await getSession();
  
   try {
      const res = await axios.put(`/api/private-groups/${privateGroupId}/members/${memberProfileId}/role`, {
         currentRole: role
      },
      {
         headers: {
            'Authorization': `Bearer ${access_token}`
         }
      });

      return res;
   } catch (error) {
      console.error('Failed change member role:', error);

      return { error: error.response?.data?.error || 'An unexpected error occurred.' };
   }
};