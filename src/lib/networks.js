import axios from "axios"

export const getUserNetworks = async (id) => {
   try {
      const res = await axios.get('https://nodetest.crossmedia.fi/api/get-user-networks/' + id);

      return res.data;
   } catch (error) {
      console.error("ERROR fetching networks:", error)
   }
}

export const getNetwork = async (id) => {
   try {
      const networkRes = await axios.get(`https://nodetest.crossmedia.fi/api/networks/${id}`);
      const network = networkRes.data;
      
      const membersRes = await axios.get(`https://nodetest.crossmedia.fi/api/networks/${id}/members`);
      const members = membersRes.data;
      console.log(members, "ASDASD")
      return {
          network,
          members: members.members,  
      };
    } catch (error) {
      console.error('Error fetching network or members data:', error.message);
  
      // return {
      //   notFound: true,
      // };
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


export const removeUserFromNetwork = async (profileId, networkId, memberId) => {
   try {
      const res = await axios.post('/api/networks/remove-member', {
         profileId,
         networkId,
         memberId
      });

      return res.data;
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